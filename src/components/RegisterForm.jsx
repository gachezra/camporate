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
  const [notification, setNotification] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match"); 
      return;
    }
    try {
      const response = await axios.post(registerRoute, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setNotification(response.data.message);

    } catch (error) {
      console.error('Error registering:', error);
      setNotification(error.response.data.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-cream rounded-lg p-6 w-full max-w-md mx-4 md:mx-auto shadow-lg relative">
        <h2 className="text-brown text-center mb-4 text-3xl font-bold">Register</h2>
        {notification && (
          <p className="text-center my-2 bg-light-brown text-cream py-2 rounded">
            {notification}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-light-brown font-semibold">
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-light-brown rounded focus:outline-none focus:ring-2 focus:ring-light-brown"
            />
          </label>
          <label className="text-light-brown font-semibold">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-light-brown rounded focus:outline-none focus:ring-2 focus:ring-light-brown"
            />
          </label>
          <label className="text-light-brown font-semibold">
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-light-brown rounded focus:outline-none focus:ring-2 focus:ring-light-brown"
            />
          </label>
          <label className="text-light-brown font-semibold">
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-light-brown rounded focus:outline-none focus:ring-2 focus:ring-light-brown"
            />
          </label>
          <button
            type="submit"
            className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
          >
            Register
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-light-brown-dark text-cream border border-brown hover:bg-cream hover:text-light-brown-dark hover:border-brown py-2 px-4 rounded transition-colors duration-300"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
