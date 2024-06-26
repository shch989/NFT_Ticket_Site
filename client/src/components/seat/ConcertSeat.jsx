import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Container, Button } from 'react-bootstrap';
import styled from 'styled-components';
import TicketNFT from '../../abis/TicketNFT.json';
import Web3 from 'web3';

const StyledBackground = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(0,0,0,0.7);
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
`

const StyledContainer = styled(Container)`
  height: 60%;
  width: auto;
  max-height: 800px;
  max-width: 1500px;
  background-color: #efefee;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  border-radius: 30px;
`;

const Title = styled.h2`
  margin-bottom: 50px;
  margin-top: 0;
  font-size: 35px;
`;

const BuyButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 30px;
  font-size: 25px;
  border: none;
`;
const BackButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 30px;
  font-size: 25px;
  border: none;
`;

const ConcertSeat = ({ concertName, handleClose, concertDate, concertTime, concertPrice }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
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

  const addSeatHandler = (row, col) => {
    const rowSeat = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const colSeat = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const newSeat = rowSeat[row] + colSeat[col];

    const isExisting = selectedSeats.some(seat => seat === newSeat);

    if (!isExisting) {
      setSelectedSeats(prevSelectedSeats => [...prevSelectedSeats, newSeat]);
    } else {
      setSelectedSeats(prevSelectedSeats => prevSelectedSeats.filter(seat => seat !== newSeat));
    }
  };

  const sellTicket = async () => {
    const ticketCount = selectedSeats.length;
    const now = new Date();
  
    if (ticketCount > 4) {
      alert("티켓은 최대 4장까지만 구매할 수 있습니다.");
      return;
    }
  
    if (ticketCount <= 0) {
      alert("좌석을 선택하여 주십시오.");
      return;
    }
  
    try {
      setLoading(true);
  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
  
      // Mint 함수 호출 후에 반환된 토큰 ID를 얻기 위해 변수에 할당
      const receipt = await ticketContract.methods.mint(
        userAddress, concertName, concertDate, concertTime, selectedSeats, ticketCount * concertPrice
      ).send({ from: userAddress });
  
      const tokenId = receipt.events.Transfer.returnValues.tokenId.toString(); // 토큰 아이디
  
      alert(`${ticketCount * concertPrice}원이 정상적으로 결제되었습니다.`);
      console.log("공연 명: ", concertName);
      console.log("공연 날짜: ", concertDate);
      console.log("공연 시간: ", concertTime);
      console.log("좌석: ", selectedSeats);
      console.log("구매 시간: ", now);
      console.log("구매자: ", userAddress);
      console.log("구매자 IP: ", userIp);
      console.log("결제 금액: ", `${ticketCount * concertPrice}원`);
      console.log("티켓 수량: ", ticketCount);
      console.log("티켓 아이디: ", tokenId); // 이 부분 추가
      handleClose();
    } catch (error) {
      console.error("에러 발생:", error);
      alert("거래가 중지되었습니다.");
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
    <StyledBackground>
      <StyledContainer>
        <Title>"{concertName}" 좌석 선택</Title>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {new Array(8).fill(0).map((_, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row' }}>
              {new Array(8).fill(0).map((_, colIndex) => (
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  variant={selectedSeats.includes(`${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`) ? 'danger' : 'success'}
                  onClick={() => addSeatHandler(rowIndex, colIndex)}
                  style={{ margin: '5px' }}
                >
                  {`${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`}
                </Button>
              ))}
            </div>
          ))}
        </div>
        <h3>구매 : {selectedSeats.length}장 <br /> 가격 : {selectedSeats.length *  concertPrice }원</h3>
        {selectedSeats.length > 0 ? <BuyButton onClick={sellTicket} disabled={loading}>구매</BuyButton> : <BackButton onClick={handleClose}>취소</BackButton>}
        {ticketId && ( // 토큰 ID가 존재하면 화면에 출력
          <div>
            <h3>토큰 ID: {ticketId}</h3>
          </div>
        )}
      </StyledContainer>
    </StyledBackground>,
    document.getElementById('seat')
  );
};

export default ConcertSeat;