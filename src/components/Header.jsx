import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaBars, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import PasswordResetForm from './PasswordResetForm';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
  const [isResetPasswordFormOpen, setIsResetPasswordFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false); // Close mobile menu after search
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('token');
    localStorage.removeItem('isAvatarSet');
    setIsLoggedIn(false);
    setIsMenuOpen(false); // Close mobile menu after logout
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsLoginFormOpen(false);
  };

  // Open auth forms
  const openLoginForm = () => {
    setIsLoginFormOpen(true);
    setIsMenuOpen(false); // Close mobile menu
  };

  const openRegisterForm = () => {
    setIsRegisterFormOpen(true);
    setIsMenuOpen(false); // Close mobile menu
  };

  const openPasswordResetForm = () => {
    setIsResetPasswordFormOpen(true);
    setIsLoginFormOpen(false); // Close login form
  };

  return (
    <header className="bg-[#ebcfb2] shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-[#c3a287] transition-colors">
          VarsityRank.Ke
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/contact" className="text-gray-700 hover:text-[#c3a287] transition-colors">
            Contact
          </Link>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <input
              className="w-40 lg:w-60 px-4 py-2 rounded-full text-sm focus:w-64 focus:outline-none focus:ring-2 focus:ring-[#c3a287] transition-all duration-300 ease-in-out"
              type="text"
              placeholder="Search Campus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FaSearch />
            </button>
          </form>
          
          {/* Auth Links */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center text-gray-700 hover:text-[#c3a287] transition-colors">
                <CgProfile size={22} title="Profile" />
                <span className="ml-1">Profile</span>
              </Link>
              <button 
                onClick={logout} 
                className="flex items-center text-gray-700 hover:text-[#c3a287] transition-colors"
              >
                <FaSignOutAlt size={20} title="Logout" />
                <span className="ml-1">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={openLoginForm}
                className="text-gray-700 hover:text-[#c3a287] transition-colors"
              >
                Login
              </button>
              <button
                onClick={openRegisterForm}
                className="bg-[#c3a287] hover:bg-[#b38d73] text-white py-1.5 px-4 rounded-md transition-colors"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-[#c3a287] focus:outline-none md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        ref={menuRef}
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-[#ebcfb2] shadow-md p-4 absolute w-full z-30`}
      >
        <Link 
          to="/contact" 
          className="block text-gray-700 hover:text-[#c3a287] py-2 border-b border-[#e0c1a3]"
          onClick={() => setIsMenuOpen(false)}
        >
          Contact
        </Link>
        
        {isLoggedIn ? (
          <>
            <Link 
              to="/profile" 
              className="flex items-center text-gray-700 hover:text-[#c3a287] py-2 border-b border-[#e0c1a3]"
              onClick={() => setIsMenuOpen(false)}
            >
              <CgProfile size={20} className="mr-2" />
              Profile
            </Link>
            <button
              onClick={logout}
              className="flex items-center w-full text-left text-gray-700 hover:text-[#c3a287] py-2 border-b border-[#e0c1a3]"
            >
              <FaSignOutAlt size={20} className="mr-2" />
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={openLoginForm}
              className="block w-full text-left text-gray-700 hover:text-[#c3a287] py-2 border-b border-[#e0c1a3]"
            >
              Login
            </button>
            <button
              onClick={openRegisterForm}
              className="block w-full text-left text-gray-700 hover:text-[#c3a287] py-2 border-b border-[#e0c1a3]"
            >
              Register
            </button>
          </>
        )}
        
        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="relative mt-3">
          <input
            className="w-full px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#c3a287]"
            type="text"
            placeholder="Search Campus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FaSearch />
          </button>
        </form>
      </div>

      {/* Modals */}
      {isLoginFormOpen && (
        <LoginForm
          onClose={() => setIsLoginFormOpen(false)}
          passwordReset={openPasswordResetForm}
          onLogin={handleLoginSuccess}
        />
      )}
      
      {isRegisterFormOpen && (
        <RegisterForm 
          onClose={() => setIsRegisterFormOpen(false)}
          onRegister={() => {
            setIsRegisterFormOpen(false);
            setIsLoginFormOpen(true);
          }}
        />
      )}
      
      {isResetPasswordFormOpen && (
        <PasswordResetForm onClose={() => setIsResetPasswordFormOpen(false)} />
      )}
    </header>
  );
};

export default Header;