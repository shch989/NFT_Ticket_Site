import React, { Fragment } from 'react'
import Header from './components/header/Header'
import Visual from './components/section/Visual'
import Notice from './components/section/Notice'
import MovieList from './components/section/MovieList'
import Footer from './components/footer/Footer'
import ConcertSeat from './components/seat/ConcertSeat'

const App = () => {
  return (
    <Fragment>
      <Header />
      <Visual/>
      <Notice/>
      <MovieList/>
      {/*<ConcertSeat/>*/}
      <Footer/>
    </Fragment>
  )
}

export default App
