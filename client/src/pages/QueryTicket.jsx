import React, { useState, useEffect, Fragment } from 'react';
import TicketNFT from '../abis/TicketNFT.json'; // TicketNFT 컨트랙트 ABI JSON 파일
import Web3 from 'web3';
import TicketCard from '../components/UI/TicketCard';
import styled from 'styled-components';
import NavBar from '../components/navbar/NavBar';
import Footer from '../components/footer/Footer';

const TicketListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Heading = styled.h1`
  text-align: center;
`;

const QueryTicketMain = styled.div`
  margin: 50px 0;
  min-height: 62vh;
`

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
        return { ...tokenInfo, tokenId }; // 토큰 ID 정보를 NFT 정보에 추가
      }));
      setUserNFTs(userNFTInfos);
      console.log(userNFTInfos)
    } catch (error) {
      console.error('NFT 정보를 가져오는 도중에 오류가 발생했습니다:', error);
    }
  };

  return (
    <Fragment>
      <NavBar />
      <QueryTicketMain>
        <Heading>나의 NFT 공연 티켓 목록</Heading>
        <TicketListContainer>
          {userNFTs.map((nft, index) => (
            <TicketCard key={index} nft={nft} />
          ))}
        </TicketListContainer>
      </QueryTicketMain>
      <Footer />
    </Fragment>
  );
};

export default QueryTicket;