import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '@core/errors.js';
import { hashPassword, comparePassword, generateRandomToken } from '@shared/utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '@shared/utils/jwt.js';
import emailService from '@shared/services/email.service.js';
import authRepository from './auth.repository.js';
import {
  RegisterData,
  LoginData,
  RefreshTokenData,
  VerifyEmailData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  AuthResponse,
} from './auth.types.js';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const existingUser = await authRepository.findUserByEmail(data.email, data.tenantId);

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const passwordHash = await hashPassword(data.password);

    const user = await authRepository.createUser({
      ...data,
      passwordHash,
    });

    const verificationToken = generateRandomToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await authRepository.createEmailVerificationToken(
      user.id,
      verificationToken,
      verificationExpires
    );

    await emailService.sendVerificationEmail(user.email, verificationToken);

    const jwtPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepository.createRefreshToken(user.id, refreshToken, refreshTokenExpires);

    await authRepository.createAuditLog(user.id, 'USER_REGISTERED');

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginData, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // If tenantId is provided, use it; otherwise find by subdomain 'default'
    let tenantId = data.tenantId;
    
    if (!tenantId) {
      const defaultTenant = await authRepository.findTenantBySubdomain('default');
      if (!defaultTenant) {
        throw new UnauthorizedError('Tenant not found');
      }
      tenantId = defaultTenant.id;
    }
    
    const user = await authRepository.findUserByEmail(data.email, tenantId);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is inactive');
    }

    const isPasswordValid = await comparePassword(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const jwtPayload = {
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepository.createRefreshToken(user.id, refreshToken, refreshTokenExpires);

    await authRepository.createAuditLog(user.id, 'USER_LOGIN', ipAddress, userAgent);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(data: RefreshTokenData): Promise<Omit<AuthResponse, 'user'>> {
    const tokenRecord = await authRepository.findRefreshToken(data.refreshToken);

    if (!tokenRecord || !tokenRecord.user) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    await authRepository.revokeRefreshToken(data.refreshToken);

    const jwtPayload = {
      userId: tokenRecord.user.id,
      tenantId: tokenRecord.user.tenantId,
      email: tokenRecord.user.email,
      role: tokenRecord.user.role,
    };

    const accessToken = generateAccessToken(jwtPayload);
    const refreshToken = generateRefreshToken(jwtPayload);

    const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await authRepository.createRefreshToken(tokenRecord.userId, refreshToken, refreshTokenExpires);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyEmail(data: VerifyEmailData): Promise<void> {
    const user = await authRepository.findUserByVerificationToken(data.token);

    if (!user) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    await authRepository.verifyUserEmail(user.id);
    await emailService.sendWelcomeEmail(user.email, user.firstName);
  }

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    const user = await authRepository.findUserByEmail(data.email, data.tenantId);

    if (!user) {
      return;
    }

    const resetToken = generateRandomToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    await authRepository.createPasswordResetToken(user.id, resetToken, resetExpires);
    await emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    const user = await authRepository.findUserByResetToken(data.token);

    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const passwordHash = await hashPassword(data.password);

    await authRepository.updateUser(user.id, { passwordHash });
    await authRepository.clearPasswordResetToken(user.id);
    await authRepository.revokeAllUserRefreshTokens(user.id);
  }

  async changePassword(
    userId: string,
    data: ChangePasswordData
  ): Promise<void> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await comparePassword(data.currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const passwordHash = await hashPassword(data.newPassword);

    await authRepository.updateUser(user.id, { passwordHash });
    await authRepository.revokeAllUserRefreshTokens(user.id);
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await authRepository.revokeRefreshToken(refreshToken);
    await authRepository.createAuditLog(userId, 'USER_LOGOUT');
  }

  async logoutAll(userId: string): Promise<void> {
    await authRepository.revokeAllUserRefreshTokens(userId);
    await authRepository.createAuditLog(userId, 'USER_LOGOUT_ALL');
  }
}

export default new AuthService();
