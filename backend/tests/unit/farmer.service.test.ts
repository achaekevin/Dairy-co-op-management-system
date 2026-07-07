import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import farmerService from '../../src/modules/farmer/farmer.service.js';
import farmerRepository from '../../src/modules/farmer/farmer.repository.js';
import { ConflictError, NotFoundError } from '../../src/core/errors.js';

jest.mock('../../src/modules/farmer/farmer.repository.js');
jest.mock('../../src/shared/services/cache.service.js');

describe('FarmerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createFarmer', () => {
    const mockTenantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockFarmerData = {
      farmerId: 'F001',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      email: 'john@example.com',
      cattle: 5,
    };

    it('should create a new farmer successfully', async () => {
      (farmerRepository.findByFarmerId as jest.Mock).mockResolvedValue(null);
      (farmerRepository.create as jest.Mock).mockResolvedValue({
        id: '123',
        ...mockFarmerData,
        tenantId: mockTenantId,
      });

      const result = await farmerService.createFarmer(mockTenantId, mockFarmerData);

      expect(result).toHaveProperty('id');
      expect(result.farmerId).toBe(mockFarmerData.farmerId);
      expect(farmerRepository.findByFarmerId).toHaveBeenCalledWith(
        mockFarmerData.farmerId,
        mockTenantId
      );
      expect(farmerRepository.create).toHaveBeenCalledWith(mockTenantId, mockFarmerData);
    });

    it('should throw ConflictError if farmer ID already exists', async () => {
      (farmerRepository.findByFarmerId as jest.Mock).mockResolvedValue({
        id: '123',
        farmerId: mockFarmerData.farmerId,
      });

      await expect(
        farmerService.createFarmer(mockTenantId, mockFarmerData)
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('getFarmerById', () => {
    const mockTenantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockFarmerId = '456e7890-e89b-12d3-a456-426614174000';

    it('should throw NotFoundError if farmer does not exist', async () => {
      (farmerRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        farmerService.getFarmerById(mockFarmerId, mockTenantId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateFarmer', () => {
    const mockTenantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockFarmerId = '456e7890-e89b-12d3-a456-426614174000';

    it('should throw NotFoundError if farmer does not exist', async () => {
      (farmerRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        farmerService.updateFarmer(mockFarmerId, mockTenantId, { firstName: 'Jane' })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteFarmer', () => {
    const mockTenantId = '123e4567-e89b-12d3-a456-426614174000';
    const mockFarmerId = '456e7890-e89b-12d3-a456-426614174000';

    it('should throw NotFoundError if farmer does not exist', async () => {
      (farmerRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        farmerService.deleteFarmer(mockFarmerId, mockTenantId)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
