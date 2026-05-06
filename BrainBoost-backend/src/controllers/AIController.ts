import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { Response } from 'express';
import dotenv from 'dotenv';
import { AIRepository } from '../repositories/AIRepository';
import * as CryptoJS from 'crypto-js';
import redisClient from '../redis/config';

dotenv.config();

export class AIController {
    private aiRepository: AIRepository;
    constructor() {
        this.aiRepository = new AIRepository();
    }
    generateFlashcardsBasedOnTopicAndLevel = async (
        req: AuthenticatedRequest,
        res: Response
    ): Promise<void> => {
        try {
            const { id } = req.user;
            if (!id) {
                res.status(400).send('User not found');
                return;
            }
            const { topic, level, quantity } = req.body;
            if (!topic || !level) {
                res.status(400).send('Topic and level are required');
                return;
            }
            const rawResponse = await this.aiRepository.handleRequest(quantity, topic, level);
            res.status(200).json({
                response: rawResponse,
            });
        } catch (error) {
            console.log('Error getting flashcards from ai server: ' + error);
            res.status(500).send('Internal Server Error');
        }
    };

    generateDistractors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.user;
            if (!id) {
                res.status(400).send('User not found');
                return;
            }
            const { questions, answers }: { questions: string[]; answers: string[] } = req.body;
            if (!questions || !answers || questions.length === 0 || answers.length === 0) {
                res.status(400).send('Questions and answers are required');
                return;
            }

            if (questions.length !== answers.length) {
                res.status(400).send('Questions and answers arrays must have the same length');
                return;
            }

            const questionAnswerPairs = questions.map((question, index) => ({
                question,
                answer: answers[index],
            }));

            const cacheKey = this.generateCacheKey(questionAnswerPairs);

            const cachedResponse = await redisClient.get(cacheKey);
            if (cachedResponse) {
                console.log('Cache hit for key:', cacheKey);
                res.status(200).json({
                    response: JSON.parse(cachedResponse),
                });
                return;
            }

            let rawResponse =
                await this.aiRepository.handleBatchGenerateDistractors(questionAnswerPairs);

            await redisClient.set(cacheKey, JSON.stringify(rawResponse), 'EX', 3600 * 24 * 7);

            res.status(200).json({
                response: rawResponse,
            });
        } catch (error) {
            console.log('Error getting distractors from ai server: ' + error);
            res.status(500).send('Internal Server Error');
        }
    };

    private generateCacheKey = (data: any): string => {
        const inputData = JSON.stringify(data);
        const hash = CryptoJS.MD5(inputData).toString();
        return `distractors:${hash}`;
    };
}
