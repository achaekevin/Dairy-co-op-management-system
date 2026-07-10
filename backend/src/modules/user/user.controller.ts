import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendSuccess } from '../../core/response';

export class UserController {
  private service = new UserService();

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { tenantId } = req.user!;
      const { search, role, status, page = 1, limit = 100 } = req.query;

      const result = await this.service.getAll(
        tenantId,
        search as string,
        role as string,
        status as string,
        Number(page),
        Number(limit)
      );

      return sendSuccess(res, result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { tenantId, role: currentUserRole } = req.user!;
      const { id } = req.params;

      if (currentUserRole !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can delete users',
        });
      }

      await this.service.delete(tenantId, id);

      return sendSuccess(res, { message: 'User deleted successfully' }, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
