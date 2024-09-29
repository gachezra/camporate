import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-cream min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow flex flex-col items-center p-6">
        <div className="max-w-3xl text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-brown mb-4">Privacy Policy</h1>
          <p className="text-light-brown text-lg mb-6">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
          </p>
        </div>
        <div className="w-full max-w-3xl">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-brown mb-4">Information We Collect</h2>
            <p className="text-light-brown mb-4">
              We collect information about universities in Kenya, including academic programs, 
              living standards, and costs of living. We also collect reviews from students.
            </p>
            <p className="text-light-brown mb-4">
              When you use our site, we may collect:
            </p>
            <ul className="list-disc list-inside text-light-brown mb-4">
              <li>Personal information (e.g., name, email) if you choose to provide it</li>
              <li>Usage data (e.g., pages visited, time spent on site)</li>
              <li>Reviews and ratings you submit about universities</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-brown mb-4">How We Use Your Information</h2>
            <p className="text-light-brown mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-light-brown mb-4">
              <li>Provide and improve our services</li>
              <li>Respond to your inquiries</li>
              <li>Analyze site usage to enhance user experience</li>
              <li>Display user-submitted reviews (anonymously unless you choose otherwise)</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-brown mb-4">Data Protection</h2>
            <p className="text-light-brown mb-4">
              We implement various security measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-brown mb-4">Your Rights</h2>
            <p className="text-light-brown mb-4">
              You have the right to access, correct, or delete your personal information. 
              To exercise these rights, please contact us at info@pexmon.one.
            </p>
            <p className="text-light-brown">
              By using our site, you consent to our privacy policy. We may update this policy 
              periodically, and we encourage you to review it regularly.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;