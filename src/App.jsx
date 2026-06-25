import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage';
import MyEvents from './pages/MyEvents';
import CreateEventPage from './pages/CreateEventPage';
import MyTickets from './pages/MyTickets';
import SpecificEvent from './pages/SpecificEvent';
import ScannerPage from './pages/ScannerPage';
import AuthPage from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import EditEventPage from './pages/EditEventPage';
import './App.css'
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

function AppContent() {
  const location = useLocation();

  return (
    <>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-[10px] focus:text-xs focus:uppercase focus:tracking-widest focus:font-sans"
      >
        Saltar al contenido principal
      </a>

      <Header />

      <main id="main-content">
      <Routes>
        {/* public routes */}
        <Route path='/' element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/auth" element={<PublicRoute><AuthPage mode={new URLSearchParams(window.location.search).get('mode') || 'login'} /></PublicRoute>} />
        {/* esto mira la URL, encuentra el parámetro mode, y lo pasa a AuthPage. Pero si no hay mode en la URL, lo vuelve 'login' por default */}

        {/* private routes */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/my-events" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
        <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
        <Route path="/event/:eventId" element={<ProtectedRoute><SpecificEvent /></ProtectedRoute>} />
        <Route path="/scanner/:eventId" element={<ProtectedRoute><ScannerPage /></ProtectedRoute>} />
        <Route path='/payment' element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path='/edit-event/:eventId' element={<ProtectedRoute><EditEventPage /></ProtectedRoute>} />
      </Routes>
      </main>

      {location.pathname !== '/' && location.pathname !== '/auth' && <BottomNav />}
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
