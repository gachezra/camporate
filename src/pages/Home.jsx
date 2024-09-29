import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import UniversityCard from '../components/UniversityCard';
import ReviewForm from '../components/ReviewForm';
import axios from 'axios';
import Lottie from 'lottie-react';
import animationData from '../assets/book loading.json';
import { getUniversityDetails } from '../utils/APIRoutes';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(getUniversityDetails);
        const { universities } = response.data;

        if (Array.isArray(universities)) {
          setUniversities(universities);
          setFilteredUniversities(universities);
        } else {
          throw new Error('Unexpected universities format');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching universities:', error);
        setUniversities([]);
        setFilteredUniversities([]);
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    if (universities.length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const searchTerm = searchParams.get('search')?.toLowerCase() || '';

      const filtered = universities.filter(
        (university) =>
          university.name.toLowerCase().includes(searchTerm) ||
          university.description.toLowerCase().includes(searchTerm)
      );

      setFilteredUniversities(filtered);
    }
  }, [location.search, universities]);

  const handleReviewClick = (university) => {
    setSelectedUniversity(university);
    setIsReviewFormOpen(true);
  };

  return (
    <div className="bg-cream min-h-screen flex flex-col justify-between">
      <Header />
      <main className="flex-grow">
        <section className="text-center p-6">
          <h1 className="text-brown text-xl font-bold mb-3">Discover Your Ideal Campus</h1>
          <p className="text-light-brown mb-6">Browse university reviews, ratings, and find the perfect match for your educational journey.</p>
        </section>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Lottie animationData={animationData} />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6 px-4">
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((university) => (
                <Link key={university._id} to={`campus/${university._id}`}>
                  <UniversityCard university={university} onReviewClick={handleReviewClick} />
                </Link>
              ))
            ) : (
              <p className="text-center text-light-brown">No universities available at the moment.</p>
            )}
          </div>
        )}
      </main>

      {isReviewFormOpen && (
        <React.Suspense fallback={<div>Loading...</div>}>
          <ReviewForm university={selectedUniversity} onClose={() => setIsReviewFormOpen(false)} />
        </React.Suspense>
      )}
      <Footer />
    </div>
  );
};

export default Home;
