import React, { useState } from 'react';
import axios from 'axios';
import { changePasswordRoute } from '../utils/APIRoutes';

const PasswordResetForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ message: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus({ message: 'Please enter a valid email address', isError: true });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(changePasswordRoute, { email });
      console.log(response.data);
      setStatus({ 
        message: 'If the email is registered, a reset link will be sent.', 
        isError: false 
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      // We don't want to reveal if an email exists in the system or not
      setStatus({ 
        message: 'If the email is registered, a reset link will be sent.', 
        isError: false 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-cream rounded-lg p-6 w-full max-w-md mx-4 md:mx-auto shadow-lg relative my-8">
        <h2 className="text-brown text-center mb-4 text-2xl font-bold">Reset Password</h2>
        
        {status.message && (
          <div className={`text-center my-3 py-2 px-3 rounded-md ${
            status.isError 
              ? 'bg-red-100 text-red-700 border border-red-200' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {status.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1">
            <label className="text-light-brown font-semibold block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown"
              placeholder="Enter your email address"
            />
          </div>
          
          <p className="text-sm text-gray-600 mt-1">
            We'll send a password reset link to this email if it exists in our system.
          </p>
          
          <div className="flex flex-col md:flex-row gap-3 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 bg-light-brown text-cream border border-light-brown-dark rounded-md py-2.5 px-4 font-medium transition-colors duration-300 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-cream hover:text-light-brown hover:border-light-brown-dark'
              }`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
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

export default PasswordResetForm;