import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { ReviewLogRepository } from '../repositories/ReviewLogRepository';
import { FlashcardRepository } from '../repositories/FlashcardRepository';
import { mlService, PredictRequest } from '../services/MLService';

export class ReviewLogController {
    private reviewLogRepository: ReviewLogRepository;
    private flashcardRepository: FlashcardRepository;

    constructor() {
        this.reviewLogRepository = new ReviewLogRepository();
        this.flashcardRepository = new FlashcardRepository();
    }

    create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const { flashcardId, isCorrect, responseTimeMs, difficulty } = req.body;

            if (!flashcardId || typeof isCorrect !== 'boolean' || !responseTimeMs) {
                res.status(400).json({
                    message: 'Missing required fields: flashcardId, isCorrect, responseTimeMs',
                });
                return;
            }

            const flashcard = await this.flashcardRepository.findById(flashcardId);
            if (!flashcard) {
                res.status(404).json({ message: 'Flashcard not found' });
                return;
            }

            const previousLogs = await this.reviewLogRepository.findByUserAndFlashcard(
                userId,
                flashcardId,
                100
            );

            const reviewCount = previousLogs.length;

            let daysSinceLastReview = 0;
            if (previousLogs.length > 0) {
                const lastReview = previousLogs[0];
                const diffMs = Date.now() - new Date(lastReview.createdAt).getTime();
                daysSinceLastReview = diffMs / (1000 * 60 * 60 * 24);
            }

            const previousAccuracy = previousLogs.length > 0
                ? previousLogs.filter(l => l.isCorrect).length / previousLogs.length
                : 0.5;

            const hourOfDay = new Date().getHours();
            const finalDifficulty: 'easy' | 'medium' | 'hard' = difficulty || 'medium';

            const mlFeatures: PredictRequest = {
                review_count: reviewCount,
                days_since_last_review: parseFloat(daysSinceLastReview.toFixed(2)),
                previous_accuracy: parseFloat(previousAccuracy.toFixed(3)),
                response_time_ms: responseTimeMs,
                difficulty: finalDifficulty,
                hour_of_day: hourOfDay,
            };

            const prediction = await mlService.predict(mlFeatures);

            const log = await this.reviewLogRepository.createLog({
                user: { id: userId } as any,
                flashcard: { id: flashcardId } as any,
                reviewCount,
                daysSinceLastReview: parseFloat(daysSinceLastReview.toFixed(2)),
                previousAccuracy: parseFloat(previousAccuracy.toFixed(3)),
                responseTimeMs,
                difficulty: finalDifficulty,
                hourOfDay,
                isCorrect,
                predictedProbability: prediction.retention_probability,
            });

            res.status(201).json({
                message: 'Review log created successfully',
                data: {
                    id: log.id,
                    isCorrect: log.isCorrect,
                    prediction: {
                        retentionProbability: prediction.retention_probability,
                        willRemember: prediction.will_remember,
                        recommendation: prediction.recommendation,
                        nextReviewDays: prediction.next_review_days,
                        modelUsed: prediction.model_used,
                    },
                    features: mlFeatures,
                },
            });
        } catch (error) {
            console.error('Error create review log: ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    getStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const stats = await this.reviewLogRepository.getUserStats(userId);
            res.status(200).json({ data: stats });
        } catch (error) {
            console.error('Error getStats: ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    getRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit as string) || 10;

            const recentFlashcards = await this.reviewLogRepository.getRecentFlashcards(
                userId,
                50
            );

            if (recentFlashcards.length === 0) {
                res.status(200).json({
                    data: {
                        recommendations: [],
                        message: 'Bạn chưa học flashcard nào. Hãy bắt đầu học thôi!',
                    },
                });
                return;
            }

            const now = Date.now();
            const features: PredictRequest[] = recentFlashcards.map((card) => {
                const daysSinceLast = (now - card.lastReviewedAt.getTime()) / (1000 * 60 * 60 * 24);
                const accuracy = card.reviewCount > 0
                    ? card.correctCount / card.reviewCount
                    : 0.5;

                return {
                    review_count: card.reviewCount,
                    days_since_last_review: parseFloat(daysSinceLast.toFixed(2)),
                    previous_accuracy: parseFloat(accuracy.toFixed(3)),
                    response_time_ms: 3000,
                    difficulty: 'medium' as const,
                    hour_of_day: new Date().getHours(),
                };
            });

            const batchResult = await mlService.predictBatch(features);

            const combined = recentFlashcards.map((card, idx) => ({
                flashcardId: card.flashcardId,
                reviewCount: card.reviewCount,
                lastReviewedAt: card.lastReviewedAt,
                retentionProbability: batchResult.predictions[idx].retention_probability,
                willRemember: batchResult.predictions[idx].will_remember,
                recommendation: batchResult.predictions[idx].recommendation,
                nextReviewDays: batchResult.predictions[idx].next_review_days,
            }));

            combined.sort((a, b) => a.retentionProbability - b.retentionProbability);

            const topN = combined.slice(0, limit);
            const enriched = await Promise.all(
                topN.map(async (item) => {
                    const flashcard = await this.flashcardRepository.findById(item.flashcardId);
                    return {
                        ...item,
                        flashcard: flashcard ? {
                            id: flashcard.id,
                            frontText: flashcard.frontText,
                            backText: flashcard.backText,
                            imageUrl: flashcard.imageUrl,
                        } : null,
                    };
                })
            );

            res.status(200).json({
                data: {
                    recommendations: enriched,
                    modelUsed: batchResult.model_used,
                    totalAnalyzed: recentFlashcards.length,
                },
            });
        } catch (error) {
            console.error('Error getRecommendations: ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    getHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const limit = parseInt(req.query.limit as string) || 20;

            const logs = await this.reviewLogRepository.findByUserId(userId, limit);

            res.status(200).json({
                data: logs.map((log) => ({
                    id: log.id,
                    flashcardId: log.flashcard?.id,
                    flashcardFront: log.flashcard?.frontText,
                    isCorrect: log.isCorrect,
                    responseTimeMs: log.responseTimeMs,
                    difficulty: log.difficulty,
                    predictedProbability: log.predictedProbability,
                    createdAt: log.createdAt,
                })),
            });
        } catch (error) {
            console.error('Error getHistory: ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    /**
     * ===== NEW: GET /api/review-logs/weekly-activity =====
     */
    getWeeklyActivity = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const activity = await this.reviewLogRepository.getWeeklyActivity(userId);
            const totalReviews = activity.reduce((sum, day) => sum + day.count, 0);

            res.status(200).json({
                data: {
                    activity,
                    totalReviews,
                },
            });
        } catch (error) {
            console.error('Error getWeeklyActivity: ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };

    /**
     * ===== NEW: GET /api/review-logs/insights =====
     */
    getInsights = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user.id;
            const insights = await this.reviewLogRepository.getAIInsights(userId);

            let modelInfo = null;
            try {
                modelInfo = await mlService.getInfo();
            } catch (err) {
                // ignore
            }

            res.status(200).json({
                data: {
                    ...insights,
                    modelInfo: modelInfo ? {
                        dataset: modelInfo.current_model?.dataset,
                        algorithm: modelInfo.current_model?.algorithm,
                        datasetSize: modelInfo.current_model?.dataset_size,
                    } : null,
                },
            });
        } catch (error) {
            console.error('Error getInsights: ', error);
            res.status(500).json({ message: 'Oops! Sorry, we have some problems' });
        }
    };
}