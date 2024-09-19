import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import axios from 'axios';
import styled from 'styled-components';
import TicketNFT from '../../abis/TicketNFT.json';
import Web3 from 'web3';

// Styled components
const AppContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0,0,0,0.7);
  color: #fff;
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
`;

const FormContainer = styled.div`
  background-color: #3c3c3c;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(90, 81, 81, 0.644);
  width: auto; /* 더 넓은 가로 크기 */
  display: flex; /* Flexbox 사용 */
  align-items: flex-start; /* 요소들이 위쪽에서부터 정렬 */
  gap: 20px; /* 이미지와 양식 사이의 간격 */
`;

const ConcertImage = styled.img`
  width: auto; /* 이미지의 너비 */
  height: 700px; /* 이미지의 비율을 유지하며 높이 자동 조정 */
  margin-top: 30px;
  margin-right: 30px;
  border-radius: 10px; /* 이미지 모서리를 둥글게 */
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

const ConcertSeat = ({ concertName, handleClose, concertDate, concertTime, concertPrice, concertImage }) => {
  const [userIp, setUserIp] = useState('');
  const [ticketContract, setTicketContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  useEffect(() => {
    const loadTicketContract = async () => {
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);

          // MetaMask에게 사용자 계정 요청
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const ticketNFTAbi = TicketNFT.abi;
          const networkId = await web3.eth.net.getId();
          const ticketNFTNetworkData = TicketNFT.networks[networkId];
          if (!ticketNFTNetworkData) {
            throw new Error('TicketNFT 스마트 계약이 현재 네트워크에 배포되지 않았습니다.');
          }
          const ticketNFTAddress = ticketNFTNetworkData.address;

          const ticketContract = new web3.eth.Contract(ticketNFTAbi, ticketNFTAddress);
          setTicketContract(ticketContract);
        } else {
          throw new Error('MetaMask가 설치되지 않았거나 활성화되어 있지 않습니다.');
        }
      } catch (error) {
        console.error('스마트 계약을 불러오는 도중 오류가 발생했습니다:', error);
      }
    };

    loadTicketContract();
  }, []);

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
  
    const now = new Date();
  
    try {
      setLoading(true);
  
      // 예측 결과 가져오기
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
  
      // 예측 결과에 따라 거래 처리
      if (response.data.prediction_label === 0) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];
  
        // Mint 함수 호출 후에 반환된 토큰 ID를 얻기 위해 변수에 할당
        const receipt = await ticketContract.methods.mint(
          userAddress, concertName, concertDate, concertTime, formData.Transaction_Quantity * concertPrice, formData.Transaction_Quantity
        ).send({ from: userAddress });
  
        const tokenId = receipt.events.Transfer.returnValues.tokenId.toString(); // 토큰 아이디
  
        alert(`${formData.Transaction_Quantity * concertPrice}원이 정상적으로 결제되었습니다.`);
        console.log("공연 명: ", concertName);
        console.log("공연 날짜: ", concertDate);
        console.log("공연 시간: ", concertTime);
        console.log("구매 시간: ", now);
        console.log("구매자: ", userAddress);
        console.log("구매자 IP: ", userIp);
        console.log("결제 금액: ", `${formData.Transaction_Quantity * concertPrice}원`);
        console.log("티켓 수량: ", formData.Transaction_Quantity);
        console.log("티켓 아이디: ", tokenId); // 이 부분 추가
        handleClose();
      } else {
        alert("매크로가 감지되었습니다. 나중에 다시 이용해 주십시오.");
      }
  
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
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        const userIP = data.ip;
        setUserIp(userIP);
      })
      .catch(error => {
        console.error('IP 주소를 가져오는 데 문제가 발생했습니다:', error);
      });
  }, []);

  return ReactDOM.createPortal(
    <AppContainer onClick={handleClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <ConcertImage src={concertImage} alt="Concert Image" />
        <div>
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
        </div>
      </FormContainer>
    </AppContainer>,
    document.getElementById('seat')
  )
}

export default ConcertSeat