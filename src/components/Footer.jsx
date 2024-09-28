import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#ebcfb2] py-4 text-center">
      <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
        <a href="/about" className="text-gray-700 hover:text-c3a287">About Us</a>
        <a href="/contact" className="text-gray-700 hover:text-c3a287">Contact</a>
        <a href="/privacy" className="text-gray-700 hover:text-c3a287">Privacy Policy</a>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="text-gray-700 hover:text-c3a287"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          className="text-gray-700 hover:text-c3a287"
        >
          <FaTwitter />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-gray-700 hover:text-c3a287"
        >
          <FaInstagram />
        </a>
      </div>
    </footer>
  );
};

export default Footer;