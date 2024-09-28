import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import PasswordResetForm from './PasswordResetForm';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
  const [isResetPasswordFormOpen, setIsResetPasswordFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    window.addEventListener('storage', checkLoginStatus);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#ebcfb2] shadow-md">
      <div className="text-xl font-bold"><Link to='/'>CampusRank Ke</Link></div>
      
      {/* Flex container for the middle section */}
      <div className="flex items-center justify-end flex-grow md:hidden">
        <button onClick={toggleMenu} className="text-gray-700 hover:text-c3a287 focus:outline-none ml-auto">
          <FaBars size={24} />
        </button>
      </div>
      
      <div className="relative flex items-center">
        <div className="relative my-4 md:my-0 md:mr-4 hidden md:block">
          <input
            className="w-32 md:w-48 px-3 py-2 rounded-full focus:md:w-64 focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
            type="text"
            placeholder="Search Campus..."
          />
          <div className="absolute top-0 right-0 flex items-center justify-center w-10 h-full text-gray-400">
            <FaSearch />
          </div>
        </div>
        <nav className="hidden md:flex md:items-center">
          <Link to="/contact" className="block text-gray-700 hover:text-c3a287 md:mr-4 my-2 md:my-0">
            Contact
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="block text-gray-700 hover:text-c3a287 md:mr-4 my-2 md:my-0">
                <CgProfile size={24} title="Profile" />
              </Link>
              <button
                className="block text-gray-700 hover:text-c3a287 md:mr-4 my-2 md:my-0"
                onClick={() => localStorage.removeItem('token')}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="block text-gray-700 hover:text-c3a287 md:mr-4 my-2 md:my-0"
                onClick={() => setIsLoginFormOpen(true)}
              >
                Login
              </button>
              {isLoginFormOpen && <LoginForm 
                onClose={() => setIsLoginFormOpen(false)}
                passwordReset={() => {setIsResetPasswordFormOpen(true)}}
                onLogin={checkLoginStatus()}
              />}
              {isResetPasswordFormOpen && <PasswordResetForm onClose={() => setIsResetPasswordFormOpen(false)}/>}
              <button
                className="block text-gray-700 hover:text-c3a287 md:mr-4 my-2 md:my-0"
                onClick={() => setIsRegisterFormOpen(true)}
              >
                Register
              </button>
              {isRegisterFormOpen && <RegisterForm onClose={() => setIsRegisterFormOpen(false)} />}
            </>
          )}
        </nav>
      </div>

      {/* Separate Hamburger Menu */}
      <div className={`absolute top-16 left-0 w-full bg-[#ebcfb2] shadow-md z-10 p-4 ${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <Link to="/contact" className="block text-gray-700 hover:text-c3a287 my-2">
          Contact
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="block text-gray-700 hover:text-c3a287 my-2">
              <CgProfile size={24} title="Profile" />
            </Link>
            <button
              className="block text-gray-700 hover:text-c3a287 my-2"
              onClick={() => localStorage.removeItem('token')}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="block text-gray-700 hover:text-c3a287 my-2"
              onClick={() => setIsLoginFormOpen(true)}
            >
              Login
            </button>
            {isLoginFormOpen && <LoginForm onClose={() => setIsLoginFormOpen(false)} />}
            <button
              className="block text-gray-700 hover:text-c3a287 my-2"
              onClick={() => setIsRegisterFormOpen(true)}
            >
              Register
            </button>
            {isRegisterFormOpen && <RegisterForm onClose={() => setIsRegisterFormOpen(false)} />}
          </>
        )}
        <div className="relative my-4 md:my-0 md:mr-4 md:hidden">
          <input
            className="w-full px-3 py-2 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
            type="text"
            placeholder="Search Campus..."
          />
          <div className="absolute top-0 right-0 flex items-center justify-center w-10 h-full text-gray-400">
            <FaSearch />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
