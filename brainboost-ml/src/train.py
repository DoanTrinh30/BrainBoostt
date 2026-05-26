"""
Train 3 models: Logistic Regression, Random Forest, Gradient Boosting.
Hỗ trợ train trên 2 dataset: synthetic và duolingo.

Cách dùng:
    python train.py duolingo    # Train trên data thật Duolingo
    python train.py synthetic   # Train trên data synthetic
    python train.py both        # Train trên cả 2, in bảng so sánh
"""

import sys
import pandas as pd
import numpy as np
import joblib
import json
import time
from pathlib import Path

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

# ============= CONFIG =============
DATASETS = {
    'synthetic': {
        'file': '../data/synthetic_review_logs.csv',
        'label': 'Synthetic (Ebbinghaus)',
        'model_suffix': '_synthetic',
    },
    'duolingo': {
        'file': '../data/duolingo_processed.csv',
        'label': 'Duolingo HLR (real)',
        'model_suffix': '_duolingo',
    },
}


def prepare_features(df):
    """Feature engineering: one-hot encode + chọn columns."""
    # One-hot encode difficulty
    df = pd.get_dummies(df, columns=['difficulty'], prefix='diff')
    
    # One-hot encode time period
    def time_period(hour):
        if 6 <= hour < 12: return 'morning'
        elif 12 <= hour < 18: return 'afternoon'
        elif 18 <= hour < 22: return 'evening'
        else: return 'night'
    
    df['time_period'] = df['hour_of_day'].apply(time_period)
    df = pd.get_dummies(df, columns=['time_period'], prefix='time')
    
    # Đảm bảo đủ cột (nếu thiếu thì tạo cột 0)
    for col in ['diff_easy', 'diff_medium', 'diff_hard',
                'time_morning', 'time_afternoon', 'time_evening', 'time_night']:
        if col not in df.columns:
            df[col] = 0
    
    feature_cols = [
        'review_count',
        'days_since_last_review',
        'previous_accuracy',
        'response_time_ms',
        'diff_easy', 'diff_medium', 'diff_hard',
        'time_morning', 'time_afternoon', 'time_evening', 'time_night',
    ]
    
    X = df[feature_cols].astype(float)
    y = df['is_correct']
    return X, y, feature_cols


