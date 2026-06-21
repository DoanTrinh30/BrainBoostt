import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import { AppDataSource } from '../../ormconfig';

export class AdminController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Get all users with pagination
   */
  getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string;
      const status = req.query.status as string;

      const userRepository = AppDataSource.getRepository('User');
      let query = userRepository.createQueryBuilder('user');

      if (role) {
        query = query.where('user.role = :role', { role });
      }

      if (status) {
        query = query.andWhere('user.status = :status', { status });
      }

      const total = await query.getCount();

      const users = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      res.status(200).json({
        data: users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error getUsers():', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Get user by ID
   */
  getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      res.status(200).json({ data: user });
    } catch (error) {
      console.error('Error getUserById():', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Update user (role, status, username)
   */
  updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const { role, status, username } = req.body;

      const user = await this.userRepository.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updatedUser = await this.userRepository.updateById(userId, {
        role: role || user.role,
        status: status || user.status,
        username: username || user.username,
      });

      res.status(200).json({
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error updateUser():', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Delete user
   */
  deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      await this.userRepository.delete(userId);

      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleteUser():', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Ban user
   */
  banUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updatedUser = await this.userRepository.updateById(userId, {
        status: 'banned',
      });

      res.status(200).json({
        message: 'User banned successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error banUser():', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Unban user
   */
  unbanUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const updatedUser = await this.userRepository.updateById(userId, {
        status: 'active',
      });

      res.status(200).json({
        message: 'User unbanned successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Error unbanUser():', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Get dashboard statistics
   */
  getStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userRepository = AppDataSource.getRepository('User');

      const totalUsers = await userRepository.count();
      const studentCount = await userRepository.count({ where: { role: 'student' } as any });
      const teacherCount = await userRepository.count({ where: { role: 'teacher' } as any });
      const adminCount = await userRepository.count({ where: { role: 'admin' } as any });
      const activeUsers = await userRepository.count({ where: { status: 'active' } as any });
      const bannedUsers = await userRepository.count({ where: { status: 'banned' } as any });

      res.status(200).json({
        data: {
          totalUsers,
          byRole: {
            students: studentCount,
            teachers: teacherCount,
            admins: adminCount,
          },
          byStatus: {
            active: activeUsers,
            banned: bannedUsers,
          },
        },
      });
    } catch (error) {
      console.error('Error getStats():', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}