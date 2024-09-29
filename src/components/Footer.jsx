import React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#ebcfb2] py-6 text-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:justify-between md:space-x-6">
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-6">
            <Link to="/about" className="text-brown hover:text-dark-brown transition duration-300">About Us</Link>
            <Link to="/contact" className="text-brown hover:text-dark-brown transition duration-300">Contact</Link>
            <Link to="/privacy" className="text-brown hover:text-dark-brown transition duration-300">Privacy Policy</Link>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-brown hover:text-dark-brown transition duration-300"
            >
              <FaFacebookF size={15} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-brown hover:text-dark-brown transition duration-300"
            >
              <FaXTwitter size={15} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-brown hover:text-dark-brown transition duration-300"
            >
              <FaInstagram size={15} />
            </a>
          </div>
        </div>
        <div className="mt-4 text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} VarsityRank. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
