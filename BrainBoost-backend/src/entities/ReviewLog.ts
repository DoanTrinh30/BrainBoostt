import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User, Flashcard } from './index';

/**
 * ReviewLog: ghi lại mỗi lần user trả lời 1 flashcard.
 * 
 * Mục đích:
 * - Thu thập data để ML model học pattern ghi nhớ
 * - Tính toán features cho Spaced Repetition
 * - Phân tích tiến độ học tập của user
 * 
 * Mapping với features ML:
 * - reviewCount → "review_count" (ML feature)
 * - daysSinceLastReview → "days_since_last_review"
 * - previousAccuracy → "previous_accuracy"
 * - responseTimeMs → "response_time_ms"
 * - difficulty → "difficulty"
 * - hourOfDay → "hour_of_day"
 * - isCorrect → label (cái cần dự đoán)
 */
@Entity('review_logs')
export class ReviewLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // ===== RELATIONS =====
    // @ts-ignore
    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    // @ts-ignore
    @ManyToOne(() => Flashcard, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'flashcard_id' })
    flashcard!: Flashcard;

    // ===== ML FEATURES =====
    @Column({ name: 'review_count', type: 'int', default: 0 })
    reviewCount!: number;

    @Column({ name: 'days_since_last_review', type: 'float', default: 0 })
    daysSinceLastReview!: number;

    @Column({ name: 'previous_accuracy', type: 'float', default: 0.5 })
    previousAccuracy!: number;

    @Column({ name: 'response_time_ms', type: 'int' })
    responseTimeMs!: number;

    @Column({
        name: 'difficulty',
        type: 'enum',
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    })
    difficulty!: 'easy' | 'medium' | 'hard';

    @Column({ name: 'hour_of_day', type: 'int' })
    hourOfDay!: number;

    // ===== LABEL (kết quả) =====
    @Column({ name: 'is_correct', type: 'boolean' })
    isCorrect!: boolean;

    // ===== ML PREDICTION (lưu lại để analytics) =====
    @Column({ name: 'predicted_probability', type: 'float', nullable: true })
    predictedProbability?: number;

    // ===== METADATA =====
    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}