def train_and_evaluate(dataset_key):
    """Train 3 models trên 1 dataset, return kết quả."""
    config = DATASETS[dataset_key]
    print(f"\n{'='*70}")
    print(f"🚀 TRAINING ON: {config['label']}")
    print(f"   File: {config['file']}")
    print(f"{'='*70}")
    
    # Load
    if not Path(config['file']).exists():
        print(f"❌ Không tìm thấy {config['file']}")
        print(f"   Hãy chạy {'load_duolingo.py' if dataset_key == 'duolingo' else 'generate_data.py'} trước!")
        return None
    
    df = pd.read_csv(config['file'])
    print(f"📂 Loaded: {len(df):,} rows")
    
    # Prepare
    X, y, feature_cols = prepare_features(df)
    print(f"   Features ({len(feature_cols)}): {feature_cols}")
    print(f"   Class balance: {y.value_counts().to_dict()}")
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train 3 models
    models = {
        'LogisticRegression': LogisticRegression(max_iter=1000, random_state=42, n_jobs=-1),
        'RandomForest': RandomForestClassifier(
            n_estimators=100, max_depth=15, random_state=42, n_jobs=-1
        ),
        'GradientBoosting': GradientBoostingClassifier(
            n_estimators=100, max_depth=5, learning_rate=0.1, random_state=42
        ),
    }
    
    results = {}
    
    for name, model in models.items():
        print(f"\n🤖 Training {name}...")
        start = time.time()
        
        if name == 'LogisticRegression':
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict(X_test_scaled)
            y_proba = model.predict_proba(X_test_scaled)[:, 1]
        else:
            model.fit(X_train, y_train)
            y_pred = model.predict(X_test)
            y_proba = model.predict_proba(X_test)[:, 1]
        
        elapsed = time.time() - start
        
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred),
            'roc_auc': roc_auc_score(y_test, y_proba),
            'training_time_sec': round(elapsed, 2),
        }
        
        cm = confusion_matrix(y_test, y_pred)
        
        results[name] = {
            'model': model,
            'metrics': metrics,
            'confusion_matrix': cm.tolist(),
        }
        
        print(f"   ⏱️  Training time: {elapsed:.1f}s")
        print(f"   📊 Accuracy:  {metrics['accuracy']:.4f}")
        print(f"   📊 Precision: {metrics['precision']:.4f}")
        print(f"   📊 Recall:    {metrics['recall']:.4f}")
        print(f"   📊 F1-score:  {metrics['f1']:.4f}")
        print(f"   📊 ROC-AUC:   {metrics['roc_auc']:.4f}")
        print(f"   📊 Confusion Matrix:")
        print(f"                Predicted")
        print(f"                  0      1")
        print(f"      Actual 0 [{cm[0,0]:>6} {cm[0,1]:>6}]")
        print(f"             1 [{cm[1,0]:>6} {cm[1,1]:>6}]")
    
    # Bảng so sánh
    print(f"\n{'='*70}")
    print(f"📊 BẢNG SO SÁNH 3 MODELS - {config['label']}")
    print(f"{'='*70}")
    comparison = pd.DataFrame({
        name: r['metrics'] for name, r in results.items()
    }).T
    print(comparison.round(4))
    
    # Best model
    best_name = comparison['f1'].idxmax()
    best_model = results[best_name]['model']
    print(f"\n🏆 Best model: {best_name} (F1 = {comparison.loc[best_name, 'f1']:.4f})")
    
    # Save
    Path('../models').mkdir(exist_ok=True)
    model_path = f"../models/best_model{config['model_suffix']}.pkl"
    scaler_path = f"../models/scaler{config['model_suffix']}.pkl"
    metadata_path = f"../models/metadata{config['model_suffix']}.json"
    
    joblib.dump(best_model, model_path)
    joblib.dump(scaler, scaler_path)
    
    metadata = {
        'dataset': config['label'],
        'dataset_size': len(df),
        'best_model_name': best_name,
        'feature_columns': feature_cols,
        'use_scaler': best_name == 'LogisticRegression',
        'metrics': {k: v['metrics'] for k, v in results.items()},
        'confusion_matrices': {k: v['confusion_matrix'] for k, v in results.items()},
    }
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2, default=str)
    
    print(f"\n💾 Đã lưu:")
    print(f"   - {model_path}")
    print(f"   - {scaler_path}")
    print(f"   - {metadata_path}")
    
    return {'config': config, 'results': results, 'best_name': best_name}


def compare_datasets(all_results):
    """In bảng so sánh giữa 2 dataset."""
    print(f"\n\n{'='*70}")
    print(f"🔍 SO SÁNH HIỆU NĂNG GIỮA 2 DATASETS")
    print(f"{'='*70}")
    
    rows = []
    for ds_key, ds_data in all_results.items():
        if ds_data is None:
            continue
        for model_name, result in ds_data['results'].items():
            row = {
                'Dataset': ds_data['config']['label'],
                'Model': model_name,
                **result['metrics'],
            }
            rows.append(row)
    
    df = pd.DataFrame(rows)
    print(df.to_string(index=False))
    
    # Save comparison
    df.to_csv('../models/comparison_results.csv', index=False)
    print(f"\n💾 Đã lưu bảng so sánh: ../models/comparison_results.csv")


# ============= MAIN =============
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Cách dùng:")
        print("   python train.py duolingo    # Train trên Duolingo")
        print("   python train.py synthetic   # Train trên synthetic")
        print("   python train.py both        # Train cả 2 + so sánh")
        sys.exit(1)
    
    mode = sys.argv[1].lower()
    
    if mode in ('duolingo', 'synthetic'):
        train_and_evaluate(mode)
    elif mode == 'both':
        all_results = {}
        for ds_key in ['synthetic', 'duolingo']:
            all_results[ds_key] = train_and_evaluate(ds_key)
        compare_datasets(all_results)
    else:
        print(f"❌ Mode không hợp lệ: {mode}")
        sys.exit(1)
    
    print(f"\n✅ Done!")