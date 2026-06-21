import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedRequest extends Request {
    user: { id: number; email: string; username?: string; role?: string };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({
            message: 'Access denied. No token provided.',
        });
        return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        res.status(500).json({
            message: 'JWT secret not configured.',
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as {
            id: number;
            email: string;
            username?: string;
            role?: string;
        };
        (req as AuthenticatedRequest).user = { 
            id: decoded.id, 
            email: decoded.email,
            username: decoded.username,
            role: decoded.role
        };
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token.',
        });
        return;
    }
};

/**
 * Role Check Middleware - Verify user role
 */
export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as AuthenticatedRequest).user;

        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!allowedRoles.includes(user.role || 'student')) {
            console.warn(`❌ Access denied for role: ${user.role}`);
            res.status(403).json({ message: 'Forbidden - insufficient permissions' });
            return;
        }

        console.log(`✅ Role check passed for user ${user.id} (${user.role})`);
        next();
    };
};