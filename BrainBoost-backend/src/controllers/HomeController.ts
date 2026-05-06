import { Response } from 'express';
import { DeckRepository } from '../repositories/DeckRepository';
import { ClassRepository } from '../repositories/ClassRepository';
import { FolderRepository } from '../repositories/FolderRepository';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class HomeController {
    private deckRepository: DeckRepository;
    private classRepository: ClassRepository;
    private folderRepository: FolderRepository;

    constructor() {
        this.deckRepository = new DeckRepository();
        this.classRepository = new ClassRepository();
        this.folderRepository = new FolderRepository();
    }

    getResourcesForUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;

            const [decks, classes, folders] = await Promise.all([
                this.deckRepository.findByUserId(userId),
                this.classRepository.findByUserId(userId),
                this.folderRepository.findByUserId(userId),
            ]);
            res.status(200).json({
                data: {
                    decks,
                    classes,
                    folders,
                },
            });
        } catch (error) {
            console.log('Error fetching decks:', error);
            res.status(500).json({
                message: error || 'Internal server error',
            });
        }
    };

    search = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const keyword = req.query.keyword as string;
            const limit = parseInt(req.query.limit as string) || 10;

            if (!keyword) {
                res.status(400).json({ message: 'Missing search keyword' });
                return;
            }

            const decks = await this.deckRepository.findByKeyword(keyword);

            res.status(200).json({
                data: {
                    decks,
                },
            });
        } catch (error) {
            console.error('Error during search:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}
