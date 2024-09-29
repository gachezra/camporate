import React, { useState } from 'react';
import { loginRoute, registerRoute} from '../../utils/APIRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
//   const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform login or registration logic here
    if (isRegistering) {
      // Register the user
      if (password !== confirmPassword) {
        alert("Passwords don't match"); 
        return;
      }
      try {
        const response = await axios.post(registerRoute, {
            username: username,
            email: email,
            password: password,
            role: 'admin'
        });
        
        setNotification(response.data.message)
        setError('');
      } catch (error) {
        setNotification('');
        setError(error.response.data.error);
        console.error('Error registering:', error);
      }
    } else {
      // Login the user
      try {
        const response = await axios.post(loginRoute,{
            email: email,
            password: password
        })
        console.log(response.data)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('uid', response.data.id)
        console.log(`User Id: ${localStorage.getItem('uid')}, token: ${localStorage.getItem('token')}`)
        navigate('/admin')
      } catch (error) {
        setNotification('');
        setError(error.response.data.error)
      }
    }
  };

  return (
    <div className="flex h-screen bg-cream text-brown items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-4xl font-bold mb-6">
          {isRegistering ? 'Register' : 'Login'}
        </h1>
        <form onSubmit={handleSubmit}>
            <p className='text-center bg-blue-200 rounded-sm'>{notification}</p>
            <p className='text-center text-red-400'>{error}</p>
            {isRegistering && (
                <>
                {/* <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Full Name
                    </label>
                    <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={isRegistering}
                    />
                </div> */}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Full Name
                    </label>
                    <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={isRegistering}
                    />
                </div>
                </>
            )}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
                </label>
                <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {isRegistering && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <div className="text-sm my-2">
            {isRegistering ? (
              <p
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegistering(false);
                }}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Already have an account? Login
              </p>
            ) : (
              <p
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegistering(true);
                }}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Don't have an account? Register
              </p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;