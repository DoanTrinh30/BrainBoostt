import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import {
  authMiddleware,
  requireRole,
  AuthenticatedRequest
} from '../middlewares/authMiddleware';

const adminRouter = Router();
const adminController = new AdminController();

// Apply auth middleware to all admin routes
adminRouter.use(authMiddleware);
adminRouter.use(requireRole(['admin']));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, teacher, admin]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, banned]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users list retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
adminRouter.get('/users', (req, res) =>
  adminController.getUsers(req as unknown as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user details
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
adminRouter.get('/users/:id', (req, res) =>
  adminController.getUserById(req as unknown as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user (role, status)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *               status:
 *                 type: string
 *                 enum: [active, inactive, banned]
 *               username:
 *                 type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
adminRouter.put('/users/:id', (req, res) =>
  adminController.updateUser(req as unknown as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
adminRouter.delete('/users/:id', (req, res) =>
  adminController.deleteUser(req as unknown as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   post:
 *     summary: Ban user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User banned
 */
adminRouter.post('/users/:id/ban', (req, res) =>
  adminController.banUser(req as unknown as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/admin/users/{id}/unban:
 *   post:
 *     summary: Unban user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User unbanned
 */
adminRouter.post('/users/:id/unban', (req, res) =>
  adminController.unbanUser(req as unknown as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
adminRouter.get('/stats', (req, res) =>
  adminController.getStats(req as unknown as AuthenticatedRequest, res)
);

export default adminRouter;