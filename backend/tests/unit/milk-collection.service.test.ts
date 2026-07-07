import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import milkCollectionService from '../../src/modules/milk-collection/milk-collection.service.js';
import milkCollectionRepository from '../../src/modules/milk-collection/milk-collection.repository.js';
import farmerRepository from '../../src/modules/farmer/farmer.repository.js';
import { ConflictError, NotFoundError, BadRequestError } from '../../src/core/errors.js';

jest.mock('../../src/modules/milk-collection/milk-collection.repository.js');
jest.mock('../../src/modules/farmer/farmer.repository.js');
jest.mock('../../src/shared/services/cache.service.js');

describe('MilkCollectionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMilkCollection', () => {
    const mockTenantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockCollectionData = {
      farmerId: '456e7890-e89b-12d3-a456-426614174000',
      date: new Date('2024-01-15'),
      shift: 'MORNING' as const,
      quantity: 10,
      fat: 4.5,
      snf: 8.5,
      collectedBy: 'John Doe',
    };

    it('should create milk collection successfully', async () => {
      (farmerRepository.findById as jest.Mock).mockResolvedValue({
        id: mockCollectionData.farmerId,
        status: 'ACTIVE',
      });
      (milkCollectionRepository.checkDuplicateCollection as jest.Mock).mockResolvedValue(false);
      (milkCollectionRepository.create as jest.Mock).mockResolvedValue({
        id: '789',
        ...mockCollectionData,
        quality: 'EXCELLENT',
        amount: 350,
      });

      const result = await milkCollectionService.createMilkCollection(
        mockTenantId,
        mockCollectionData
      );

      expect(result).toHaveProperty('id');
      expect(farmerRepository.findById).toHaveBeenCalledWith(
        mockCollectionData.farmerId,
        mockTenantId
      );
    });

    it('should throw NotFoundError if farmer not found', async () => {
      (farmerRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        milkCollectionService.createMilkCollection(mockTenantId, mockCollectionData)
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if farmer is not active', async () => {
      (farmerRepository.findById as jest.Mock).mockResolvedValue({
        id: mockCollectionData.farmerId,
        status: 'INACTIVE',
      });

      await expect(
        milkCollectionService.createMilkCollection(mockTenantId, mockCollectionData)
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw ConflictError if duplicate collection exists', async () => {
      (farmerRepository.findById as jest.Mock).mockResolvedValue({
        id: mockCollectionData.farmerId,
        status: 'ACTIVE',
      });
      (milkCollectionRepository.checkDuplicateCollection as jest.Mock).mockResolvedValue(true);

      await expect(
        milkCollectionService.createMilkCollection(mockTenantId, mockCollectionData)
      ).rejects.toThrow(ConflictError);
    });
  });
});
