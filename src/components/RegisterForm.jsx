import React, { useState } from 'react';
import { registerRoute } from '../utils/APIRoutes';
import axios from 'axios';

const RegisterForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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

      console.log(response)

      // onClose();
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-cream rounded-lg p-5 w-80">
        <h2 className="text-brown text-center mb-5 text-2xl font-bold">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="text-light-brown mb-1">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-light-brown mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-light-brown mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-light-brown mb-1">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <button
            type="submit"
            className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded mb-2 transition-colors duration-300"
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
