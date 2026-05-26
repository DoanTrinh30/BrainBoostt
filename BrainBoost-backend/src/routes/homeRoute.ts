import { FlashcardController } from './../controllers/FlashcardController';
import { Router, Request, Response } from 'express';
import { HomeController } from '../controllers/HomeController';
import { DeckController } from '../controllers/DeckController';
import { ProfileController } from '../controllers/ProfileController';
import { FolderController } from '../controllers/FolderController';
import { ReviewLogController } from '../controllers/ReviewLogController';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = Router();
const homeController = new HomeController();
const deckController = new DeckController();
const profileController = new ProfileController();
const folderController = new FolderController()
const flashcardController = new FlashcardController()
const reviewLogController = new ReviewLogController();

/**
 * @swagger
 * /api/home:
 *   get:
 *     summary: Get decks, folders and classes for an authenticated user
 *     tags: [Home]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of public decks, folders, and classes retrieved successfully.
 *       400:
 *         description: Bad Request - Invalid query parameters
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
router.get('/home', authMiddleware, (req: Request, res: Response) =>
    homeController.getResourcesForUser(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/decks:
 *   get:
 *     summary: Get all decks for the authenticated user
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of decks belonging to the user retrieved successfully.
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
router.get('/decks', authMiddleware, (req: Request, res: Response) =>
    deckController.getDecks(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/decks/{id}:
 *   get:
 *     summary: Get a deck and its flashcards by ID
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the deck to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A deck object with flashcards retrieved successfully.
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: Not Found - Deck not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/decks/:id', authMiddleware, (req: Request, res: Response) =>
    deckController.getDeckById(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/decks:
 *   post:
 *     summary: Create a new deck
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               visibility:
 *                 type: string
 *                 enum: [private, public]
 *     responses:
 *       200:
 *         description: Deck created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.post('/decks', authMiddleware, (req: Request, res: Response) =>
    deckController.addDeck(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/decks/{id}/flashcards:
 *   post:
 *     summary: Add flashcards to a deck
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the deck to add flashcards to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flashcards
 *             properties:
 *               flashcards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - term
 *                     - definition
 *                   properties:
 *                     term:
 *                       type: string
 *                       description: The front text of the flashcard
 *                     definition:
 *                       type: string
 *                       description: The back text of the flashcard
 *     responses:
 *       200:
 *         description: Flashcards added successfully
 *       400:
 *         description: Bad Request - Missing required fields or invalid data
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: Not Found - Deck not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/decks/:id/flashcards', authMiddleware, (req: Request, res: Response) =>
    deckController.addFlashcards(req as AuthenticatedRequest, res)
);

/**
 * /api/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/profile', authMiddleware, (req: Request, res: Response) =>
    profileController.getProfile(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/decks/{id}:
 *   put:
 *     summary: Update an existing deck
 *     tags: [Decks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the deck to update
 *         schema:
 *           type: string
 * /api/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the deck
 *               description:
 *                 type: string
 *                 description: Updated description of the deck
 *               visibility:
 *                 type: string
 *                 enum: [private, public]
 *                 description: Updated visibility of the deck
 *     responses:
 *       200:
 *         description: Deck updated successfully
 *       400:
 *         description: Bad Request - Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User does not have permission to update this deck
 *       404:
 *         description: Not Found - Deck not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/decks/:id', authMiddleware, (req: Request, res: Response) =>
    deckController.updateDeck(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/flashcards/{id}:
 *   put:
 *     summary: Update an existing flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the flashcard to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - term
 *               - definition
 *             properties:
 *               term:
 *                 type: string
 *                 description: The front text of the flashcard
 *               definition:
 *                 type: string
 *                 description: The back text of the flashcard
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *       400:
 *         description: Bad Request - Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - User does not have permission to update this flashcard
 *       404:
 *         description: Not Found - Flashcard not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/flashcards/:id', authMiddleware, (req: Request, res: Response) =>
    deckController.updateFlashcard(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/flashcards/{deckId}:
 *   get:
 *     summary: Get flashcards by deck ID
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: deckId
 *         in: path
 *         required: true
 *         description: The ID of the deck to get flashcards from
 *     responses:
 *       200:
 *         description: Flashcards retrieved successfully
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: Not Found - Deck not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/flashcards/:deckId', authMiddleware, (req: Request, res: Response) =>
    deckController.getFlashcardsById(req as AuthenticatedRequest, res)
);

/**
 *             properties:
 *               username:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/profile', authMiddleware, (req: Request, res: Response) =>
    profileController.updateProfile(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/change-password:
 *   put:
 *     summary: Change the authenticated user's password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad Request - Invalid current password or missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/change-password', authMiddleware, (req: Request, res: Response) =>
    profileController.changePassword(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search for public decks, classes, folders, and users
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         description: The search query
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of results to return (default 10)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     decks:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Bad Request - Invalid query parameters
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal Server Error
 */
router.get('/search', authMiddleware, (req: Request, res: Response) =>
    homeController.search(req as AuthenticatedRequest, res)
);


router.get('/total_folders', authMiddleware, (req: Request, res: Response) =>
    folderController.getQuantity(req as AuthenticatedRequest, res)
);

router.get('/total_flashcards', authMiddleware, (req: Request, res: Response) =>
    flashcardController.getQuantity(req as AuthenticatedRequest, res)
);

// ===== Review Logs (ML-powered Spaced Repetition) =====

/**
 * @swagger
 * /api/review-logs:
 *   post:
 *     summary: Create a review log when user answers a flashcard
 *     tags: [ReviewLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flashcardId
 *               - isCorrect
 *               - responseTimeMs
 *             properties:
 *               flashcardId:
 *                 type: string
 *                 format: uuid
 *               isCorrect:
 *                 type: boolean
 *               responseTimeMs:
 *                 type: integer
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *     responses:
 *       201:
 *         description: Review log created with ML prediction
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Flashcard not found
 */
router.post('/review-logs', authMiddleware, (req: Request, res: Response) =>
    reviewLogController.create(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/review-logs/stats:
 *   get:
 *     summary: Get user's learning statistics
 *     tags: [ReviewLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User stats retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/review-logs/stats', authMiddleware, (req: Request, res: Response) =>
    reviewLogController.getStats(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/review-logs/recommend:
 *   get:
 *     summary: Get ML-recommended flashcards to review (Spaced Repetition)
 *     tags: [ReviewLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of recommendations to return (default 10)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recommendations sorted by retention probability (lowest first)
 *       401:
 *         description: Unauthorized
 */
router.get('/review-logs/recommend', authMiddleware, (req: Request, res: Response) =>
    reviewLogController.getRecommendations(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/review-logs/history:
 *   get:
 *     summary: Get user's review history
 *     tags: [ReviewLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of history items to return (default 20)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/review-logs/history', authMiddleware, (req: Request, res: Response) =>
    reviewLogController.getHistory(req as AuthenticatedRequest, res)
);
/**
 * @swagger
 * /api/review-logs/weekly-activity:
 *   get:
 *     summary: Get user's activity for last 7 days (for BarChart)
 *     tags: [ReviewLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly activity retrieved
 */
router.get('/review-logs/weekly-activity', authMiddleware, (req: Request, res: Response) =>
    reviewLogController.getWeeklyActivity(req as AuthenticatedRequest, res)
);

/**
 * @swagger
 * /api/review-logs/insights:
 *   get:
 *     summary: Get ML-powered AI insights for user
 *     tags: [ReviewLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI insights retrieved
 */
router.get('/review-logs/insights', authMiddleware, (req: Request, res: Response) =>
    reviewLogController.getInsights(req as AuthenticatedRequest, res)
);
export default router;
