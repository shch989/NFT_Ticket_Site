import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Container, Button } from 'react-bootstrap';
import styled from 'styled-components';

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

const ConcertSeat = ({ concertName, handleClose }) => {
  const [seats, setSeats] = useState(new Array(8).fill(new Array(8).fill(false)));
  const [selectedSeats, setSelectedSeats] = useState([]);

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

  // 스마트계약에서 수정 필요
  const sellTicket = (ticket) => {
    const now = new Date();
    if (ticket <= 0) {
      alert("좌석을 선택하여 주싶시오.")
    } else {
      alert(ticket * 15000 + "원이 정상적으로 결제되었습니다.")
      console.log("좌석: ", selectedSeats)
      console.log("구매 시간: ", now)
      console.log("구매자: User")
      console.log("결제 금액: ", ticket * 15000 + "원")
      handleClose()
    }
  }

  useEffect(() => {
  }, []);

  return ReactDOM.createPortal(
    <StyledBackground>
      <StyledContainer>
        <Title>{concertName} 좌석 선택</Title>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row' }}>
              {row.map((seat, colIndex) => (
                <Button
                  key={`${rowIndex}-${colIndex}`}
                  variant={seats[rowIndex][colIndex] ? 'danger' : 'success'}
                  onClick={() => addSeatHandler(rowIndex, colIndex)}
                  style={{ margin: '5px' }}
                >
                  {`${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`}
                </Button>
              ))}
            </div>
          ))}
        </div>
        <h3>구매 : {selectedSeats.length}장 <br /> 가격 : {selectedSeats.length * 15000}원</h3>
        {selectedSeats.length > 0 ? <BuyButton onClick={() => sellTicket(selectedSeats.length)}>구매</BuyButton> : <BackButton onClick={handleClose}>취소</BackButton>}
      </StyledContainer>
    </StyledBackground>,
    document.getElementById('seat')
  );
};

export default ConcertSeat;