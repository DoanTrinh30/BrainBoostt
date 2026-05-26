import { ReviewLog } from '../entities';
import { BaseRepository } from './BaseRepository';

export class ReviewLogRepository extends BaseRepository<ReviewLog> {
    constructor() {
        super(ReviewLog);
    }

    async createLog(data: Partial<ReviewLog>): Promise<ReviewLog> {
        const log = this.repository.create(data);
        return this.repository.save(log);
    }

    async findByUserAndFlashcard(
        userId: number,
        flashcardId: string,
        limit: number = 100
    ): Promise<ReviewLog[]> {
        return this.repository.find({
            where: {
                user: { id: userId },
                flashcard: { id: flashcardId },
            },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findByUserId(userId: number, limit: number | 'all' = 100): Promise<ReviewLog[]> {
        const query: any = {
            where: { user: { id: userId } },
            relations: ['flashcard'],
            order: { createdAt: 'DESC' },
        };
        if (limit !== 'all') {
            query.take = limit;
        }
        return this.repository.find(query);
    }

    async countByUserId(userId: number): Promise<number> {
        return this.repository
            .createQueryBuilder('log')
            .where('log.user_id = :userId', { userId })
            .getCount();
    }

    async getUserStats(userId: number): Promise<{
        totalReviews: number;
        correctReviews: number;
        accuracy: number;
        avgResponseTime: number;
    }> {
        const result = await this.repository
            .createQueryBuilder('log')
            .select('COUNT(*)', 'total')
            .addSelect('SUM(CASE WHEN log.is_correct = true THEN 1 ELSE 0 END)', 'correct')
            .addSelect('AVG(log.response_time_ms)', 'avgTime')
            .where('log.user_id = :userId', { userId })
            .getRawOne();

        const total = parseInt(result.total || '0', 10);
        const correct = parseInt(result.correct || '0', 10);
        const avgTime = parseFloat(result.avgTime || '0');

        return {
            totalReviews: total,
            correctReviews: correct,
            accuracy: total > 0 ? correct / total : 0,
            avgResponseTime: Math.round(avgTime),
        };
    }

    async getRecentFlashcards(
        userId: number,
        limit: number = 50
    ): Promise<Array<{
        flashcardId: string;
        reviewCount: number;
        lastReviewedAt: Date;
        correctCount: number;
    }>> {
        const result = await this.repository
            .createQueryBuilder('log')
            .select('log.flashcard_id', 'flashcardId')
            .addSelect('COUNT(*)', 'reviewCount')
            .addSelect('MAX(log.created_at)', 'lastReviewedAt')
            .addSelect('SUM(CASE WHEN log.is_correct = true THEN 1 ELSE 0 END)', 'correctCount')
            .where('log.user_id = :userId', { userId })
            .groupBy('log.flashcard_id')
            .orderBy('"lastReviewedAt"', 'DESC')
            .limit(limit)
            .getRawMany();

        return result.map((r: any) => ({
            flashcardId: r.flashcardId,
            reviewCount: parseInt(r.reviewCount, 10),
            lastReviewedAt: new Date(r.lastReviewedAt),
            correctCount: parseInt(r.correctCount, 10),
        }));
    }

    /**
     * ===== NEW: Activity 7 ngày qua (cho BarChart). =====
     */
    async getWeeklyActivity(userId: number): Promise<Array<{
        date: string;
        dayLabel: string;
        count: number;
        correctCount: number;
    }>> {
        const result = await this.repository
            .createQueryBuilder('log')
            .select("TO_CHAR(log.created_at, 'YYYY-MM-DD')", 'date')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(CASE WHEN log.is_correct = true THEN 1 ELSE 0 END)', 'correctCount')
            .where('log.user_id = :userId', { userId })
            .andWhere("log.created_at >= NOW() - INTERVAL '7 days'")
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();

        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days: Array<{
            date: string;
            dayLabel: string;
            count: number;
            correctCount: number;
        }> = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayLabel = dayLabels[d.getDay()];

            const found = result.find((r: any) => r.date === dateStr);
            last7Days.push({
                date: dateStr,
                dayLabel,
                count: found ? parseInt(found.count, 10) : 0,
                correctCount: found ? parseInt(found.correctCount, 10) : 0,
            });
        }

        return last7Days;
    }

    /**
     * ===== NEW: AI Insights cho user. =====
     */
    async getAIInsights(userId: number): Promise<{
        bestTimeOfDay: { hour: number; label: string; accuracy: number } | null;
        currentStreak: number;
        avgRetention: number;
        totalActiveDays: number;
    }> {
        const hourStats = await this.repository
            .createQueryBuilder('log')
            .select('log.hour_of_day', 'hour')
            .addSelect('COUNT(*)', 'total')
            .addSelect('SUM(CASE WHEN log.is_correct = true THEN 1 ELSE 0 END)', 'correct')
            .where('log.user_id = :userId', { userId })
            .groupBy('log.hour_of_day')
            .having('COUNT(*) >= 2')
            .getRawMany();

        let bestTimeOfDay: { hour: number; label: string; accuracy: number } | null = null;
        if (hourStats.length > 0) {
            const withAccuracy = hourStats.map((s: any) => ({
                hour: parseInt(s.hour, 10),
                accuracy: parseFloat(s.correct) / parseFloat(s.total),
            }));
            const best = withAccuracy.reduce((a, b) => (b.accuracy > a.accuracy ? b : a));

            let label = '';
            if (best.hour < 6) label = 'rạng sáng';
            else if (best.hour < 12) label = 'buổi sáng';
            else if (best.hour < 18) label = 'buổi chiều';
            else label = 'buổi tối';

            bestTimeOfDay = {
                hour: best.hour,
                label,
                accuracy: best.accuracy,
            };
        }

        const retentionResult = await this.repository
            .createQueryBuilder('log')
            .select('AVG(log.predicted_probability)', 'avgRetention')
            .where('log.user_id = :userId', { userId })
            .getRawOne();
        const avgRetention = parseFloat(retentionResult?.avgRetention || '0');

        const activeDates = await this.repository
            .createQueryBuilder('log')
            .select("DISTINCT TO_CHAR(log.created_at, 'YYYY-MM-DD')", 'date')
            .where('log.user_id = :userId', { userId })
            .orderBy('date', 'DESC')
            .getRawMany();

        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < activeDates.length; i++) {
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            const expectedStr = expectedDate.toISOString().split('T')[0];
            if (activeDates[i].date === expectedStr) {
                currentStreak++;
            } else {
                break;
            }
        }

        return {
            bestTimeOfDay,
            currentStreak,
            avgRetention,
            totalActiveDays: activeDates.length,
        };
    }
}