import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import DeuLogo from '../../img/sillalogo.png'
import '../../styles/common.css'
import Web3 from 'web3';

const HeaderWrapper = styled.div`
  margin-bottom: 90px;
`

const UserIdWrapper = styled.h1`
  margin-left: 50px;
  margin-top: 30px;
  font-size: 20px;
`

const Header = () => {
  const [walletAddress, setWalletAddress] = useState('');

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
    <HeaderWrapper>
      <header id="header">
        <div class="container">
          <div class="row">
            <div class="header clearfix">
              <h1>
                <em><img src={DeuLogo} alt="MOVIE" /></em>
              </h1>
              <UserIdWrapper>Wallet ID: {walletAddress}</UserIdWrapper>
            </div>
          </div>
        </div>
      </header>
    </HeaderWrapper>
  );
};

export default Header;