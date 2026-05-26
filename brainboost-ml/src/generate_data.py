"""
Sinh synthetic data mô phỏng hành vi học flashcard.
Dựa trên công thức đường cong quên lãng Ebbinghaus:
    R = exp(-t / S)
Trong đó:
    R = retention (xác suất nhớ)
    t = thời gian từ lần học cuối
    S = strength of memory (tăng theo số lần ôn)
"""

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random

np.random.seed(42)
random.seed(42)

# ============= CẤU HÌNH =============
NUM_USERS = 100              # Số user giả
NUM_FLASHCARDS = 500         # Số flashcards
DAYS_SIMULATED = 60          # Mô phỏng trong 60 ngày
MAX_REVIEWS_PER_CARD = 15    # Tối đa mỗi card được ôn bao nhiêu lần

# ============= SINH DATA =============

def calculate_retention(days_since_last, review_count, difficulty_factor):
    """
    Tính xác suất nhớ dựa trên Ebbinghaus.
    - Càng ôn nhiều, memory strength càng cao
    - Càng lâu không ôn, càng dễ quên
    - Từ khó (difficulty cao) thì memory strength giảm
    """
    # Memory strength tăng theo log của review_count
    base_strength = 1.0 + np.log1p(review_count) * 2.0
    strength = base_strength / difficulty_factor
    
    # Công thức Ebbinghaus
    retention = np.exp(-days_since_last / strength)
    return np.clip(retention, 0.05, 0.98)


def simulate_user_learning():
    """Mô phỏng quá trình học của tất cả user."""
    logs = []
    
    for user_id in range(1, NUM_USERS + 1):
        # Mỗi user học 30-100 cards
        num_cards_learned = random.randint(30, 100)
        learned_cards = random.sample(range(1, NUM_FLASHCARDS + 1), num_cards_learned)
        
        # Đặc điểm user (ảnh hưởng tới khả năng học)
        user_skill = np.random.uniform(0.7, 1.3)  # User giỏi/dở
        
        for card_id in learned_cards:
            # Difficulty của card (1=dễ, 1.5=trung bình, 2.5=khó)
            difficulty = random.choice([1.0, 1.5, 2.5])
            difficulty_label = {1.0: 'easy', 1.5: 'medium', 2.5: 'hard'}[difficulty]
            
            # Mô phỏng nhiều lần ôn
            num_reviews = random.randint(3, MAX_REVIEWS_PER_CARD)
            last_review_day = random.uniform(0, 5)  # Lần học đầu
            previous_correct_count = 0
            
            for review_idx in range(num_reviews):
                # Khoảng cách giữa các lần ôn (tăng dần theo SRS)
                if review_idx == 0:
                    days_since_last = 0
                else:
                    # Khoảng cách tăng theo cấp số: 1, 2, 4, 7, 14...
                    base_interval = 2 ** min(review_idx - 1, 5)
                    days_since_last = base_interval + np.random.uniform(-1, 2)
                    days_since_last = max(0.5, days_since_last)
                
                last_review_day += days_since_last
                if last_review_day > DAYS_SIMULATED:
                    break
                
                # Tính xác suất nhớ
                retention = calculate_retention(
                    days_since_last, review_idx, difficulty
                ) * user_skill
                retention = np.clip(retention, 0.05, 0.98)
                
                # User có nhớ không (binary outcome)
                is_correct = 1 if np.random.random() < retention else 0
                
                # Thời gian phản hồi (ms): nhớ thì nhanh, quên thì chậm
                if is_correct:
                    response_time = np.random.normal(2500, 800)
                else:
                    response_time = np.random.normal(5000, 1500)
                response_time = max(500, response_time)
                
                # Tỉ lệ đúng các lần trước
                if review_idx == 0:
                    previous_accuracy = 0.5  # default
                else:
                    previous_accuracy = previous_correct_count / review_idx
                
                # Giờ học (sáng/chiều/tối)
                hour_of_day = random.choices(
                    [9, 14, 20, 22], weights=[2, 1, 3, 2]
                )[0]
                
                logs.append({
                    'user_id': user_id,
                    'flashcard_id': card_id,
                    'review_count': review_idx,
                    'days_since_last_review': round(days_since_last, 2),
                    'previous_accuracy': round(previous_accuracy, 3),
                    'response_time_ms': int(response_time),
                    'difficulty': difficulty_label,
                    'hour_of_day': hour_of_day,
                    'is_correct': is_correct,
                })
                
                if is_correct:
                    previous_correct_count += 1
    
    return pd.DataFrame(logs)


if __name__ == '__main__':
    print("Đang sinh synthetic data...")
    df = simulate_user_learning()
    
    print(f"\n✅ Đã sinh {len(df):,} review logs từ {df['user_id'].nunique()} users")
    print(f"   - Tỉ lệ đúng tổng thể: {df['is_correct'].mean():.2%}")
    print(f"   - Phân bố difficulty:")
    print(df['difficulty'].value_counts())
    
    # Lưu CSV
    output_path = '../data/synthetic_review_logs.csv'
    df.to_csv(output_path, index=False)
    print(f"\n💾 Đã lưu vào: {output_path}")
    print(f"\n📊 5 dòng đầu:")
    print(df.head())