import React, { useState } from 'react';
import { registerRoute } from '../utils/APIRoutes';
import axios from 'axios';

const RegisterForm = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [notification, setNotification] = useState({ message: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setNotification({ message: 'All fields are required', isError: true });
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: "Passwords don't match", isError: true });
      return false;
    }
    
    if (formData.password.length < 8) {
      setNotification({ message: "Password must be at least 8 characters", isError: true });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setNotification({ message: "Please enter a valid email address", isError: true });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(registerRoute, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setNotification({ message: response.data.message || 'Registration successful!', isError: false });
      
      // Call onRegister if provided (for any post-registration actions)
      if (onRegister) {
        setTimeout(() => {
          onRegister();
        }, 2000);
      }

    } catch (error) {
      console.error('Error registering:', error);
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setNotification({ message: errorMessage, isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-cream rounded-lg p-6 w-full max-w-md mx-4 md:mx-auto shadow-lg relative my-8">
        <h2 className="text-brown text-center mb-4 text-3xl font-bold">Register</h2>
        
        {notification.message && (
          <div className={`text-center my-3 py-2 px-3 rounded-md ${
            notification.isError 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {notification.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-light-brown font-semibold block">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-light-brown font-semibold block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown"
              placeholder="Enter your email"
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
              placeholder="Create a password (min. 8 characters)"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-light-brown font-semibold block">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown"
              placeholder="Confirm your password"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-light-brown text-cream border border-light-brown-dark rounded-md py-2.5 px-4 font-medium transition-colors duration-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cream hover:text-light-brown hover:border-light-brown-dark'
              }`}
            >
              {isLoading ? 'Registering...' : 'Register'}
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

export default RegisterForm;