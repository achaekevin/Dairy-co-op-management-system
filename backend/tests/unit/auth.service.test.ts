import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import authService from '../../src/modules/auth/auth.service.js';
import authRepository from '../../src/modules/auth/auth.repository.js';
import { ConflictError, UnauthorizedError } from '../../src/core/errors.js';

jest.mock('../../src/modules/auth/auth.repository.js');
jest.mock('../../src/shared/services/email.service.js');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const mockRegisterData = {
      email: 'test@example.com',
      password: 'Test@123',
      firstName: 'John',
      lastName: 'Doe',
      tenantId: '123e4567-e89b-12d3-a456-426614174000',
    };

    it('should register a new user successfully', async () => {
      (authRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (authRepository.createUser as jest.Mock).mockResolvedValue({
        id: '123',
        email: mockRegisterData.email,
        firstName: mockRegisterData.firstName,
        lastName: mockRegisterData.lastName,
        role: 'USER',
        tenantId: mockRegisterData.tenantId,
        isEmailVerified: false,
      });
      (authRepository.createEmailVerificationToken as jest.Mock).mockResolvedValue(undefined);
      (authRepository.createRefreshToken as jest.Mock).mockResolvedValue(undefined);
      (authRepository.createAuditLog as jest.Mock).mockResolvedValue(undefined);

      const result = await authService.register(mockRegisterData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockRegisterData.email);
    });

    it('should throw ConflictError if user already exists', async () => {
      (authRepository.findUserByEmail as jest.Mock).mockResolvedValue({
        id: '123',
        email: mockRegisterData.email,
      });

      await expect(authService.register(mockRegisterData)).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    const mockLoginData = {
      email: 'test@example.com',
      password: 'Test@123',
    };

    it('should throw UnauthorizedError if user not found', async () => {
      (authRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(mockLoginData)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if account is inactive', async () => {
      (authRepository.findUserByEmail as jest.Mock).mockResolvedValue({
        id: '123',
        email: mockLoginData.email,
        isActive: false,
      });

      await expect(authService.login(mockLoginData)).rejects.toThrow(UnauthorizedError);
    });
  });
});
