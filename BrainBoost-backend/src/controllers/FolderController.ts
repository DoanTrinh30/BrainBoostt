import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { FolderRepository } from '../repositories/FolderRepository';

export class FolderController {
    private folderRepository: FolderRepository;

    constructor() {
        this.folderRepository = new FolderRepository();
    }

    getQuantity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const folderCount = await this.folderRepository.countByUserId(userId);

            res.status(200).json({
                data: {
                    folderCount,
                },
            });
        } catch (error) {
            console.error('Error getQuantity(): ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}