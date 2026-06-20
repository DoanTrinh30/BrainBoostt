"""
FastAPI service: serve trained ML model qua REST API.
Backend Node.js sẽ gọi sang đây để lấy prediction.

Default load model trained trên Duolingo HLR (data thật).
Có thể switch sang synthetic model qua endpoint /switch-model.

Chạy:
    uvicorn api:app --host 0.0.0.0 --port 8000 --reload
"""

import joblib
import json
import numpy as np
from pathlib import Path
from typing import List, Literal, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ============= CONFIG =============
SCRIPT_DIR = Path(__file__).parent.parent  # From src/ to project root
MODEL_DIR = SCRIPT_DIR / 'models'
DEFAULT_DATASET = 'duolingo'

# ============= LOAD MODELS =============
class ModelManager:
    """Quản lý load và switch giữa các model."""
    
    def __init__(self):
        self.current_dataset = None
        self.model = None
        self.scaler = None
        self.metadata = None
        self.available = {}
        self._discover_models()
    
    def _discover_models(self):
        """Tìm tất cả model có sẵn."""
        for ds in ['duolingo', 'synthetic']:
            paths = {
                'model': MODEL_DIR / f'best_model_{ds}.pkl',
                'scaler': MODEL_DIR / f'scaler_{ds}.pkl',
                'metadata': MODEL_DIR / f'metadata_{ds}.json',
            }
            if all(p.exists() for p in paths.values()):
                self.available[ds] = paths
                print(f"✅ Found model: {ds}")
    
    def load(self, dataset_key: str):
        """Load model cho dataset cụ thể."""
        if dataset_key not in self.available:
            raise ValueError(f"Model '{dataset_key}' không có. Available: {list(self.available.keys())}")
        
        paths = self.available[dataset_key]
        self.model = joblib.load(paths['model'])
        self.scaler = joblib.load(paths['scaler'])
        with open(paths['metadata']) as f:
            self.metadata = json.load(f)
        self.current_dataset = dataset_key
        print(f"🔄 Loaded model: {dataset_key} ({self.metadata['best_model_name']})")


manager = ModelManager()
if not manager.available:
    print("❌ Không tìm thấy model nào! Hãy chạy train.py trước.")
    raise FileNotFoundError("No trained models found")

# Load default model
manager.load(DEFAULT_DATASET if DEFAULT_DATASET in manager.available else list(manager.available.keys())[0])


# ============= SCHEMAS =============
class PredictRequest(BaseModel):
    review_count: int = Field(..., ge=0, description="Số lần đã ôn từ này")
    days_since_last_review: float = Field(..., ge=0, description="Ngày từ lần ôn trước")
    previous_accuracy: float = Field(..., ge=0, le=1, description="Tỉ lệ đúng trước đây (0-1)")
    response_time_ms: int = Field(..., ge=0, description="Thời gian phản hồi (ms)")
    difficulty: Literal['easy', 'medium', 'hard'] = Field(..., description="Độ khó từ")
    hour_of_day: int = Field(..., ge=0, le=23, description="Giờ học (0-23)")


class PredictResponse(BaseModel):
    retention_probability: float
    will_remember: bool
    recommendation: str
    next_review_days: int
    model_used: str


class BatchPredictRequest(BaseModel):
    items: List[PredictRequest]


class SwitchModelRequest(BaseModel):
    dataset: Literal['duolingo', 'synthetic']


# ============= HELPERS =============
def features_to_array(req: PredictRequest) -> np.ndarray:
    """Convert request thành array theo đúng thứ tự feature_columns."""
    h = req.hour_of_day
    
    feature_dict = {
        'review_count': req.review_count,
        'days_since_last_review': req.days_since_last_review,
        'previous_accuracy': req.previous_accuracy,
        'response_time_ms': req.response_time_ms,
        'diff_easy': 1 if req.difficulty == 'easy' else 0,
        'diff_medium': 1 if req.difficulty == 'medium' else 0,
        'diff_hard': 1 if req.difficulty == 'hard' else 0,
        'time_morning': 1 if 6 <= h < 12 else 0,
        'time_afternoon': 1 if 12 <= h < 18 else 0,
        'time_evening': 1 if 18 <= h < 22 else 0,
        'time_night': 1 if (h >= 22 or h < 6) else 0,
    }
    
    feature_cols = manager.metadata['feature_columns']
    arr = np.array([[feature_dict.get(col, 0) for col in feature_cols]])
    return arr


