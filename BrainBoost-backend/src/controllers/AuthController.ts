import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import argon2 from 'argon2';

dotenv.config();

export class AuthController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    signUp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, confirmPassword, username, role } = req.body;

            // Validate input
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }

            if (confirmPassword && confirmPassword !== password) {
                res.status(400).json({ message: 'Passwords do not match' });
                return;
            }

            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(500).json({ message: 'JWT secret not configured' });
                return;
            }

            const hashedPassword = await argon2.hash(password);
            
            // Tạo user mới với role (mặc định: student nếu không chỉ định)
            const newUser = await this.userRepository.create({
                email,
                password: hashedPassword,
                username: username || email.split('@')[0],
                role: role || 'student',
                status: 'active'
            } as any);

            // Tạo token với đầy đủ thông tin
            const accessToken = jwt.sign(
                { 
                    id: newUser.id, 
                    email: newUser.email,
                    username: newUser.username,
                    role: newUser.role
                }, 
                jwtSecret,
                { expiresIn: '7d' }
            );

            console.log('✅ User registered:', { id: newUser.id, email, role: newUser.role });
            res.status(200).json({ 
                message: 'User created successfully', 
                token: accessToken,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    username: newUser.username,
                    role: newUser.role
                }
            });
        } catch (error) {
            console.error('❌ Error signing up user', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    signIn = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                res.status(400).json({ message: 'Email and password are required' });
                return;
            }

            // Tìm user theo email
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                console.warn('⚠️ User not found:', email);
                res.status(400).json({ message: 'Invalid email or password' });
                return;
            }

            // Check status
            if (user.status === 'banned') {
                console.warn('⚠️ User banned:', email);
                res.status(403).json({ message: 'Account has been banned' });
                return;
            }

            // Verify password
            const isPasswordValid = await argon2.verify(user.password, password);
            if (!isPasswordValid) {
                console.warn('⚠️ Invalid password for user:', email);
                res.status(400).json({ message: 'Invalid email or password' });
                return;
            }

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                res.status(500).json({ message: 'JWT secret not configured' });
                return;
            }

            // Tạo token với đầy đủ thông tin (role + username)
            const accessToken = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email,
                    username: user.username || email.split('@')[0],
                    role: user.role
                },
                jwtSecret,
                { expiresIn: '7d' }
            );

            console.log('✅ User signed in:', { id: user.id, email, role: user.role });
            res.status(200).json({ 
                message: 'User signed in successfully', 
                token: accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username || email.split('@')[0],
                    role: user.role
                }
            });
        } catch (error) {
            console.error('❌ Error signing in user', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    // Endpoint: Get current user profile
    getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            console.log('✅ Retrieved user profile:', { id: user.id, email: user.email });
            res.status(200).json({ 
                message: 'User profile retrieved', 
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    status: user.status
                }
            });
        } catch (error) {
            console.error('❌ Error retrieving user profile', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    // Endpoint: Change password
    changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            const { currentPassword, newPassword, confirmPassword } = req.body;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            if (!currentPassword || !newPassword) {
                res.status(400).json({ message: 'Current and new password are required' });
                return;
            }

            if (newPassword !== confirmPassword) {
                res.status(400).json({ message: 'Passwords do not match' });
                return;
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Verify current password
            const isPasswordValid = await argon2.verify(user.password, currentPassword);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Current password is incorrect' });
                return;
            }

            // Hash new password
            const hashedPassword = await argon2.hash(newPassword);

            // Update password in database
            await this.userRepository.updatePassword(userId, hashedPassword);

            console.log('✅ Password changed for user:', userId);
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('❌ Error changing password', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    // Endpoint: Update profile
    updateProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            const { username, avatar_url, dob } = req.body;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            // Update user
            const updatedUser = await this.userRepository.updateById(userId, {
                username: username || user.username,
                avatar_url: avatar_url || user.avatar_url,
                dob: dob || user.dob,
            });

            if (!updatedUser) {
                res.status(500).json({ message: 'Failed to update profile' });
                return;
            }

            console.log('✅ User profile updated:', { id: userId, email: user.email });
            res.status(200).json({ 
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    username: updatedUser.username,
                    avatar_url: updatedUser.avatar_url,
                    dob: updatedUser.dob,
                    role: updatedUser.role
                }
            });
        } catch (error) {
            console.error('❌ Error updating profile', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}