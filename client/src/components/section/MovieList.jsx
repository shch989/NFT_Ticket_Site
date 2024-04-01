import React, { useState } from 'react'
import styled from 'styled-components'
// css
import '../../styles/common.css'
import '../../styles/main.css'
// image
import movie1 from '../../img/poster01.jpg'
import movie2 from '../../img/poster02.jpg'
import movie3 from '../../img/poster03.jpg'
import movie4 from '../../img/poster04.jpg'
import movie5 from '../../img/poster05.jpg'
import movie6 from '../../img/poster06.jpg'
import movie7 from '../../img/poster07.jpg'
import movie8 from '../../img/poster08.jpg'
//components
import ConcertSeat from '../seat/ConcertSeat'

const MovieWapper = styled.div`
  margin-top: 50px;
`;

const movies = [
  { title: '침묵', image: movie1 },
  { title: '신세계', image: movie2 },
  { title: '마스터', image: movie3 },
  { title: '마약왕', image: movie4 },
];

const moreMovies = [
  { title: '범죄도시2', image: movie5 },
  { title: '괴물', image: movie6 },
  { title: '꼭두각시', image: movie7 },
  { title: 'GETOUT', image: movie8 },
];

const MovieList = () => {
  const [showConcertSeat, setShowConcertSeat] = useState(false);
  const [concertName, setConcertName] = useState('')

  const handleReserveClick = (name) => {
    setShowConcertSeat(true);
    setConcertName(name)
  };

  const handleReserveUnClick = () => {
    setShowConcertSeat(false);
  };

  return (
    <MovieWapper>
      <section id="movie">
        <div class="container">
          <div class="row">
            <div class="movie-text">이번 달 추천 공연</div>
            <div class="movie">
              <div class="movie_chart">
                <div class="chart_cont1">
                  {movies.map((movie, index) => (
                    <div key={index}>
                      <div className="poster">
                        <img src={movie.image} alt={movie.title} className="movie_poster" />
                      </div>
                      <div className="infor">
                        <h3><strong>{movie.title}</strong></h3>
                        <div className="infor_btn">
                          <button>상세보기</button>
                          <button onClick={() => handleReserveClick(movie.title)}>예매하기</button> 
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div class="chart_cont2">
                  {moreMovies.map((movie, index) => (
                    <div key={index}>
                      <div className="poster">
                        <img src={movie.image} alt={movie.title} className="movie_poster" />
                      </div>
                      <div className="infor">
                        <h3><strong>{movie.title}</strong></h3>
                        <div className="infor_btn">
                          <button>상세보기</button>
                          <button onClick={() => handleReserveClick(movie.title)}>예매하기</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showConcertSeat && <ConcertSeat handleClose={handleReserveUnClick} concertName={concertName} />}
    </MovieWapper>
  );
};

export default MovieList;