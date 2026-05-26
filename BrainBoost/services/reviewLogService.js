import serverApi from '../helpers/axios';

/**
 * Service gọi các API ReviewLog (ML-powered).
 * 
 * 6 endpoints:
 * - POST /api/review-logs                  → log mỗi lần user trả lời flashcard
 * - GET  /api/review-logs/stats            → thống kê tổng quan cho dashboard
 * - GET  /api/review-logs/recommend        → ML gợi ý flashcards cần ôn (SRS)
 * - GET  /api/review-logs/history          → lịch sử ôn của user
 * - GET  /api/review-logs/weekly-activity  → activity 7 ngày qua (cho BarChart)
 * - GET  /api/review-logs/insights         → AI insights (streak, retention, best time)
 */

/**
 * Lưu lại 1 lần user trả lời flashcard.
 */
export const createReviewLog = async ({
    flashcardId,
    isCorrect,
    responseTimeMs,
    difficulty = 'medium',
}) => {
    try {
        const response = await serverApi.post('/api/review-logs', {
            flashcardId,
            isCorrect,
            responseTimeMs,
            difficulty,
        });
        return response.data.data;
    } catch (error) {
        console.error('Error creating review log:', error);
        throw error;
    }
};

/**
 * Lấy thống kê tổng quan của user.
 * Returns: { totalReviews, correctReviews, accuracy, avgResponseTime }
 */
export const getReviewStats = async () => {
    try {
        const response = await serverApi.get('/api/review-logs/stats');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching review stats:', error);
        throw error;
    }
};

/**
 * Lấy danh sách flashcards ML gợi ý nên ôn.
 */
export const getRecommendations = async (limit = 10) => {
    try {
        const response = await serverApi.get('/api/review-logs/recommend', {
            params: { limit },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        throw error;
    }
};

/**
 * Lấy lịch sử ôn của user.
 */
export const getReviewHistory = async (limit = 20) => {
    try {
        const response = await serverApi.get('/api/review-logs/history', {
            params: { limit },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching review history:', error);
        throw error;
    }
};

/**
 * Lấy activity 7 ngày qua (cho BarChart).
 * Returns: [{ date, dayLabel, count, correctCount }, ...] (7 items)
 */
export const getWeeklyActivity = async () => {
    try {
        const response = await serverApi.get(
            '/api/review-logs/weekly-activity'
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching weekly activity:', error);
        // Trả về array rỗng để UI không crash
        return [];
    }
};

/**
 * Lấy AI Insights cho user.
 * Returns: { bestTimeOfDay, currentStreak, avgRetention, totalActiveDays }
 */
export const getAIInsights = async () => {
    try {
        const response = await serverApi.get('/api/review-logs/insights');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching AI insights:', error);
        // Trả về object mặc định để UI không crash
        return {
            bestTimeOfDay: null,
            currentStreak: 0,
            avgRetention: 0,
            totalActiveDays: 0,
        };
    }
};