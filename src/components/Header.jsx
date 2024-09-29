import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import PasswordResetForm from './PasswordResetForm';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isRegisterFormOpen, setIsRegisterFormOpen] = useState(false);
  const [isResetPasswordFormOpen, setIsResetPasswordFormOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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

  const logout = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // This will trigger a re-render
    setIsLoginFormOpen(false);
  };

  return (
    <header className="bg-[#ebcfb2] shadow">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-c3a287">
          VarsityRank.Ke
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/contact" className="text-gray-700 hover:text-c3a287">Contact</Link>
          <form onSubmit={handleSearch} className="relative">
            <input
              className="w-40 lg:w-60 px-4 py-2 rounded-full text-sm focus:w-64 focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
              type="text"
              placeholder="Search Campus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute top-3 right-3 text-gray-400">
              <FaSearch />
            </button>
          </form>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-c3a287">
                <CgProfile size={24} title="Profile" />
              </Link>
              <button onClick={logout} className="text-gray-700 hover:text-c3a287">
                <FaSignOutAlt size={24} title="Logout" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsLoginFormOpen(true)}
                className="text-gray-700 hover:text-c3a287"
              >
                Login
              </button>
              {isLoginFormOpen && (
                <LoginForm
                  onClose={() => setIsLoginFormOpen(false)}
                  passwordReset={() => setIsResetPasswordFormOpen(true)}
                  onLogin={handleLoginSuccess}
                />
              )}
              {isResetPasswordFormOpen && (
                <PasswordResetForm onClose={() => setIsResetPasswordFormOpen(false)} />
              )}
              <button
                onClick={() => setIsRegisterFormOpen(true)}
                className="text-gray-700 hover:text-c3a287"
              >
                Register
              </button>
              {isRegisterFormOpen && (
                <RegisterForm onClose={() => setIsRegisterFormOpen(false)} />
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="text-gray-700 hover:text-c3a287 focus:outline-none md:hidden"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-[#ebcfb2] shadow-md p-4`}
      >
        <Link to="/contact" className="block text-gray-700 hover:text-c3a287 py-2">
          Contact
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="block text-gray-700 hover:text-c3a287 py-2">
              <CgProfile size={20} title="Profile" className="inline-block mr-2" />
              Profile
            </Link>
            <button
              onClick={logout}
              className="block text-gray-700 hover:text-c3a287 py-2 mb-4"
            >
              <FaSignOutAlt size={20} title="Logout" className="inline-block mr-2" />
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsLoginFormOpen(true)}
              className="block text-gray-700 hover:text-c3a287 py-2"
            >
              Login
            </button>
            {isLoginFormOpen && (
              <LoginForm onClose={() => setIsLoginFormOpen(false)} />
            )}
            <button
              onClick={() => setIsRegisterFormOpen(true)}
              className="block text-gray-700 hover:text-c3a287 py-2 mb-4"
            >
              Register
            </button>
            {isRegisterFormOpen && (
              <RegisterForm onClose={() => setIsRegisterFormOpen(false)} />
            )}
          </>
        )}
        <form onSubmit={handleSearch} className="relative">
          <input
            className="w-full md:w-40 lg:w-60 px-4 py-2 rounded-full text-sm focus:w-64 focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
            type="text"
            placeholder="Search Campus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute top-3 right-3 text-gray-400">
            <FaSearch />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
