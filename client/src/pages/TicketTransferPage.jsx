import React, { useState, useEffect, Fragment } from 'react';
import TicketNFT from '../abis/TicketNFT.json'; // TicketNFT 컨트랙트 ABI JSON 파일
import Web3 from 'web3';
import styled from 'styled-components';
import NavBar from '../components/navbar/NavBar';
import Footer from '../components/footer/Footer';

const TransferForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Heading = styled.h1`
  text-align: center;
`;

const QueryTicketMain = styled.div`
  margin: 50px 0;
  min-height: 62vh;
`

const TransferButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: transparent; /* 투명한 배경색 */
  border: 2px solid #ccc; /* 테두리 스타일 */
  border-radius: 5px;
  font-weight: bold;
  color: #333; /* 텍스트 색상 */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s; /* hover 시에 색상 변경을 위한 transition 효과 */
  
  &:hover {
    background-color: #333; /* hover 시 배경색 변경 */
    color: #fff; /* hover 시 텍스트 색상 변경 */
  }
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

const TicketTransferPage = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [ticketContract, setTicketContract] = useState(null);
  const [toAddress, setToAddress] = useState('');
  const [tokenId, setTokenId] = useState('');

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

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      // NFT 양도 실행
      await ticketContract.methods.transfer(toAddress, tokenId).send({ from: accounts[0] });
      alert('NFT가 성공적으로 양도되었습니다.');
    } catch (error) {
      console.error('NFT 양도 중 오류 발생:', error);
      alert('NFT 양도 중 오류가 발생했습니다.');
    }
  };

  return (
    <Fragment>
      <NavBar/>
      <QueryTicketMain>
      <Heading>NFT 티켓 양도</Heading>
      <TransferForm onSubmit={handleTransfer}>
        <InputLabel>
          수령 주소:
          <InputField
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            required
          />
        </InputLabel>
        <InputLabel>
          티켓 ID:
          <InputField
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            required
          />
        </InputLabel>
        <TransferButton type="submit">양도</TransferButton>
      </TransferForm>
      </QueryTicketMain>
      <Footer/>
    </Fragment>
  );
};

export default TicketTransferPage;