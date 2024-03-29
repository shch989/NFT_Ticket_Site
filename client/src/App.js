import React from 'react'
import Header from './components/header/Header'
import Visual from './components/section/Visual'
import Notice from './components/section/Notice'
import MovieList from './components/section/MovieList'
import Footer from './components/footer/Footer'

const App = () => {
  return (
    <>
      <Header />
      <Visual/>
      <Notice/>
      <MovieList/>
      <Footer/>
    </>
  )
}

export default App
