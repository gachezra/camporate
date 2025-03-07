import React, { useState } from 'react';
import { loginRoute, registerRoute } from '../../utils/APIRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        // Register the user
        const response = await axios.post(registerRoute, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'admin'
        });
        
        setNotification(response.data.message);
      } else {
        // Login the user
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
  };

  return (
    <div className="flex h-screen bg-cream text-brown items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-center text-3xl font-bold mb-6 text-blue-600">
          {isRegistering ? 'Admin Registration' : 'Admin Login'}
        </h1>
        
        {notification && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
            {notification}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={isRegistering}
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {isRegistering && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
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
              className="text-blue-600 hover:underline text-sm"
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