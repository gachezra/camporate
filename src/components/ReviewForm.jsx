import React, { useState, useEffect } from 'react';
import { reviewRoute, getUniversityDetails } from '../utils/APIRoutes';
import axios from 'axios';

const ReviewForm = ({ universityId, onClose, onReviewAdded }) => {
  const [university, setUniversity] = useState(null);
  const [notification, setNotification] = useState('');
  const [formData, setFormData] = useState({
    userId: localStorage.getItem('uid'),
    overall_rating: 5,
    academic_rating: 5,
    facilities_rating: 5,
    social_life_rating: 5,
    career_prospects_rating: 5,
    cost_of_living: 5,
    comment: '',
  });

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        const response = await axios.get(`${getUniversityDetails}/${universityId}`);
        setUniversity(response.data);
      } catch (error) {
        console.error('Error fetching university details:', error);
        setNotification('Error fetching university details');
      }
    };

    fetchUniversityDetails();
  }, [universityId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${reviewRoute}/${universityId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotification('Review added successfully!');
      // onReviewAdded();
      setTimeout(() => {
        onClose();
      }, 2000); // Close the form after 2 seconds
    } catch (error) {
      console.error('Error submitting review:', error);
      setNotification('Error submitting review. Please try again.');
    }
  };

  if (!university) return <div>Loading...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-cream rounded-lg p-6 w-11/12 max-w-md mx-auto md:w-96">
        <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">Review {university.name}</h2>
        {notification && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col">
        <label className="text-sm text-light-brown mb-1">Overall Rating:</label>
          <input
            type="number"
            name="overall_rating"
            min="1"
            max="5"
            value={formData.overall_rating}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-sm text-light-brown mb-1">Academic Rating:</label>
          <input
            type="number"
            name="academic_rating"
            min="1"
            max="5"
            value={formData.academic_rating}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-sm text-light-brown mb-1">Facilities Rating:</label>
          <input
            type="number"
            name="facilities_rating"
            min="1"
            max="5"
            value={formData.facilities_rating}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-sm text-light-brown mb-1">Social Life Rating:</label>
          <input
            type="number"
            name="social_life_rating"
            min="1"
            max="5"
            value={formData.social_life_rating}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-sm text-light-brown mb-1">Career Prospects Rating:</label>
          <input
            type="number"
            name="career_prospects_rating"
            min="1"
            max="5"
            value={formData.career_prospects_rating}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-sm text-light-brown mb-1">Cost of Living:</label>
          <input
            type="number"
            name="cost_of_living"
            min="1"
            max="5"
            value={formData.cost_of_living}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <label className="text-sm text-light-brown mb-1">Comment:</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            className="border border-light-brown rounded p-2 mb-4"
          />
          <button
            type="submit"
            className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded mb-2 transition-colors duration-300"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-light-brown-dark text-cream border border-brown hover:bg-cream hover:text-light-brown-dark hover:border-brown py-2 px-4 rounded transition-colors duration-300"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
