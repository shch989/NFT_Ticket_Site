from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from pycaret.classification import load_model, predict_model
from datetime import datetime
from typing import List, Dict
from collections import defaultdict
import time

app = FastAPI()

# Load the PyCaret model
model = load_model('./model/240429')

# Memory storage for previous transaction data
user_transactions: Dict[str, List[Dict]] = defaultdict(list)

class TransactionData(BaseModel):
    User_ID: str
    Transaction_Time: str  # Date and time string
    Transaction_Quantity: int
    Tranaction_diff_time: float
    Age: int
    Payment_Method: str
    Card_Type: str
    Card_Last4: int
    isAnormal: str
    IP_Address: str
    Device_Type: str

@app.post("/predict/")
def predict(data: TransactionData):
    # Start measuring time
    start_time = time.time()
    
    # Calculate the time of the current transaction
    transaction_time = datetime.strptime(data.Transaction_Time, '%Y-%m-%d %I:%M:%S %p')
    
    # Extract previous transactions for the user
    user_id = data.User_ID
    transactions = user_transactions[user_id]
    
    # Update the list of transactions with the current one
    transactions.append({
        'Transaction_Time': transaction_time,
        'Card_Last4': data.Card_Last4,
        'IP_Address': data.IP_Address
    })
    
    # Update the stored transactions
    user_transactions[user_id] = transactions
    
    # Calculate Card_Last4_count, IP_Address_count, IP_Transaction_diff_time, Card_Transaction_diff_time
    card_last4_count = sum(1 for t in transactions if t['Card_Last4'] == data.Card_Last4)
    ip_address_count = sum(1 for t in transactions if t['IP_Address'] == data.IP_Address)
    
    # Calculate time differences
    time_diffs = [t['Transaction_Time'] for t in transactions]
    if len(time_diffs) > 1:
        time_diffs.sort()
        ip_transaction_diff_times = [(time_diffs[i] - time_diffs[i-1]).total_seconds() for i in range(1, len(time_diffs))]
        ip_transaction_diff_time = sum(ip_transaction_diff_times) / len(ip_transaction_diff_times) if ip_transaction_diff_times else 0
    else:
        ip_transaction_diff_time = 0
    
    # Calculate card transaction time differences
    card_times = [t['Transaction_Time'] for t in transactions if t['Card_Last4'] == data.Card_Last4]
    if len(card_times) > 1:
        card_times.sort()
        card_transaction_diff_times = [(card_times[i] - card_times[i-1]).total_seconds() for i in range(1, len(card_times))]
        card_transaction_diff_time = sum(card_transaction_diff_times) / len(card_transaction_diff_times) if card_transaction_diff_times else 0
    else:
        card_transaction_diff_time = 0
    
    # Convert input data to DataFrame
    input_data = pd.DataFrame([data.dict()])
    
    # Add calculated features to input data
    input_data['Card_Last4_count'] = card_last4_count
    input_data['IP_Address_count'] = ip_address_count
    input_data['IP_Transaction_diff_time'] = ip_transaction_diff_time
    input_data['Card_Transaction_diff_time'] = card_transaction_diff_time
    
    # Keep Transaction_Time as datetime64 for the model
    input_data['Transaction_Time'] = pd.to_datetime(data.Transaction_Time, format='%Y-%m-%d %I:%M:%S %p')
    
    # Make prediction
    try:
        prediction = predict_model(model, data=input_data)
        
        # Print prediction DataFrame to debug
        print(prediction.head())
        print(prediction.columns)  # Print column names for debugging
        
        # Extract prediction results based on the actual column names
        prediction_label = prediction['prediction_label'].values[0] if 'prediction_label' in prediction.columns else None
        prediction_score = prediction['prediction_score'].values[0] if 'prediction_score' in prediction.columns else None
        
        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        
        # Ensure the result is serializable
        result = {
            "prediction_label": int(prediction_label) if prediction_label is not None else None,
            "prediction_score": float(prediction_score) if prediction_score is not None else None,
            "Transaction_Time": elapsed_time  # Include elapsed time in result
        }
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)