import React, { Fragment } from 'react';
import Header from '../components/header/Header';
import Visual from '../components/section/Visual';
import Notice from '../components/section/Notice';
import MovieList from '../components/section/MovieList';
import Footer from '../components/footer/Footer';

const MainPage = () => {
  // 테스트용
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    console.log('모바일로 접속했습니다.');
  } else {
    console.log('데스크탑으로 접속했습니다.');
  }

  return (
    <Fragment>
      <Header />
      <Visual />
      <Notice />
      <MovieList />
      <Footer />
    </Fragment>
  );
};

export default MainPage;