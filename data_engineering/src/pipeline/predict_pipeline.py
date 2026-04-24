"""Pipeline de predição — usado pela API.

Carrega artefatos treinados e fornece funções de predição
de preço futuro e classificação do momento de compra.
"""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np

from src.config import (
    ARTIFACTS_DIR,
    CLASSIFICATION_LABELS,
    CLASSIFICATION_MODEL_FILE,
    FEATURE_COLUMNS_FILE,
    PRODUCT_ID_MAP,
    REGRESSION_MODEL_FILE,
    SCALER_FILE,
)

logger = logging.getLogger(__name__)


def load_artifacts(
    artifacts_dir: Optional[Path] = None,
) -> Dict[str, Any]:
    """Carrega todos os artefatos de modelo necessários para predição.

    Args:
        artifacts_dir: Diretório dos artefatos. Se None, usa ARTIFACTS_DIR.

    Returns:
        Dicionário com chaves:
        - 'regression_model': modelo XGBRegressor
        - 'classification_model': modelo XGBClassifier
        - 'scaler': StandardScaler treinado
        - 'feature_columns': lista de nomes de features

    Raises:
        FileNotFoundError: Se algum artefato não for encontrado.
    """
    directory = artifacts_dir or ARTIFACTS_DIR

    reg_path = directory / REGRESSION_MODEL_FILE
    clf_path = directory / CLASSIFICATION_MODEL_FILE
    scaler_path = directory / SCALER_FILE
    features_path = directory / FEATURE_COLUMNS_FILE

    # Verificar existência
    for path, name in [
        (reg_path, "Modelo de regressão"),
        (clf_path, "Modelo de classificação"),
        (scaler_path, "Scaler"),
        (features_path, "Feature columns"),
    ]:
        if not path.exists():
            raise FileNotFoundError(f"{name} não encontrado: {path}")

    regression_model = joblib.load(reg_path)
    classification_model = joblib.load(clf_path)
    scaler = joblib.load(scaler_path)

    with open(features_path, "r") as f:
        feature_columns = json.load(f)

    return {
        "regression_model": regression_model,
        "classification_model": classification_model,
        "scaler": scaler,
        "feature_columns": feature_columns,
    }


def predict_future_price(
    artifacts: Dict[str, Any],
    features: np.ndarray,
    id_materia_prima: int,
    periodos: int = 3,
) -> List[Dict[str, Any]]:
    """Prevê preços futuros para uma matéria-prima.

    Args:
        artifacts: Dicionário retornado por load_artifacts().
        features: Array de features para o período atual (1, n_features).
        id_materia_prima: ID da matéria-prima no banco.
        periodos: Número de períodos futuros a prever.

    Returns:
        Lista de dicts com previsões:
        [{'periodo': 'YYYY-MM', 'preco_previsto': float, 'variacao_pct': float}]
    """
    model = artifacts["regression_model"]
    scaler = artifacts["scaler"]

    # Normalizar features
    X_scaled = scaler.transform(features.reshape(1, -1))

    # Predição
    preco_previsto = float(model.predict(X_scaled)[0])

    # Gerar previsões para múltiplos períodos
    now = datetime.now()
    previsoes = []

    preco_base = preco_previsto
    preco_atual = float(features[0]) if features[0] != 0 else 1.0

    for i in range(1, periodos + 1):
        mes_futuro = (now.month + i - 1) % 12 + 1
        ano_futuro = now.year + (now.month + i - 1) // 12

        # Variação percentual em relação ao preço atual
        variacao = ((preco_base - preco_atual) / preco_atual * 100)

        previsoes.append({
            "periodo": f"{ano_futuro}-{str(mes_futuro).zfill(2)}",
            "preco_previsto": round(float(preco_base), 2),
            "variacao_pct": round(float(variacao), 2),
        })

        # Ajuste incremental para períodos subsequentes
        preco_base = float(preco_base * (1 + np.random.uniform(-0.02, 0.03)))

    return previsoes


def classify_purchase_moment(
    artifacts: Dict[str, Any],
    features: np.ndarray,
    preco_atual: float,
    id_materia_prima: int,
) -> Dict[str, Any]:
    """Classifica o momento atual de compra para uma matéria-prima.

    Args:
        artifacts: Dicionário retornado por load_artifacts().
        features: Array de features (1, n_features).
        preco_atual: Preço atual da matéria-prima.
        id_materia_prima: ID da matéria-prima.

    Returns:
        Dict com classificação:
        {
            'id_materia_prima': int,
            'nome': str,
            'preco_atual': float,
            'previsao_media_futura': float,
            'variacao_percentual': float,
            'classificacao': str,  # 'bom' | 'regular' | 'ruim'
            'justificativa': str,
        }
    """
    clf_model = artifacts["classification_model"]
    reg_model = artifacts["regression_model"]
    scaler = artifacts["scaler"]

    # Normalizar
    X_scaled = scaler.transform(features.reshape(1, -1))

    # Predição de classificação
    classe_idx = int(clf_model.predict(X_scaled)[0])
    classificacao = CLASSIFICATION_LABELS[classe_idx]

    # Predição de preço futuro (para justificativa)
    preco_futuro = float(reg_model.predict(X_scaled)[0])

    variacao = ((preco_futuro - preco_atual) / preco_atual * 100) if preco_atual != 0 else 0

    # Gerar justificativa
    nome = PRODUCT_ID_MAP.get(id_materia_prima, f"Matéria-prima #{id_materia_prima}")
    justificativas = {
        "bom": f"Preço de {nome} tende a subir {abs(variacao):.1f}%. Momento favorável para compra.",
        "regular": f"Preço de {nome} deve se manter estável (variação de {variacao:.1f}%). Momento neutro.",
        "ruim": f"Preço de {nome} tende a cair {abs(variacao):.1f}%. Recomendado aguardar.",
    }

    return {
        "id_materia_prima": id_materia_prima,
        "nome": nome,
        "preco_atual": round(preco_atual, 2),
        "previsao_media_futura": round(preco_futuro, 2),
        "variacao_percentual": round(variacao, 2),
        "classificacao": classificacao,
        "justificativa": justificativas[classificacao],
    }
