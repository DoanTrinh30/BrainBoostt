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
            const { email, password, confirmPassword } = req.body;

            if (confirmPassword !== password) {
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
            const newUser = await this.userRepository.create({
                email,
                password: hashedPassword,
            });
            const accessToken = jwt.sign({ id: newUser.id, email: newUser.email }, jwtSecret, {
                expiresIn: '7d',
            });

            res.status(200).json({ message: 'User created successfully', token: accessToken });
        } catch (error) {
            console.error('Error signing up user', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    signIn = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                res.status(400).json({ message: 'Invalid email' });
                return;
            }

            const isPasswordValid = await argon2.verify(user.password, password);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Invalid password' });
                return;
            }

            const accessToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET!,
                {
                    expiresIn: '7d',
                }
            );
            res.status(200).json({ message: 'User signed in successfully', token: accessToken });
        } catch (error) {
            console.error('Error signing in user', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}
