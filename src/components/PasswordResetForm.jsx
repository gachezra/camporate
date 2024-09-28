import React, { useState } from 'react';
import axios from 'axios';
import { changePasswordRoute } from '../utils/APIRoutes';

const PasswordResetForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(changePasswordRoute, { email });
      console.log(response.data)
      setMessage('If the email is registered, a reset link will be sent.');
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-cream rounded-lg p-5 w-80">
        <h2 className="text-brown text-center mb-5 text-2xl font-bold">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-light-brown mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <button
            type="submit"
            className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded mb-2 transition-colors duration-300"
          >
            Send Reset Link
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-light-brown-dark text-cream border border-brown hover:bg-cream hover:text-light-brown-dark hover:border-brown py-2 px-4 rounded transition-colors duration-300"
          >
            Close
          </button>
        </form>
        {message && <p className="mt-4 text-center text-brown">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordResetForm;
