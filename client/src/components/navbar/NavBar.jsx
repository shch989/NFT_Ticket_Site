import React, { useState, useEffect } from 'react';
import DeuLogo from '../../img/sillalogo.png'
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Web3 from 'web3';

const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 좌우 정렬 */
  align-items: center;
  height: 80px;
  width: 100%;
  background-color: #fff;
  padding: 0 20px; /* 좌우 여백 추가 */
`;

const NavBarImg = styled.img`
  margin-right: 50px;
  margin-top: 5px;
  padding: 5px, 8px 5px 0;
  display: inline-block;
  width: 110px;
  height: 45px;
`

const NavLinksWrapper = styled.div`
  margin-left: 10%;
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-right: 50px; /* 각 버튼 사이 간격 조정 */
  font-size: 25px;
  font-weight: bold;
  text-decoration: none;
  color: ${({ isActive }) => (isActive ? '#333' : '#999')};
  transition: color 0.3s ease;

  &:hover {
    color: ${({ isActive }) => (isActive ? '#555' : '#333')};
  }
`;

const UserIdWrapper = styled.h1`
  font-size: 20px;
  margin-right: 10%;
`;

const NavBar = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    async function fetchWalletAddress() {
      try {
        // Web3 객체 초기화
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          // MetaMask와 같은 지갑에 계정 액세스 요청
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          } else {
            setWalletAddress('None');
          }
        } else {
          setWalletAddress('No web3 provider detected');
        }
      } catch (error) {
        console.error("Failed to fetch wallet address:", error);
      }
    }

    fetchWalletAddress();
  }, []);

  return (
    <NavbarContainer> 
      <NavLinksWrapper>
        <NavBarImg src={DeuLogo} alt="MOVIE" />
        <NavLink to="/main" isActive={pathname === '/main'}>
          Main
        </NavLink>
        <NavLink to="/query" isActive={pathname === '/query'}>
          MyTicket
        </NavLink>
        <NavLink to="/transfer" isActive={pathname === '/transfer'}>
          Transfer
        </NavLink>
        <NavLink to="/trade-history" isActive={pathname === '/trade-history'}>
          History
        </NavLink>
      </NavLinksWrapper>
      <UserIdWrapper>Wallet ID: {walletAddress}</UserIdWrapper>
    </NavbarContainer>
  );
};

export default NavBar;