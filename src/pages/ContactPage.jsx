import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { sendMessageRoute } from '../utils/APIRoutes';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(sendMessageRoute, formData);
      setNotification({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Error sending message. Please try again.' });
    }
  };

  return (
    <div className="bg-cream min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow flex flex-col items-center p-6">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-brown mb-4">Get in Touch</h1>
          <p className="text-light-brown text-lg md:text-xl">
            We're here to listen, assist, and collaborate. Whether you have a question, feedback, or a brilliant idea, 
            we're just a message away. Let's start a conversation and make great things happen together!
          </p>
        </div>
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 justify-center">
          <div className="lg:w-2/3">
            <h2 className="text-brown text-2xl font-bold mb-4">Contact Us</h2>
            {notification && (
              <div className={`mb-4 p-2 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {notification.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-light-brown mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-light-brown rounded"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-light-brown mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-light-brown rounded"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-light-brown mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-light-brown rounded"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-light-brown mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-2 border border-light-brown rounded"
                ></textarea>
              </div>
              <button type="submit" className="bg-brown text-white px-6 py-2 rounded hover:bg-light-brown transition duration-300">
                Send Message
              </button>
            </form>
          </div>
          <div className="lg:w-1/3 flex flex-col">
            <div className="mb-8">
              <h2 className="text-brown text-2xl font-bold mb-4">Connect With Us</h2>
              <div className="flex space-x-6 mb-6">
                <a href="facebook.com/#" className="text-brown hover:text-light-brown transition duration-300"><FaFacebookF size={28} /></a>
                <a href="x.com/#" className="text-brown hover:text-light-brown transition duration-300"><FaXTwitter size={28} /></a>
                <a href="instagram.com/#" className="text-brown hover:text-light-brown transition duration-300"><FaInstagram size={28} /></a>
                <a href="linkedin.com/#" className="text-brown hover:text-light-brown transition duration-300"><FaLinkedinIn size={28} /></a>
              </div>
              <div className="flex items-center mb-4">
                <a href="tel:+254727684727" className="flex items-center text-brown hover:text-light-brown transition duration-300">
                  <FaPhone className="mr-3" size={20} />
                  <span>+254727684727</span>
                </a>
              </div>
              <div className="flex items-center">
                <a href="mailto:info@pexmon.one" className="flex items-center text-brown hover:text-light-brown transition duration-300">
                  <FaEnvelope className="mr-3" size={20} />
                  <span>info@pexmon.one</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;