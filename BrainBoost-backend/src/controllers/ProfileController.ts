import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { UserRepository } from '../repositories/UserRepository';
import * as argon2 from 'argon2';

export class ProfileController {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const user = await this.userRepository.findById(userId);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ data: user });
        } catch (error) {
            console.error('Error getProfile():', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const { username, dob, avatar_url } = req.body;

            const updatedUser = await this.userRepository.updateById(userId, {
                username,
                dob,
                avatar_url,
            });

            if (!updatedUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json({ data: updatedUser });
        } catch (error) {
            console.error('Error updateProfile():', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { current_password, new_password, userId } = req.body;

            if (!current_password || !new_password) {
                res.status(400).json({ message: 'Current password and new password are required' });
                return;
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const isPasswordValid = await argon2.verify(user.password, current_password);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Incorrect current password' });
                return;
            }

            const hashedNewPassword = await argon2.hash(new_password);

            const updatedUser = await this.userRepository.updateById(userId, {
                password: hashedNewPassword,
            });

            if (!updatedUser) {
                res.status(500).json({ message: 'Failed to update password' });
                return;
            }

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error changePassword():', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}
