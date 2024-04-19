import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const TicketTample = styled.div`
  margin: 20px 30px;
  max-width: 380px;
`

const TicketDate = styled.div`
  font-weight: bold;
  border: 1px solid black;
  border-radius: 8px 8px 0 0;
  border-bottom: none;
  border-style: solid solid dashed solid;
  padding: 10px 121.7px;
  width: 380px;
  height: 50px;
`

const TicketContainer = styled.div`
  background-color: #f2f2f2; /* 연한 회색 배경 */
  border: 1px solid black;
  border-style: none solid solid solid;
  border-radius: 0 0 8px 8px;
  padding: 20px;
  width: 380px;
`

const TicketHeader = styled.div`
  padding-bottom: 10px;
  margin-bottom: 10px;
  text-align: center;
`

const TicketMain = styled.div`
  background-color: white; /* 흰색 배경 */
  padding: 10px 20px;
  border: 2px solid lightgray;
  border-style: solid none none none;
`

const ConcertName = styled.div`
  font-weight: bold;
`

const ConcertTime = styled.div`
  margin-top: 5px;
`

const TicketMainItem = styled.div`
  margin-top: 10px;
  font-size: 15px;
`

const NoticeFont = styled.div`
  background-color: white; /* 흰색 배경 */
  padding: 10px 10px;
  border: 2px solid lightgray;
  border-style: solid none solid none;
  font-size: 12px;
`

const CurrentTime = styled.div`
  margin: 20px 0;
  border: 1px solid black;
  border-style: solid none solid none;
  padding: 5px 60px;
`

const AmountPay = styled.div`
  margin: 15px 0 10px 0;
  padding-bottom: 10px;
  border: 2px solid lightgray;
  border-style: none none solid none;
`

const TicketCard = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [shortenedBuyer, setShortenedBuyer] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 구매자의 정보를 8글자로 자르고 '...'을 붙여 표시
    if (props.nft.buyer.length > 26) {
      setShortenedBuyer(props.nft.buyer.slice(0, 26) + '...');
    } else {
      setShortenedBuyer(props.nft.buyer);
    }

    return () => clearInterval(interval);
  }, [props.nft.buyer]);

  // 블록 타임스탬프를 날짜와 시간 형식으로 변환하는 함수
  const formatPurchaseTime = (timestamp) => {
    const dateInMillis = Number(timestamp) * 1000; // BigInt 값을 밀리초로 변환
    const date = new Date(dateInMillis);
    return date.toLocaleString();
  };

  // 좌석 배열을 문자열로 변환하는 함수
  const formatSeats = (seats) => {
    return seats.join(', '); // 각 좌석 사이에 쉼표 추가
  };

  return (
    <TicketTample>
      <TicketDate>{props.nft.concertDate}</TicketDate>
      <TicketContainer>
        <TicketHeader>
          <ConcertName>{props.nft.concert}</ConcertName>
          <ConcertTime>{props.nft.concertTime}</ConcertTime>
        </TicketHeader>
        <TicketMain>
          <TicketMainItem><b>좌석 :</b> {formatSeats(props.nft.selectedSeats)}</TicketMainItem>
          <TicketMainItem><b>구매자 :</b> {shortenedBuyer}</TicketMainItem>
          <TicketMainItem><b>구매시간 :</b> {formatPurchaseTime(props.nft.purchaseTime)}</TicketMainItem>
        </TicketMain>
        <NoticeFont>혼잡하오니 공연 입장은 공연시작 15분 전에 착석하여 주시기 바랍니다.</NoticeFont>
        <CurrentTime>{currentTime.toLocaleString()}</CurrentTime>
        <AmountPay><b>티켓ID :</b> {props.nft.tokenId.toString()}</AmountPay>
        <AmountPay><b>티켓장수 :</b> {props.nft.selectedSeats.length}장</AmountPay>
        <AmountPay><b>티켓요금 합계 :</b> {props.nft.paymentAmount.toString()}원</AmountPay>
      </TicketContainer>
    </TicketTample>
  );
}

export default TicketCard