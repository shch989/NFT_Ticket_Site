import React, { useState, useEffect, Fragment } from 'react';
import Web3 from 'web3';
import TicketNFT from '../abis/TicketNFT.json'; // TicketNFT 컨트랙트 ABI JSON 파일
import styled from 'styled-components';
import NavBar from '../components/navbar/NavBar';
import Footer from '../components/footer/Footer';

// TradeHistoryPage 컴포넌트를 감싸는 컨테이너 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 28px 0 50px 0;
  min-height: 63.7vh;
`;

// 양도 이력 리스트 스타일
const TradeHistoryList = styled.ul`
  list-style: none;
  padding: 0;
`;

// 양도 이력 리스트 아이템 스타일
const TradeHistoryItem = styled.li`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

// 각 양도 이력 아이템 내용 스타일
const TradeHistoryContent = styled.div`
  display: flex;
  flex-direction: column;
`;

// 제목 스타일
const Title = styled.h1`
  text-align: center;
`;

const SubHeading = styled.h2`
  text-align: center;
`;

const InputWrapper = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center; /* 입력란과 버튼을 수평으로 정렬하기 위해 추가 */
`;

const InputLabel = styled.label`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  font-weight: bold;
`;

const InputField = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  width: 500px;
`;

const TransferButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: transparent;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #333;
    color: #fff;
  }
`;

const TradeHistoryPage = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [ticketContract, setTicketContract] = useState(null);
  const [tokenId, setTokenId] = useState('');
  const [tradeHistory, setTradeHistory] = useState([]);
  const [historyOnOff, setHistoryOnOff] = useState(false)

  useEffect(() => {
    const initWeb3 = async () => {
      // MetaMask 또는 다른 웹3 지갑이 설치되어 있는지 확인
      if (window.ethereum) {
        // MetaMask를 통해 연결
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // MetaMask 사용자의 지갑 주소 가져오기
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          // TicketNFT 컨트랙트 인스턴스 생성
          const ticketNFTAbi = TicketNFT.abi;
          const networkId = await web3Instance.eth.net.getId();
          const ticketNFTNetworkData = TicketNFT.networks[networkId];
          if (!ticketNFTNetworkData) {
            throw new Error('TicketNFT 스마트 계약이 현재 네트워크에 배포되지 않았습니다.');
          }
          const ticketNFTAddress = ticketNFTNetworkData.address;
          const ticketContractInstance = new web3Instance.eth.Contract(ticketNFTAbi, ticketNFTAddress);
          setTicketContract(ticketContractInstance);
        } catch (error) {
          console.error('지갑 주소를 가져오거나 TicketNFT 컨트랙트를 초기화하는 중에 오류가 발생했습니다:', error);
        }
      } else {
        console.warn('MetaMask가 설치되지 않았거나 활성화되어 있지 않습니다.');
      }
    };

    initWeb3();
  }, []);

  const handleTokenIdChange = (e) => {
    setTokenId(e.target.value);
  };

  const getTradeHistory = async () => {
    try {
      if (tokenId == '') {
        alert("검색할 토큰 ID 값을 입력하여 주십시오.")
        return
      }
      // 특정 토큰 ID에 대한 거래 이력을 불러오기
      const history = await ticketContract.methods.getTradeHistory(tokenId).call();
      setTradeHistory(history);
      setHistoryOnOff(true)
    } catch (error) {
      console.error('거래 이력을 불러오는 중에 오류가 발생했습니다:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };

  return (
    <Fragment>
      <NavBar />
      <Container>
        <Title>티켓 거래 이력 조회</Title>
        <InputWrapper>
          <InputLabel>
            티켓 ID:
            <InputField
              type="number"
              value={tokenId}
              onChange={handleTokenIdChange}
            />
          </InputLabel>
          <TransferButton onClick={getTradeHistory}>조회</TransferButton>
        </InputWrapper>
        {historyOnOff && <div>
          <SubHeading>티켓 양도 이력</SubHeading>
          <TradeHistoryList>
            {tradeHistory.map((trade, index) => (
              <TradeHistoryItem key={index}>
                <TradeHistoryContent>
                  <h3>No.{index + 1}</h3>
                  <p>소유자: {trade.buyer}</p>
                  <p>콘서트: {trade.concert}</p>
                  <p>콘서트 일자: {trade.concertDate}</p>
                  <p>콘서트 시간: {trade.concertTime}</p>
                  <p>양도 일자: {formatDate(parseInt(trade.purchaseTime))}</p>
                  <p>결제 금액: {trade.paymentAmount.toString()}</p>
                </TradeHistoryContent>
              </TradeHistoryItem>
            ))}
          </TradeHistoryList>
        </div>}
      </Container>
      <Footer />
    </Fragment>
  );
};

export default TradeHistoryPage;