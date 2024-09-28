import React, { useState, useEffect } from 'react';
import UniversityCard from '../components/UniversityCard';
import ReviewForm from '../components/ReviewForm';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getUniversityDetails } from '../utils/APIRoutes';

const Home = () => {
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universities, setUniversities] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(getUniversityDetails);
        
        // Extract the universities array from the response
        const { universities } = response.data;

        if (Array.isArray(universities)) {
          setUniversities(universities);
        } else {
          console.error('Unexpected universities format:', universities);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleReviewClick = (university) => {
    setSelectedUniversity(university);
    setIsReviewFormOpen(true);
  };

  return (
    <div className="bg-cream p-5">
      <h1 className="text-brown text-center mb-5 text-3xl font-bold">Campus Reviews</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {universities.length > 0 ? (
          universities.map((university) => (
            <Link key={university._id} to={`campus/${university._id}`}>
              <UniversityCard 
                university={university}
                onReviewClick={handleReviewClick}
              />
            </Link>
          ))
        ) : (
          <p className="text-center text-light-brown">No universities available at the moment.</p>
        )}
      </div>
      {isReviewFormOpen && (
        <ReviewForm
          university={selectedUniversity}
          onClose={() => setIsReviewFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
