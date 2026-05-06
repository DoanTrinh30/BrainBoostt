import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { DeckRepository } from '../repositories/DeckRepository';
import { FlashcardRepository } from '../repositories/FlashcardRepository';
import { Flashcard } from '../entities';

export class DeckController {
    private deckRepository: DeckRepository;
    private flashcardRepository: FlashcardRepository;

    constructor() {
        this.deckRepository = new DeckRepository();
        this.flashcardRepository = new FlashcardRepository();
    }

    getDecks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;

            const decks = await this.deckRepository.findByUserId(userId, 'all');

            res.status(200).json({
                data: {
                    decks,
                },
            });
        } catch (error) {
            console.error('Error getDecks(): ', error);
            res.status(500).json({
                message: 'Oops! Sorry, we have some problems',
            });
        }
    };

    getDeckById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const deckId = req.params.id;

            if (!deckId || Array.isArray(deckId)) {
                res.status(400).json({
                    message: 'Deck ID is required',
                });
                return;
            }

            const deck = await this.deckRepository.findById(deckId);

            if (!deck) {
                res.status(404).json({
                    message: 'Deck not found',
                });
                return;
            }

            const flashcards =
                await this.flashcardRepository.findByDeckId(deckId, 'all');

            res.status(200).json({
                data: {
                    ...deck,
                    flashcards,
                },
            });
        } catch (error) {
            console.error('Error getDeckById(): ', error);

            res.status(500).json({
                message: 'Oops! Sorry, we have some problems',
            });
        }
    };

    addDeck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        const userId = req.user.id;

        const { name, description } = req.body;

        if (!name || !description) {
            res.status(400).json({
                message: 'Name and description are required',
            });
            return;
        }

        const newDeck = await this.deckRepository.create({
            name,
            description,
            author: {
                id: userId,
            },
        });

        if (!newDeck) {
            res.status(500).json({
                message: 'Error creating deck',
            });
            return;
        }

        res.status(200).json({
            data: newDeck,
        });
    };

    addFlashcards = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const deckId = req.params.id;

            if (!deckId || Array.isArray(deckId)) {
                res.status(400).json({
                    message: 'Deck ID is required',
                });
                return;
            }

            const { flashcards } = req.body;

            if (
                !flashcards ||
                !Array.isArray(flashcards) ||
                flashcards.length === 0
            ) {
                res.status(400).json({
                    message: 'Valid flashcards array is required',
                });
                return;
            }

            const deck = await this.deckRepository.findById(deckId);

            if (!deck) {
                res.status(404).json({
                    message: 'Deck not found',
                });
                return;
            }

            const flashcardsToSave = flashcards.map((card) => ({
                frontText: card.term,
                backText: card.definition,
                deck: deck,
            }));

            const savedFlashcards =
                await this.flashcardRepository.createMany(
                    flashcardsToSave
                );

            res.status(200).json({
                data: savedFlashcards,
            });
        } catch (error) {
            console.error('Error adding flashcards:', error);

            res.status(500).json({
                message: 'Error adding flashcards to deck',
            });
        }
    };

    updateDeck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const deckId = req.params.id;

            if (!deckId || Array.isArray(deckId)) {
                res.status(400).json({
                    message: 'Deck ID is required',
                });
                return;
            }

            const existingDeck =
                await this.deckRepository.findById(deckId);

            if (!existingDeck) {
                res.status(404).json({
                    message: 'Deck not found',
                });
                return;
            }

            if (existingDeck.author?.id !== req.user.id) {
                res.status(403).json({
                    message:
                        'You do not have permission to update this deck',
                });
                return;
            }

            const { name, description, visibility } = req.body;

            const updatedDeck =
                await this.deckRepository.update(deckId, {
                    name,
                    description,
                    visibility:
                        visibility || existingDeck.visibility,
                });

            res.status(200).json({
                data: updatedDeck,
            });
        } catch (error) {
            console.error('Error updating deck:', error);

            res.status(500).json({
                message: 'Error updating deck',
            });
        }
    };

    updateFlashcard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const flashcardId = req.params.id;

            if (!flashcardId || Array.isArray(flashcardId)) {
                res.status(400).json({
                    message: 'Flashcard ID is required',
                });
                return;
            }

            const { term, definition } = req.body;

            if (!term || !definition) {
                res.status(400).json({
                    message: 'Term and definition are required',
                });
                return;
            }

            const existingFlashcard =
                await this.flashcardRepository.findById(
                    flashcardId
                );

            if (!existingFlashcard) {
                res.status(404).json({
                    message: 'Flashcard not found',
                });
                return;
            }

            const deck = await this.deckRepository.findById(
                existingFlashcard.deck.id
            );

            if (!deck) {
                res.status(404).json({
                    message: 'Associated deck not found',
                });
                return;
            }

            if (deck.author?.id !== req.user.id) {
                res.status(403).json({
                    message:
                        'You do not have permission to update this flashcard',
                });
                return;
            }

            const updatedFlashcard =
                await this.flashcardRepository.update(
                    flashcardId,
                    {
                        frontText: term,
                        backText: definition,
                    }
                );

            res.status(200).json({
                data: updatedFlashcard,
            });
        } catch (error) {
            console.error('Error updating flashcard:', error);

            res.status(500).json({
                message: 'Error updating flashcard',
            });
        }
    };

    getFlashcardsById = async (
        req: AuthenticatedRequest,
        res: Response
    ): Promise<void> => {
        try {
            const deckId = req.params.deckId;

            if (!deckId || Array.isArray(deckId)) {
                res.status(400).json({
                    message: 'Deck ID is required',
                });
                return;
            }

            const flashcards =
                await this.flashcardRepository.findByDeckId(
                    deckId,
                    'all'
                );

            res.status(200).json({
                data: flashcards,
            });
        } catch (error) {
            console.error(
                'Error getting flashcards by deck ID:',
                error
            );

            res.status(500).json({
                message: 'Error getting flashcards by deck ID',
            });
        }
    };
}