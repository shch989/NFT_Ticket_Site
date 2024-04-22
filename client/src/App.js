// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import HomePage from './pages/HomePage';
import QueryTicket from './pages/QueryTicket';
import TicketCard from './pages/TicketCard';
import TicketTransferPage from './pages/TicketTransferPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/query" element={<QueryTicket />} />
        <Route path="/ticket" element={<TicketCard />} />
        <Route path="/transfer" element={<TicketTransferPage />} />
      </Routes>
    </Router>
  );
};

export default App;
