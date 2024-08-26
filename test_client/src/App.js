import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components
const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2c2c2c;
  color: #fff;
`;

const FormContainer = styled.div`
  background-color: #3c3c3c;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  width: 400px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: #444;
  color: #fff;
  font-size: 14px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: #444;
  color: #fff;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  background-color: #5a67d8;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4c51bf;
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #4a4a4a;
  border-radius: 10px;
`;

function App() {
  const [formData, setFormData] = useState({
    User_ID: '',
    Password: '',
    Transaction_Quantity: 1,
    Age: '',
    Payment_Method: '',
    Card_Type: '',
    Card_Number: '', // 전체 카드 번호
    IP_Address: '182.48.151.189',
    Device_Type: 'Mobile',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const currentDateTime = new Date().toISOString();
    const diffTime = Date.now() / 1000;

    // 카드번호 뒷 4자리 추출
    const cardLast4 = formData.Card_Number.slice(-4);

    try {
      const response = await axios.post('http://localhost:8000/predict', {
        ...formData,
        Card_Last4: cardLast4,  // API에는 뒷 4자리만 보냄
        Transaction_Time: currentDateTime,
        Tranaction_diff_time: diffTime,
        isAnormal: 'FALSE',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResult(response.data);
      setError(null);

      setFormData({
        User_ID: '',
        Password: '',
        Transaction_Quantity: 1,
        Age: '',
        Payment_Method: '',
        Card_Type: '',
        Card_Number: '', // 카드 번호 초기화
        IP_Address: '182.48.151.189',
        Device_Type: 'Desktop',
      });
    } catch (err) {
      setError(err.response ? err.response.data.detail : err.message);
      setResult(null);
    }
  };

  return (
    <AppContainer>
      <FormContainer>
        <h1>티켓 결제 페이지</h1>

        <FormGroup>
          <Label>아이디 : </Label>
          <Input
            type="text"
            name="User_ID"
            value={formData.User_ID}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>비밀번호 : </Label>
          <Input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />
        </FormGroup>

        <FormGroup>
          <Label>티켓 수량 : </Label>
          <Input
            type="number"
            name="Transaction_Quantity"
            value={formData.Transaction_Quantity}
            onChange={handleChange}
            min="1"
            placeholder="티켓은 최대 3장까지 구매 가능합니다"
          />
        </FormGroup>

        <FormGroup>
          <Label>나이 : </Label>
          <Input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleChange}
            placeholder="나이를 입력하세요."
          />
        </FormGroup>

        <FormGroup>
          <Label>결제 수단 : </Label>
          <Select
            name="Payment_Method"
            value={formData.Payment_Method}
            onChange={handleChange}
          >
            <option value="">선택하시오</option>
            <option value="Credit Card">Credit Card</option>
            <option value="E-wallet">E-wallet</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>카드 유형 : </Label>
          <Select
            name="Card_Type"
            value={formData.Card_Type}
            onChange={handleChange}
          >
            <option value="">선택하시오</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>카드번호 (16자리):</Label>
          <Input
            type="text"
            name="Card_Number"
            value={formData.Card_Number}
            onChange={handleChange}
            placeholder="카드번호 16자리를 입력하세요"
            maxLength="16" // 카드번호는 16자리로 제한
          />
        </FormGroup>

        <Button onClick={handleSubmit}>예매하기</Button>

        {result && (
          <ResultContainer>
            <h2>결과</h2>
            {result.prediction_label === 0 ? (
              <p>티켓 예매가 완료되었습니다.</p>
            ) : (
              <p>매크로가 감지되었습니다. 나중에 다시 이용해 주십시오.</p>
            )}
            <p><strong>AI 정확도 : </strong> {result.prediction_score !== undefined ? result.prediction_score*100 : 'No prediction score'}%</p>
            <p><strong>이전 거래와의 시간 차 :</strong> {result.Transaction_Time !== undefined ? result.Transaction_Time : 'No transaction time'} sec</p>
          </ResultContainer>
        )}

        {error && (
          <ResultContainer>
            <h2>Error</h2>
            <p>{error}</p>
          </ResultContainer>
        )}
      </FormContainer>
    </AppContainer>
  );
}

export default App;