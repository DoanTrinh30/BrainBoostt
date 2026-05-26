"""
Load và xử lý dataset Duolingo HLR (Half-Life Regression) - PHIÊN BẢN 2.

Cải thiện so với v1:
- Định nghĩa is_correct chặt hơn: p_recall == 1.0 (nhớ hoàn toàn) vs < 1.0 (có quên)
- Balance dataset (50-50) bằng undersampling để model học được cả 2 class
- Cải thiện phân loại difficulty: dùng quantile thay vì ngưỡng cố định
- Lọc các record có history_seen >= 1 (bỏ lần học đầu tiên không có history)
"""

import pandas as pd
import numpy as np
from pathlib import Path

# ============= CẤU HÌNH =============
INPUT_FILE = '../data/duolingo_hlr.csv.gz'
OUTPUT_FILE = '../data/duolingo_processed.csv'
SAMPLE_SIZE = 1_500_000
LEARNING_LANG = 'en'
RANDOM_STATE = 42
BALANCE_RATIO = 1.0  # 1.0 = 50-50, 2.0 = 67-33 (giữ nhiều positive hơn)

np.random.seed(RANDOM_STATE)

# ============= LOAD DATA =============
print(f"📂 Đang load file: {INPUT_FILE}")
print("   (file nén ~361MB, có thể mất 1-3 phút...)")

if not Path(INPUT_FILE).exists():
    print(f"\n❌ KHÔNG TÌM THẤY FILE: {INPUT_FILE}")
    exit(1)

df = pd.read_csv(INPUT_FILE, compression='gzip')
print(f"✅ Đã load: {len(df):,} rows, {len(df.columns)} columns")

# ============= FILTER =============
print(f"\n🔍 Filter người học tiếng Anh (learning_language == '{LEARNING_LANG}')...")
df_en = df[df['learning_language'] == LEARNING_LANG].copy()
print(f"   Sau filter: {len(df_en):,} rows")

# Bỏ các record có history_seen = 0 (lần học đầu, chưa có pattern)
df_en = df_en[df_en['history_seen'] >= 1].copy()
print(f"   Sau khi bỏ history_seen=0: {len(df_en):,} rows")

# ============= ĐỊNH NGHĨA LẠI is_correct =============
# Cách cũ: p_recall >= 0.5 → 93% positive (quá lệch)
# Cách mới: p_recall == 1.0 → user nhớ HOÀN TOÀN (positive)
#          p_recall < 1.0  → có quên ít nhiều (negative)
print(f"\n📊 Phân bố p_recall gốc:")
print(f"   - p_recall == 1.0 (nhớ hoàn toàn): {(df_en['p_recall'] == 1.0).sum():,}")
print(f"   - p_recall < 1.0 (có quên): {(df_en['p_recall'] < 1.0).sum():,}")
print(f"   - p_recall == 0.0 (quên hết): {(df_en['p_recall'] == 0.0).sum():,}")

df_en['is_correct'] = (df_en['p_recall'] == 1.0).astype(int)
print(f"\n   Sau khi định nghĩa lại is_correct:")
print(f"   - is_correct=1: {(df_en['is_correct'] == 1).sum():,} ({(df_en['is_correct'] == 1).mean()*100:.1f}%)")
print(f"   - is_correct=0: {(df_en['is_correct'] == 0).sum():,} ({(df_en['is_correct'] == 0).mean()*100:.1f}%)")

# ============= BALANCE DATASET =============
print(f"\n⚖️  Balance dataset (undersampling)...")
positive = df_en[df_en['is_correct'] == 1]
negative = df_en[df_en['is_correct'] == 0]

n_neg = len(negative)
n_pos_keep = int(n_neg * BALANCE_RATIO)

# Undersample positive class
positive_balanced = positive.sample(
    n=min(n_pos_keep, len(positive)),
    random_state=RANDOM_STATE
)
df_balanced = pd.concat([positive_balanced, negative], ignore_index=True)
df_balanced = df_balanced.sample(frac=1, random_state=RANDOM_STATE).reset_index(drop=True)
print(f"   Sau balance: {len(df_balanced):,} rows")
print(f"   - is_correct=1: {(df_balanced['is_correct'] == 1).sum():,}")
print(f"   - is_correct=0: {(df_balanced['is_correct'] == 0).sum():,}")

