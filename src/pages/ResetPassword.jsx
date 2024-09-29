import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { passwordResetRoute } from '../utils/APIRoutes';
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsResetting(true);
    setError(null);

    try {
      const response = await axios.post(passwordResetRoute(resetToken), {
        newPassword: formData.password,
      });

      console.log(response);
      if (response.status === 200) {
        setIsSuccess(true);
      } else {
        setError('Password reset failed. Please try again.');
      }
    } catch (err) {
      setError(err.response.data.error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLoginRedirect = () => {
    setIsLoginFormOpen(true);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#ebcfb2] text-brown">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-cream rounded-lg p-5 w-80">
            {isSuccess ? (
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4">Password Reset Successfully!</h2>
                <p className="mb-4">Your password has been reset. You can now log in.</p>
                <button
                  onClick={handleLoginRedirect}
                  className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
                >
                  Login
                </button>
                {isLoginFormOpen && <LoginForm onClose={() => setIsLoginFormOpen(false)} />}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col">
                <h2 className="text-2xl font-bold mb-5 text-center">Reset Password</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <label className="text-light-brown mb-1">New Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="border border-light-brown rounded p-2 mb-4"
                />
                <label className="text-light-brown mb-1">Confirm New Password:</label>
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
                  disabled={isResetting}
                  className={`${
                    isResetting ? 'bg-gray-400 cursor-not-allowed' : 'bg-light-brown'
                  } text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300`}
                >
                  {isResetting ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ResetPassword;
