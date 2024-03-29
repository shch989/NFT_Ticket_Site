import React from 'react'
// css
import '../../styles/common.css'
import '../../styles/main.css'
// img
import MoviePoster01 from '../../img/movie_poster01.jpg'
import MoviePoster02 from '../../img/movie_poster02.png'
import MoviePoster03 from '../../img/movie_poster03.png'
import MoviePoster04 from '../../img/movie_poster04.jpg'
import MoviePoster05 from '../../img/movie_poster05.png'

// modules
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';


const Notice = () => {

  return (
    <section class="notice">
      <div class="movie-text">현재 상영중인 공연</div>
      <div class="promotion">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={80}
          slidesPerView={3}
          pagination={{ clickable: false }}
          class="swiper-container"
        >
          <div class="swiper-wrapper">
            <SwiperSlide class="swiper-slide">
              <img src={MoviePoster01} alt="신작공연1" class="swiper-image" />
              <a href="/" class="btn" target='_blank'>자세히 보기</a>
            </SwiperSlide>
            <SwiperSlide class="swiper-slide">
              <img src={MoviePoster02} alt="신작공연2" class="swiper-image" />
              <a href="/" class="btn" target='_blank'>자세히 보기</a>
            </SwiperSlide>
            <SwiperSlide class="swiper-slide">
              <img src={MoviePoster03} alt="신작공연3" class="swiper-image" />
              <a href="/" class="btn" target='_blank'>자세히 보기</a>
            </SwiperSlide>
            <SwiperSlide class="swiper-slide">
              <img src={MoviePoster04} alt="신작공연4" class="swiper-image" />
              <a href="/" class="btn" target='_blank'>자세히 보기</a>
            </SwiperSlide>
            <SwiperSlide class="swiper-slide">
              <img src={MoviePoster05} alt="신작공연5" class="swiper-image" />
              <a href="/" class="btn" target='_blank'>자세히 보기</a>
            </SwiperSlide>
          </div>
        </Swiper>
      </div>
    </section>
  );
}

export default Notice
