import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="bg-cream text-center min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-4xl font-bold">Unauthorized</h1>
        <p className="mt-4">You are not authorized to access this page.</p>
        <Link to="/" className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;