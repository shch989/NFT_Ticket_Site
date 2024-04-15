import React, { useState, useEffect } from 'react';
import TicketNFT from '../abis/TicketNFT.json';
import Web3 from 'web3';

const QueryTicket = () => {
  const [tokenId, setTokenId] = useState(''); // 입력 받은 토큰 ID를 상태로 관리
  const [ticketInfo, setTicketInfo] = useState(null); // 티켓 정보를 상태로 관리
  const [ticketContract, setTicketContract] = useState(null);

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

  const getTicketInfo = async () => {
    try {
      const tokenIdNumber = parseInt(tokenId);
      const result = await ticketContract.methods.getTicketInfo(tokenIdNumber).call();
      setTicketInfo(result);
    } catch (error) {
      console.error('Failed to get ticket info:', error);
    }
  };


  return (
    <div>
      {/* 토큰 ID 입력란 */}
      <input
        type="text"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        placeholder="Enter Token ID"
      />
      {/* 정보 가져오기 버튼 */}
      <button onClick={getTicketInfo}>Get Ticket Info</button>
      {/* 티켓 정보 표시 */}
      {ticketInfo && (
        <div>
          <h3>Ticket Info</h3>
          <p>Buyer: {ticketInfo.buyer}</p>
          <p>Concert: {ticketInfo.concert}</p>
          <p>Purchase Time: {new Date(ticketInfo.purchaseTime * 1000).toString()}</p>
          <p>Selected Seats: {ticketInfo.selectedSeats.join(', ')}</p>
          <p>Payment Amount: {ticketInfo.paymentAmount}</p>
        </div>
      )}
    </div>
  );
};

export default QueryTicket;