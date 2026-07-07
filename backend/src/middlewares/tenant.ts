import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '@core/errors.js';
import prisma from '@database/client.js';

export const tenantIsolation = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        id: req.user.tenantId,
        isActive: true,
        deletedAt: null,
      },
    });

    if (!tenant) {
      throw new ForbiddenError('Tenant not found or inactive');
    }

    req.tenantId = tenant.id;

    next();
  } catch (error) {
    next(error);
  }
};

export const validateTenantAccess = (tenantIdField: string = 'tenantId') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.tenantId) {
        throw new UnauthorizedError('Authentication required');
      }

      const resourceTenantId = req.params[tenantIdField] || req.body[tenantIdField];

      if (resourceTenantId && resourceTenantId !== req.tenantId) {
        throw new ForbiddenError('Access denied to this resource');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
