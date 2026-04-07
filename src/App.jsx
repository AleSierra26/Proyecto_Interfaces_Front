import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage';
import MyEvents from './pages/MyEvents';
import CreateEventPage from './pages/CreateEventPage';
import MyTickets from './pages/MyTickets';
import './App.css'
import Header from './components/Header';
import BottomNav from './components/BottomNav';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/my-tickets" element={<MyTickets />} />
      </Routes>

      {location.pathname !== '/' && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
