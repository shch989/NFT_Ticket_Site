import React from 'react'
// css
import '../../styles/common.css'

const Footer = () => {
  return (
    <div>
      <footer>
        <div class="inner">
          <ul class="menu">
            <li><a href="/" class="green">개인정보처리방침</a></li>
            <li><a href="/">영상정보처리기기 운영관리 방침</a></li>
            <li><a href="/">홈페이지 이용약관</a></li>
            <li><a href="/">위치정보 이용약관</a></li>
            <li><a href="/">영화 기프티콘 이용약관</a></li>
            <li><a href="/">영화표 애매 이용약관</a></li>
          </ul>
          <div class="btn-group">
            <a href="/" class="btn btn--white">찾아오시는 길</a>
            <a href="/" class="btn btn--white">사용자 문의</a>
            <a href="/" class="btn btn--white">사이트 맵</a>
          </div>
          <div class="info">
            <span>개발자 번호 010-XXXX-XXXX</span>
            <span>(주)인공지능 그랜드 ICT</span>
            <span>TEL : 051) XXX-XXXX / FAX : 051) XXX-XXXX</span>
            <span>개인정보 책임자 : 조성현</span>
          </div>
          <p class="copyright">
            &copy; <span class="this-year"></span> (C) SILLA UNIVERSITY All rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
