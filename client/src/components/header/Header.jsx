import React from 'react';
import styled from 'styled-components'
import DeuLogo from '../../img/sillalogo.png'
import '../../styles/common.css'

const HeaderWrapper = styled.div`
  margin-bottom: 90px;
`

const Header = () => {
  return (
    <HeaderWrapper>
      <header id="header">
        <div class="container">
          <div class="row">
            <div class="header clearfix">
              <h1>
                <em><img src={DeuLogo} alt="MOVIE" /></em>
              </h1>
            </div>
          </div>
        </div>
      </header>
    </HeaderWrapper>
  );
};

export default Header;