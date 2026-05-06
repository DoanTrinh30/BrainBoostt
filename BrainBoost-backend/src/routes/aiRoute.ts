import { Request, Response, Router } from 'express';
import { AIController } from '../controllers/AIController';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/authMiddleware';

const aiRouter = Router();
const aiController = new AIController();

/**
 * @swagger
 * /ai/flashcards/auto-generate:
 *   post:
 *     summary: Generate flashcards based on topic and level
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - level
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The topic for which to generate flashcards
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 description: The difficulty level of the generated flashcards
 *               quantity:
 *                 type: integer
 *                 description: The number of flashcards to generate
 *                 default: 10
 *     responses:
 *       200:
 *         description: Flashcards generated successfully
 *       400:
 *         description: Bad Request - Missing required fields or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
aiRouter.post('/flashcards/auto-generate', authMiddleware, (req: Request, res: Response) => {
    aiController.generateFlashcardsBasedOnTopicAndLevel(req as AuthenticatedRequest, res);
});

/**
 * @swagger
 * /ai/flashcards/generate-distractors:
 *   post:
 *     summary: Generate distractors for multiple questions and answers
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questions
 *               - answers
 *             properties:
 *               questions:
 *                 type: array
 *                 description: Array of questions for which to generate distractors
 *                 items:
 *                   type: string
 *                 example: ["Which is the Southeast Asia country?", "What is the capital of France?"]
 *               answers:
 *                 type: array
 *                 description: Array of correct answers corresponding to the questions
 *                 items:
 *                   type: string
 *                 example: ["Vietnam", "Paris"]
 *     responses:
 *       200:
 *         description: Distractors generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: string
 *                         description: The original question
 *                       answer:
 *                         type: string
 *                         description: The correct answer
 *                       distractors:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Array of 3 incorrect options
 *       400:
 *         description: Bad Request - Missing required fields or arrays of unequal length
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */

aiRouter.post('/flashcards/generate-distractors', authMiddleware, (req: Request, res: Response) => {
    aiController.generateDistractors(req as AuthenticatedRequest, res);
});

export default aiRouter;
