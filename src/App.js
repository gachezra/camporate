import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Profile from './pages/Profile';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import UniversityDetails from './pages/UniversityDetails'
import AdminPage from './admin/pages/AdminPage';
import Unauthorized from './admin/pages/Unauthorized';
import AdminLogin from './admin/pages/AdminLogin';
import UniversitySetup from './admin/pages/UniversitySetup';
import ForumPage from './pages/Forums';
import BranchDetails from './pages/BranchDetails';
import AvatarCustomizer from './pages/AvatsrCustomizer';
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUs';
import PrivacyPolicyPage from './pages/PrivacyPolicy';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/verify/:verificationToken" element={<EmailVerify/> } />
          <Route path="/reset/:resetToken" element={<ResetPassword/> } />
          <Route path="/campus/:universityId" element={<UniversityDetails/>} />
          <Route path="/campus/:universityId/:branchId" element={<BranchDetails/>} />
          <Route path="/forums" element={<ForumPage/>} />
          <Route path="setAvatar" element={<AvatarCustomizer/>} />
          <Route path="/unauthorized" element={<Unauthorized/>} />
          <Route path="/admin-login" element={<AdminLogin/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/about" element={<AboutUsPage/>} />
          <Route path="/privacy" element={<PrivacyPolicyPage/>} />
          <Route path="/setup" element={<UniversitySetup/>} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
  );
}

export default App;