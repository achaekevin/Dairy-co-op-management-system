import prisma from '@database/client.js';
import { User, RefreshToken, UserRole, Tenant } from '@prisma/client';
import { RegisterData } from './auth.types.js';

class AuthRepository {
  async findTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    return prisma.tenant.findUnique({
      where: {
        subdomain,
      },
    });
  }

  async createUser(data: RegisterData & { passwordHash: string }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone || null,
        tenantId: data.tenantId as string,
        role: (data.role as UserRole) || UserRole.VIEWER,
      },
    });
  }

  async findUserByEmail(email: string, tenantId?: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        ...(tenantId && { tenantId }),
        deletedAt: null,
      },
    });
  }

  async findUserById(userId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findRefreshToken(token: string): Promise<(RefreshToken & { user: User }) | null> {
    return prisma.refreshToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
      },
    });
  }

  async findUserByResetToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
        deletedAt: null,
      },
    });
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
  }

  async createEmailVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expiresAt,
      },
    });
  }

  async findUserByVerificationToken(token: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
        deletedAt: null,
      },
    });
  }

  async verifyUserEmail(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });
  }

  async createAuditLog(
    userId: string,
    action: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent,
      },
    });
  }
}

export default new AuthRepository();
