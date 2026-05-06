import { FlashcardRepository } from './../repositories/FlashcardRepository';
import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class FlashcardController {
    private flashcardRepository: FlashcardRepository;

    constructor() {
        this.flashcardRepository = new FlashcardRepository();
    }

    getQuantity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const flashcardCount = await this.flashcardRepository.countByUserId(userId);

            res.status(200).json({
                data: {
                    flashcardCount,
                },
            });
        } catch (error) {
            console.error('Error getQuantity(): ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}