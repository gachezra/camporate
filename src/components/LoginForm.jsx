import React, { useState } from 'react';
import { loginRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginForm = ({ onClose, passwordReset, onLogin }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(loginRoute, {
        email: formData.email,
        password: formData.password,
      });
      
      // Store user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('uid', response.data.id);
      localStorage.setItem('isAvatarSet', response.data.avatar || false);
      
      // Trigger the login event
      if (onLogin) onLogin();
      onClose();
      
    } catch (error) {
      console.error('Error logging in:', error);
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-cream rounded-lg p-6 w-full max-w-md mx-4 md:mx-auto shadow-lg relative my-8">
        <h2 className="text-brown text-center mb-4 text-3xl font-bold">Login</h2>
        
        {error && (
          <div className="text-center my-3 py-2 px-3 rounded-md bg-red-100 text-red-700 border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-light-brown font-semibold block">
              Email or Username
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown"
              placeholder="Enter your email or username"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-light-brown font-semibold block">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <button
              type="button"
              className="text-brown font-medium hover:text-light-brown transition-colors"
              onClick={() => {
                onClose();
                if (passwordReset) passwordReset();
              }}
            >
              Forgot Password?
            </button>
            
            <Link 
              to="/admin-login" 
              className="text-brown font-medium hover:text-light-brown transition-colors"
              onClick={onClose}
            >
              Admin Login
            </Link>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-light-brown text-cream border border-light-brown-dark rounded-md py-2.5 px-4 font-medium transition-colors duration-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cream hover:text-light-brown hover:border-light-brown-dark'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-light-brown-dark text-cream border border-brown rounded-md py-2.5 px-4 font-medium transition-colors duration-300 hover:bg-cream hover:text-light-brown-dark hover:border-brown"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;