import React, { useState } from 'react';
import { loginRoute } from '../utils/APIRoutes';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginForm = ({ onClose, passwordReset, onLogin }) => {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(loginRoute, {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('uid', response.data.id);
      localStorage.setItem('isAvatarSet', response.data.avatar);
      onLogin();
      onClose();
    } catch (error) {
      setError(error.response.data.error);
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-cream rounded-lg p-6 w-full max-w-md mx-4 md:mx-auto shadow-lg relative">
        <h2 className="text-brown text-center mb-4 text-3xl font-bold">Login</h2>
        {error && (
          <p className="text-center my-2 bg-light-brown text-cream py-2 rounded">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-light-brown font-semibold">
            Email or Username:
            <input
              type="text"
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
          <p
            className="text-brown font-bold hover:text-light-brown cursor-pointer text-center mt-3"
            onClick={() => {
              onClose();
              passwordReset();
            }}
          >
            Forgot Password?
          </p>
          <p
            className="text-brown font-bold hover:text-light-brown cursor-pointer text-center"
            onClick={onClose}
          >
            <Link to="/admin-login">Admin?</Link>
          </p>
          <button
            type="submit"
            className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
          >
            Login
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

export default LoginForm;