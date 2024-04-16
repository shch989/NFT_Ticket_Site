import React, { useState, useEffect, Fragment } from 'react';
import TicketNFT from '../abis/TicketNFT.json'; // TicketNFT 컨트랙트 ABI JSON 파일
import Web3 from 'web3';

const QueryTicket = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [ticketContract, setTicketContract] = useState(null);
  const [userNFTs, setUserNFTs] = useState([]);

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

  useEffect(() => {
    fetchUserNFTs();
  }, [ticketContract]); // ticketContract 상태가 변경될 때마다 NFT 정보 가져오기

  const fetchUserNFTs = async () => {
    if (!ticketContract) return;

    try {
      // 현재 지갑 소유자의 모든 NFT 토큰 ID 가져오기
      const tokenIds = await ticketContract.methods.getOwnedTicketIds(accounts[0]).call();
      console.log('사용자의 NFT 토큰 ID 목록:', tokenIds);

      // 각 토큰 ID에 대한 NFT 정보 가져오기
      const userNFTInfos = await Promise.all(tokenIds.map(async tokenId => {
        const tokenInfo = await ticketContract.methods.getTicketInfo(tokenId).call();
        return tokenInfo;
      }));
      setUserNFTs(userNFTInfos);
    } catch (error) {
      console.error('NFT 정보를 가져오는 도중에 오류가 발생했습니다:', error);
    }
  };

  return (
    <Fragment>
      <div>
        <h2>사용자의 NFT 정보</h2>
        {userNFTs.map((nft, index) => (
          <div key={index} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <p>티켓 ID: {index}</p>
            <p>구매자: {nft.buyer}</p>
            <p>콘서트: {nft.concert}</p>
            <p>구매 시간: {new Date(Number(nft.purchaseTime) * 1000).toLocaleString()}</p>
            <p>선택된 좌석: {nft.selectedSeats.join(', ')}</p>
            <p>결제 금액: {Number(nft.paymentAmount).toLocaleString()} 원</p>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default QueryTicket;