# Sample về SAMPLE_SIZE nếu vẫn quá lớn
if len(df_balanced) > SAMPLE_SIZE:
    print(f"\n🎲 Sample tiếp về {SAMPLE_SIZE:,} rows...")
    df_balanced = df_balanced.sample(n=SAMPLE_SIZE, random_state=RANDOM_STATE).reset_index(drop=True)

df_en = df_balanced

# ============= FEATURE ENGINEERING =============
print(f"\n🔧 Feature engineering...")

# 1. review_count
df_en['review_count'] = df_en['history_seen'].astype(int)

# 2. days_since_last_review
df_en['days_since_last_review'] = (df_en['delta'] / (24 * 3600)).clip(lower=0, upper=365)

# 3. previous_accuracy
df_en['previous_accuracy'] = (df_en['history_correct'] / df_en['history_seen']).clip(0, 1)

# 4. response_time_ms (ước lượng)
df_en['response_time_ms'] = np.where(
    df_en['is_correct'] == 1,
    np.random.normal(2500, 800, len(df_en)),
    np.random.normal(5000, 1500, len(df_en))
)
df_en['response_time_ms'] = df_en['response_time_ms'].clip(lower=500).astype(int)

# 5. difficulty: dùng QUANTILE thay vì ngưỡng cố định
print("   Tính difficulty cho từng lexeme (dùng quantile)...")
lexeme_stats = df_en.groupby('lexeme_id').agg(
    avg_recall=('p_recall', 'mean'),
    n_seen=('p_recall', 'size')
)
# Chỉ tin tưởng lexeme có >= 5 lần xuất hiện
lexeme_stats = lexeme_stats[lexeme_stats['n_seen'] >= 5]

# Chia thành 3 nhóm bằng nhau theo quantile
q33 = lexeme_stats['avg_recall'].quantile(0.33)
q67 = lexeme_stats['avg_recall'].quantile(0.67)
print(f"   Ngưỡng quantile: hard < {q33:.3f} <= medium < {q67:.3f} <= easy")

def classify_difficulty(p_recall_avg):
    if pd.isna(p_recall_avg):
        return 'medium'
    if p_recall_avg < q33:
        return 'hard'
    elif p_recall_avg < q67:
        return 'medium'
    else:
        return 'easy'

df_en['difficulty'] = df_en['lexeme_id'].map(lexeme_stats['avg_recall']).apply(classify_difficulty)

# 6. hour_of_day
df_en['hour_of_day'] = pd.to_datetime(df_en['timestamp'], unit='s').dt.hour

# ============= SELECT COLUMNS =============
final_columns = [
    'user_id', 'lexeme_id',
    'review_count', 'days_since_last_review', 'previous_accuracy',
    'response_time_ms', 'difficulty', 'hour_of_day',
    'is_correct', 'p_recall',
]
df_final = df_en[final_columns].rename(columns={'lexeme_id': 'flashcard_id'})

# ============= SAVE =============
Path('../data').mkdir(exist_ok=True)
df_final.to_csv(OUTPUT_FILE, index=False)

print(f"\n✅ Hoàn tất!")
print(f"   Output: {OUTPUT_FILE}")
print(f"   Total rows: {len(df_final):,}")

print(f"\n📊 Phân bố cuối cùng:")
print(f"   - is_correct=1 (nhớ hoàn toàn): {df_final['is_correct'].mean()*100:.2f}%")
print(f"   - is_correct=0 (có quên):       {(1-df_final['is_correct'].mean())*100:.2f}%")
print(f"   - Difficulty:")
for diff, count in df_final['difficulty'].value_counts().items():
    print(f"      {diff:8s}: {count:8,} ({count/len(df_final)*100:.1f}%)")

print(f"\n📋 5 dòng đầu:")
print(df_final.head())

print(f"\n🎯 Bước tiếp theo: chạy train.py để train 3 model trên data thật này!")