def make_recommendation(prob: float) -> tuple[str, int]:
    """Trả về (recommendation_text, next_review_days)."""
    if prob < 0.3:
        return "Cần ôn ngay! Khả năng quên rất cao.", 0
    elif prob < 0.5:
        return "Nên ôn lại trong hôm nay.", 1
    elif prob < 0.7:
        return "Nên ôn trong 1-2 ngày tới.", 2
    elif prob < 0.85:
        return "Có thể ôn trong 3-5 ngày tới.", 4
    else:
        return "Đã nhớ tốt, có thể giãn ra 7+ ngày.", 7


# ============= APP =============
app = FastAPI(
    title="BrainBoost ML API",
    description="ML service for flashcard retention prediction",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============= ENDPOINTS =============
@app.get("/")
def root():
    return {
        "service": "BrainBoost ML API",
        "version": "2.0.0",
        "current_model": {
            "dataset": manager.current_dataset,
            "algorithm": manager.metadata['best_model_name'],
            "dataset_size": manager.metadata.get('dataset_size'),
        },
        "available_datasets": list(manager.available.keys()),
        "endpoints": {
            "POST /predict": "Predict retention for 1 flashcard",
            "POST /predict/batch": "Predict retention for multiple flashcards",
            "POST /switch-model": "Switch between Duolingo/Synthetic model",
            "GET /metrics": "Get model performance metrics",
            "GET /info": "Get current model info",
        }
    }


@app.get("/info")
def get_info():
    """Thông tin chi tiết về model đang load."""
    return {
        "current_dataset": manager.current_dataset,
        "model_name": manager.metadata['best_model_name'],
        "feature_columns": manager.metadata['feature_columns'],
        "dataset_size": manager.metadata.get('dataset_size'),
        "metrics_all_models": manager.metadata['metrics'],
    }


@app.get("/metrics")
def get_metrics():
    """Performance metrics của model đang load."""
    best_name = manager.metadata['best_model_name']
    return {
        "best_model": best_name,
        "metrics": manager.metadata['metrics'][best_name],
        "all_models": manager.metadata['metrics'],
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    """Dự đoán xác suất nhớ flashcard ở lần ôn tới."""
    try:
        X = features_to_array(req)
        if manager.metadata['use_scaler']:
            X = manager.scaler.transform(X)
        
        prob = float(manager.model.predict_proba(X)[0, 1])
        rec_text, next_days = make_recommendation(prob)
        
        return PredictResponse(
            retention_probability=round(prob, 4),
            will_remember=prob >= 0.5,
            recommendation=rec_text,
            next_review_days=next_days,
            model_used=f"{manager.current_dataset}/{manager.metadata['best_model_name']}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/batch")
def predict_batch(req: BatchPredictRequest):
    """Predict nhiều flashcards cùng lúc."""
    try:
        X_list = [features_to_array(item)[0] for item in req.items]
        X = np.array(X_list)
        if manager.metadata['use_scaler']:
            X = manager.scaler.transform(X)
        
        probs = manager.model.predict_proba(X)[:, 1]
        results = []
        for p in probs:
            rec_text, next_days = make_recommendation(float(p))
            results.append({
                "retention_probability": round(float(p), 4),
                "will_remember": bool(p >= 0.5),
                "recommendation": rec_text,
                "next_review_days": next_days,
            })
        return {
            "model_used": f"{manager.current_dataset}/{manager.metadata['best_model_name']}",
            "predictions": results,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/switch-model")
def switch_model(req: SwitchModelRequest):
    """Switch giữa model Duolingo và Synthetic."""
    try:
        manager.load(req.dataset)
        return {
            "message": f"Switched to {req.dataset} model",
            "current_model": {
                "dataset": manager.current_dataset,
                "algorithm": manager.metadata['best_model_name'],
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)