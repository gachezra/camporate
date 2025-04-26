import React, { useState } from 'react';
import { loginRoute, registerRoute } from '../../utils/APIRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    if (isRegistering && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotification('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        const response = await axios.post(registerRoute, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'admin'
        });
        
        setNotification(response.data.message);
      } else {
        const response = await axios.post(loginRoute, {
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('uid', response.data.id);
        navigate('/admin');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred. Please try again.');
      console.error(`Error ${isRegistering ? 'registering' : 'logging in'}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (e) => {
    e.preventDefault();
    setIsRegistering(!isRegistering);
    setError('');
    setNotification('');
    setFormData({ email: '', password: '', confirmPassword: '', username: '' });
  };

  return (
    <div className="flex h-screen bg-cream items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-center text-3xl font-bold mb-6 text-brown">
          {isRegistering ? 'Admin Registration' : 'Admin Login'}
        </h1>
        
        {notification && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
            {notification}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-brown bg-opacity-10 text-brown rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-light-brown mb-1">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-light-brown" />
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors"
                  required={isRegistering}
                  placeholder="Enter your full name"
                  aria-label="Full Name"
                />
              </div>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-light-brown mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-light-brown" />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors"
                required
                placeholder="Enter your email"
                aria-label="Email"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-light-brown mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-light-brown" />
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors"
                required
                placeholder="Enter your password"
                aria-label="Password"
              />
            </div>
          </div>
          
          {isRegistering && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-brown mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-light-brown" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors"
                  required
                  placeholder="Confirm your password"
                  aria-label="Confirm Password"
                />
              </div>
            </div>
          )}
          
          <button
            type="submit"
            className={`w-full px-4 py-2 text-cream rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown transition-colors ${
              isLoading 
                ? 'bg-light-brown cursor-not-allowed opacity-50' 
                : 'bg-brown hover:bg-light-brown hover:text-cream border border-light-brown-dark hover:border-brown'
            }`}
            disabled={isLoading}
          >
            {isLoading 
              ? (isRegistering ? 'Registering...' : 'Logging in...') 
              : (isRegistering ? 'Register' : 'Login')}
          </button>
          
          <div className="text-center">
            <button
              onClick={toggleMode}
              className="text-light-brown hover:text-brown hover:underline text-sm transition-colors"
            >
              {isRegistering 
                ? 'Already have an account? Login' 
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;