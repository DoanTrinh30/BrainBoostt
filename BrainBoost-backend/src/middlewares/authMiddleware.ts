import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedRequest extends Request {
    user: { id: number; email: string };
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
        };
        (req as AuthenticatedRequest).user = { id: decoded.id, email: decoded.email };
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Invalid or expired token.',
        });
        return;
    }
};
