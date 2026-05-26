import axios, { AxiosInstance, AxiosError } from 'axios';

/**
 * MLService: Service để gọi sang ML API (FastAPI Python).
 * 
 * Backend chạy trong Docker → ML API chạy trên Windows host.
 * → Sử dụng host.docker.internal để Docker container truy cập host.
 * 
 * Có thể override URL qua biến môi trường ML_API_URL.
 */

// Default URL cho Docker → host (Windows/Mac)
const DEFAULT_ML_API_URL = 'http://host.docker.internal:8000';

interface PredictRequest {
    review_count: number;
    days_since_last_review: number;
    previous_accuracy: number;
    response_time_ms: number;
    difficulty: 'easy' | 'medium' | 'hard';
    hour_of_day: number;
}

interface PredictResponse {
    retention_probability: number;
    will_remember: boolean;
    recommendation: string;
    next_review_days: number;
    model_used: string;
}

interface BatchPredictRequest {
    items: PredictRequest[];
}

interface BatchPredictResponse {
    model_used: string;
    predictions: Array<{
        retention_probability: number;
        will_remember: boolean;
        recommendation: string;
        next_review_days: number;
    }>;
}

interface MLApiInfo {
    service: string;
    version: string;
    current_model: {
        dataset: string;
        algorithm: string;
        dataset_size?: number;
    };
    available_datasets: string[];
}

class MLService {
    private client: AxiosInstance;
    private baseURL: string;
    private isHealthy: boolean = false;

    constructor() {
        this.baseURL = process.env.ML_API_URL || DEFAULT_ML_API_URL;
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 5000, // 5 giây timeout
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(`[MLService] Initialized with URL: ${this.baseURL}`);

        // Health check khi khởi động (không block)
        this.checkHealth();
    }

    /**
     * Kiểm tra ML API có online không.
     */
    async checkHealth(): Promise<boolean> {
        try {
            const response = await this.client.get<MLApiInfo>('/');
            this.isHealthy = response.status === 200;

            if (this.isHealthy) {
                console.log(`[MLService] ✅ ML API is healthy:`);
                console.log(`   - Service: ${response.data.service}`);
                console.log(`   - Version: ${response.data.version}`);
                console.log(`   - Model: ${response.data.current_model.dataset}/${response.data.current_model.algorithm}`);
            }

            return this.isHealthy;
        } catch (error) {
            this.isHealthy = false;
            const err = error as AxiosError;
            console.error(`[MLService] ❌ ML API unreachable: ${err.message}`);
            console.error(`   URL: ${this.baseURL}`);
            console.error(`   Hint: Đảm bảo Python ML API đang chạy (uvicorn api:app)`);
            return false;
        }
    }

    /**
     * Dự đoán xác suất user nhớ 1 flashcard ở lần ôn tới.
     * 
     * @param features - Các features về lịch sử học của user với flashcard này
     * @returns Prediction từ ML model
     */
    async predict(features: PredictRequest): Promise<PredictResponse> {
        try {
            const response = await this.client.post<PredictResponse>('/predict', features);
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.error(`[MLService] Predict error: ${err.message}`);

            // Fallback: nếu ML API down, dùng default value
            return this.fallbackPredict(features);
        }
    }

    /**
     * Dự đoán nhiều flashcards cùng lúc (efficient hơn gọi từng cái).
     */
    async predictBatch(items: PredictRequest[]): Promise<BatchPredictResponse> {
        if (items.length === 0) {
            return { model_used: 'none', predictions: [] };
        }

        try {
            const response = await this.client.post<BatchPredictResponse>('/predict/batch', {
                items,
            });
            return response.data;
        } catch (error) {
            const err = error as AxiosError;
            console.error(`[MLService] Batch predict error: ${err.message}`);

            // Fallback: predict từng cái với fallback logic
            return {
                model_used: 'fallback',
                predictions: items.map((item) => {
                    const fallback = this.fallbackPredict(item);
                    return {
                        retention_probability: fallback.retention_probability,
                        will_remember: fallback.will_remember,
                        recommendation: fallback.recommendation,
                        next_review_days: fallback.next_review_days,
                    };
                }),
            };
        }
    }

    /**
     * Lấy thông tin model đang load.
     */
    async getInfo(): Promise<MLApiInfo | null> {
        try {
            const response = await this.client.get<MLApiInfo>('/info');
            return response.data;
        } catch (error) {
            return null;
        }
    }

    /**
     * Lấy metrics của model (để hiển thị dashboard).
     */
    async getMetrics(): Promise<any> {
        try {
            const response = await this.client.get('/metrics');
            return response.data;
        } catch (error) {
            return null;
        }
    }

    /**
     * Switch model giữa duolingo và synthetic.
     */
    async switchModel(dataset: 'duolingo' | 'synthetic'): Promise<boolean> {
        try {
            await this.client.post('/switch-model', { dataset });
            console.log(`[MLService] Switched to ${dataset} model`);
            return true;
        } catch (error) {
            const err = error as AxiosError;
            console.error(`[MLService] Switch model error: ${err.message}`);
            return false;
        }
    }

    /**
     * Fallback logic khi ML API không available.
     * Dùng công thức đường cong quên lãng Ebbinghaus đơn giản:
     *     R = exp(-t / S)
     */
    private fallbackPredict(features: PredictRequest): PredictResponse {
        const { review_count, days_since_last_review, previous_accuracy } = features;

        // Memory strength tăng theo review count + previous accuracy
        const strength = (1 + Math.log1p(review_count)) * (0.5 + previous_accuracy);

        // Ebbinghaus: R = e^(-t/S)
        const probability = Math.max(
            0.05,
            Math.min(0.98, Math.exp(-days_since_last_review / strength))
        );

        let recommendation: string;
        let nextReviewDays: number;

        if (probability < 0.3) {
            recommendation = 'Cần ôn ngay! Khả năng quên rất cao.';
            nextReviewDays = 0;
        } else if (probability < 0.5) {
            recommendation = 'Nên ôn lại trong hôm nay.';
            nextReviewDays = 1;
        } else if (probability < 0.7) {
            recommendation = 'Nên ôn trong 1-2 ngày tới.';
            nextReviewDays = 2;
        } else if (probability < 0.85) {
            recommendation = 'Có thể ôn trong 3-5 ngày tới.';
            nextReviewDays = 4;
        } else {
            recommendation = 'Đã nhớ tốt, có thể giãn ra 7+ ngày.';
            nextReviewDays = 7;
        }

        return {
            retention_probability: parseFloat(probability.toFixed(4)),
            will_remember: probability >= 0.5,
            recommendation,
            next_review_days: nextReviewDays,
            model_used: 'fallback/ebbinghaus',
        };
    }
}

// Singleton instance - chỉ tạo 1 lần dùng cho cả app
export const mlService = new MLService();
export type { PredictRequest, PredictResponse, BatchPredictResponse, MLApiInfo };