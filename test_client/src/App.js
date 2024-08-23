import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    const currentDateTime = new Date().toISOString(); // 현재 시간을 ISO8601 형식으로 설정
    const diffTime = Date.now() / 1000; // Unix 타임스탬프 (초 단위)

    const formData = {
      User_ID: "syyKp6Sdf",
      Transaction_Time: currentDateTime,  // 자동으로 현재 시간을 입력
      Transaction_Quantity: 4,
      Tranaction_diff_time: diffTime, // 처리 시간 계산 예시
      Age: 50,
      Payment_Method: "Credit Card",
      Card_Type: "Credit",
      Card_Last4: 1015,
      isAnormal: "FALSE",
      IP_Address: "182.48.151.189",
      Device_Type: "Mobile",
    };

    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.detail : err.message);
      setResult(null);
    }
  };

  return (
    <div className="App">
      <h1>Payment Prediction</h1>
      <button onClick={handleSubmit}>Submit Prediction Request</button>
      
      {result && (
        <div>
          <h2>Prediction Results</h2>
          <p><strong>Prediction Label:</strong> {result.prediction_label !== undefined ? result.prediction_label : 'No prediction label'}</p>
          <p><strong>Prediction Score:</strong> {result.prediction_score !== undefined ? result.prediction_score : 'No prediction score'}</p>
          <p><strong>Transaction Time:</strong> {result.Transaction_Time !== undefined ? result.Transaction_Time : 'No transaction time'} seconds</p>
        </div>
      )}

      {error && (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;