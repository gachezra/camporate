import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutUsPage = () => {
  return (
    <div className="bg-cream min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow flex flex-col items-center p-6">
        <div className="max-w-3xl text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brown mb-4">About Us</h1>
          <p className="text-light-brown text-lg mb-6">
            Welcome to VarsityRank, your comprehensive guide to universities in Kenya.
          </p>
        </div>
        <div className="w-full max-w-3xl">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-brown mb-4">Our Mission</h2>
            <p className="text-light-brown mb-4">
              At VarsityRank, we're committed to empowering prospective students with detailed, 
              accurate information about Kenyan universities. Our goal is to help you make informed 
              decisions about your higher education journey.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-brown mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-light-brown">
              <li>Comprehensive profiles of universities across Kenya</li>
              <li>Detailed information on academic programs and faculty</li>
              <li>Insights into campus life and living standards</li>
              <li>Estimated daily cost of living for each university</li>
              <li>Authentic reviews from current and former students</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-brown mb-4">Our Commitment</h2>
            <p className="text-light-brown mb-4">
              We strive to provide the most up-to-date and accurate information possible. 
              Our team works diligently to collect, verify, and present data that will be 
              most useful to you in your university selection process.
            </p>
            <p className="text-light-brown">
              Join us in our mission to make higher education choices in Kenya more 
              transparent and accessible for all.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUsPage;