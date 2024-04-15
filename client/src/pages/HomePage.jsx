import React from 'react';
import styled from 'styled-components';
import MainImg from '../img/home_background.jpg';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-image: url(${MainImg});
  background-size: cover;
`;

const MainTitle = styled.h1`
  font-size: 70px;
  margin-bottom: 90px;
`;

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #fff;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const HomePage = () => {
  const navigate = useNavigate();

  const handleConnectMetaMask = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      navigate('/main');
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
    }
  };

  return (
    <Container>
      <LeftSide>
        <div>
          <MainTitle>AI, NFT 기반 부정 예매 확인 및 방지 시스템</MainTitle>
          <h3>
            본 프로젝트는 NFT와 AI를 통해 매크로 및 암표 등 온라인 예매 중 발생하는 부정예매를 탐지하고 차단하는 시스템입니다.{' '}
          </h3>
          <h3>아래의 시작하기 버튼을 누르면 MetaMask에 로그인할 수 있습니다.</h3>
          <h3>MetaMask의 계정이 없으신 분은 생성해 주시길 바랍니다.</h3>
          <h3>암표거래가 없는 깨끗한 관람 문화를 만듭시다. </h3>
          <h3>감사합니다.</h3>
          <Button onClick={handleConnectMetaMask}>시작하기</Button>
        </div>
      </LeftSide>
      <RightSide></RightSide>
    </Container>
  );
};

export default HomePage;