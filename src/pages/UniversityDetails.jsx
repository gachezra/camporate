import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getUniversityDetails, reviewRoute } from '../utils/APIRoutes';

const UniversityDetails = () => {
  const { universityId } = useParams();
  const [university, setUniversity] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        const universityResponse = await axios.get(`${getUniversityDetails}/${universityId}`);
        console.log(universityResponse.data)
        setUniversity(universityResponse.data);

        // Fetch reviews specifically for this university
        const reviewsResponse = await axios.get(`${reviewRoute}/${universityId}`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching university details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityDetails();
  }, [universityId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!university) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">University not found</div>;
  }

  return (
    <div className="p-6 bg-cream min-h-screen">
      <h1 className="text-brown text-center text-4xl font-extrabold mb-8">{university.name}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-brown mb-4">University Information</h2>
        <p className="text-lg mb-2"><strong>Location:</strong> {university.location}</p>
        <p className="text-lg mb-2"><strong>Programs Offered:</strong> {university.programs_offered.join(', ')}</p>
        <p className="text-lg mb-2"><strong>Website:</strong> <a href={university.website} className="text-blue-500 underline">{university.website}</a></p>
        <p className="text-lg mb-2"><strong>Description:</strong> {university.description}</p>
        <p className="text-lg mb-2"><strong>Overall Rating:</strong> {university.overall_rating}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-brown mb-4">Reviews</h2>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index} className="mb-6 p-5 bg-white rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-xl text-brown">Overall Rating: {review.overall_rating}</p>
                  <p className="text-sm text-gray-500">By: {review.user_id.username}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Academic:</strong> {review.academic_rating}</p>
                  <p><strong>Facilities:</strong> {review.facilities_rating}</p>
                  <p><strong>Social Life:</strong> {review.social_life_rating}</p>
                  <p><strong>Career Prospects:</strong> {review.career_prospects_rating}</p>
                  <p><strong>Cost of Living:</strong> {review.cost_of_living}</p>
                </div>
                <p className="mt-4 text-lg">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-700">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default UniversityDetails;
