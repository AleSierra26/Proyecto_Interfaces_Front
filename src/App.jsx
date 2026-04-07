import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'
import LandingPage from './pages/LandingPage';
import './App.css'
import Header from './components/Header';
import BottomNav from './components/BottomNav';

export default function App() {

  const [base_url, setBase_url] = useState('');

  return (
    <BrowserRouter>

      <Header />

      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <BottomNav />

    </BrowserRouter>
  )
}
