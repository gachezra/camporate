import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { verifyEmailRoute } from '../utils/APIRoutes';
import LoginForm from '../components/LoginForm';

const EmailVerify = () => {
  const { verificationToken } = useParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoginFormOpen,setIsLoginFormOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`${verifyEmailRoute}/${verificationToken}`);
        if (response.data.success) {
          setIsVerified(true);
        } else {
          setError('Verification failed. Please try again.');
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
    <div className="flex items-center justify-center min-h-screen bg-[#ebcfb2] text-brown">
      {isVerifying ? (
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-light-brown h-24 w-24 mb-4"></div>
          <p>Verifying your email...</p>
        </div>
      ) : isVerified ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4">Email Verified Successfully!</h2>
          <p className="mb-4">Your email has been verified. You can now log in.</p>
          <button
            onClick={handleLoginRedirect}
            className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
          >
            Go to Login
          </button>
          {isLoginFormOpen && <LoginForm onClose={() => {setIsLoginFormOpen(false)}}/> }
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Verification Failed</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={handleLoginRedirect}
            className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded transition-colors duration-300"
          >
            Go to Login
          </button>
          {isLoginFormOpen && <LoginForm onClose={() => {setIsLoginFormOpen(false)}}/> }
        </div>
      )}
    </div>
  );
};

export default EmailVerify;
