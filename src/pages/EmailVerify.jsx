import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { verifyEmailRoute } from '../utils/APIRoutes';
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';
import Footer from '../components/Footer';

const EmailVerify = () => {
  const { verificationToken } = useParams();
  const token = localStorage.getItem('token');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`${verifyEmailRoute}/${verificationToken}`);
        console.log('Response: ',response.data.success)
        if (response.data.success) {
          setIsVerified(true);
          setNotification(response.data.message)
        } else {
          setError(response.data.error);
        }
      } catch (err) {
        setError('An error occurred during verification. Please try again later.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [verificationToken]);

  const handleLoginRedirect = () => {
    setIsLoginFormOpen(true);
  };

  return (
    <>
    <Header/>
    <div className="flex items-center justify-center min-h-screen bg-[#ebcfb2] text-brown">
      {isVerifying ? (
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-light-brown h-24 w-24 mb-4"></div>
          <p>Verifying your email...</p>
        </div>
      ) : isVerified ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Email Verified Successfully!</h2>
          <p className="mb-4">{notification}</p>
          {token ? (
            <Link
              to="/profile"
              className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
            >
              Go to Profile
            </Link>
          ) : (
            <>
              <button
                onClick={handleLoginRedirect}
                className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
              >
                Go to Login
              </button>
              {isLoginFormOpen && <LoginForm onClose={() => setIsLoginFormOpen(false)} />}
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Verification Failed</h2>
          <p className="mb-4">{error}</p>
          {token ? (
            <Link
              to="/profile"
              className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
            >
              Go to Profile
            </Link>
          ) : (
            <>
              <button
                onClick={handleLoginRedirect}
                className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
              >
                Go to Login
              </button>
              {isLoginFormOpen && <LoginForm onClose={() => setIsLoginFormOpen(false)} />}
            </>
          )}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default EmailVerify;
