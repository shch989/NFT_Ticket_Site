from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from pycaret.classification import load_model, predict_model
from datetime import datetime
from typing import List, Dict
from collections import defaultdict
import time
from dateutil import parser

app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 허용할 origin을 명시
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# PyCaret 모델 로드
model = load_model('./model/240429')

# 이전 거래 데이터를 저장하기 위한 메모리 저장소
user_transactions: Dict[str, List[Dict]] = defaultdict(list)

class TransactionData(BaseModel):
    User_ID: str
    Transaction_Time: str  # 날짜 및 시간 문자열
    Transaction_Quantity: int
    Tranaction_diff_time: float
    Age: int
    Payment_Method: str
    Card_Type: str
    Card_Last4: int
    isAnormal: str
    IP_Address: str
    Device_Type: str

@app.post("/predict")
def predict(data: TransactionData):
    # 시작 시간 측정
    start_time = time.time()
    
    # 현재 거래의 시간 계산
    transaction_time = parser.parse(data.Transaction_Time)
    
    # 해당 사용자의 이전 거래 추출
    user_id = data.User_ID
    transactions = user_transactions[user_id]
    
    if transactions:
        # 거래가 두 번째 이후인 경우
        last_transaction_time = transactions[-1]['Transaction_Time']
        transaction_diff = (transaction_time - last_transaction_time).total_seconds()
        # Tranaction_diff_time 업데이트
        data.Tranaction_diff_time = transaction_diff
    else:
        # 첫 거래일 경우
        data.Tranaction_diff_time = data.Tranaction_diff_time  # 또는 적절한 기본 값

    # 현재 거래를 거래 목록에 추가
    transactions.append({
        'Transaction_Time': transaction_time,
        'Card_Last4': data.Card_Last4,
        'IP_Address': data.IP_Address
    })
    
    # 저장된 거래 업데이트
    user_transactions[user_id] = transactions
    
    # Card_Last4_count, IP_Address_count, IP_Transaction_diff_time, Card_Transaction_diff_time 계산
    card_last4_count = sum(1 for t in transactions if t['Card_Last4'] == data.Card_Last4)
    ip_address_count = sum(1 for t in transactions if t['IP_Address'] == data.IP_Address)
    
    # 시간 차 계산
    time_diffs = [t['Transaction_Time'] for t in transactions]
    if len(time_diffs) > 1:
        time_diffs.sort()
        ip_transaction_diff_times = [(time_diffs[i] - time_diffs[i-1]).total_seconds() for i in range(1, len(time_diffs))]
        ip_transaction_diff_time = sum(ip_transaction_diff_times) / len(ip_transaction_diff_times) if ip_transaction_diff_times else 0
    else:
        ip_transaction_diff_time = 0
    
    # 카드 거래 시간 차이 계산
    card_times = [t['Transaction_Time'] for t in transactions if t['Card_Last4'] == data.Card_Last4]
    if len(card_times) > 1:
        card_times.sort()
        card_transaction_diff_times = [(card_times[i] - card_times[i-1]).total_seconds() for i in range(1, len(card_times))]
        card_transaction_diff_time = sum(card_transaction_diff_times) / len(card_transaction_diff_times) if card_transaction_diff_times else 0
    else:
        card_transaction_diff_time = 0
    
    # 입력 데이터를 DataFrame으로 변환
    input_data = pd.DataFrame([data.dict()])
    
    # 계산된 피처를 입력 데이터에 추가
    input_data['Card_Last4_count'] = card_last4_count
    input_data['IP_Address_count'] = ip_address_count
    input_data['IP_Transaction_diff_time'] = ip_transaction_diff_time
    input_data['Card_Transaction_diff_time'] = card_transaction_diff_time
    
    # 모델을 위해 Transaction_Time을 datetime64로 변환
    input_data['Transaction_Time'] = pd.to_datetime(data.Transaction_Time)
    
    # 예측 수행
    try:
        prediction = predict_model(model, data=input_data)
        
        # 실제 컬럼 이름에 기반한 예측 결과 추출
        prediction_label = prediction['prediction_label'].values[0] if 'prediction_label' in prediction.columns else None
        prediction_score = prediction['prediction_score'].values[0] if 'prediction_score' in prediction.columns else None
        
        # 결과를 직렬화 가능하게 변환
        result = {
            "prediction_label": int(prediction_label) if prediction_label is not None else None,
            "prediction_score": float(prediction_score) if prediction_score is not None else None,
            "Transaction_Time": float(data.Tranaction_diff_time)  # 숫자 형태로 반환
        }

        print(f"카드 총 사용 횟수: {input_data['Card_Last4_count'].tolist()}")
        print(f"아이피 총 사용 횟수: {input_data['IP_Address_count'].tolist()}")
        print(f"이전 아이피와 시간차: {input_data['IP_Transaction_diff_time'].tolist()}")
        print(f"이전 카드와 시간차: {input_data['Card_Transaction_diff_time'].tolist()}")
        print(f"이전거래와 시간 차: {input_data['Tranaction_diff_time'].tolist()}")

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)