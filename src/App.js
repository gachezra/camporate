import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import UniversityDetails from './pages/UniversityDetails'

function App() {
  return (
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/verify/:verificationToken" element={<EmailVerify/> } />
          <Route path="/reset/:resetToken" element={<ResetPassword/> } />
          <Route path="/campus/:universityId" element={<UniversityDetails/>} />
        </Routes>
        <Footer/>
      </Router>
  );
}

export default App;