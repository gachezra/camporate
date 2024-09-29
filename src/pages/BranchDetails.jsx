import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getBranchRoute, reviewRoute } from '../utils/APIRoutes';
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar, FaUniversity, FaMoneyBillAlt, FaBuilding, FaUsers, FaChevronDown
} from 'react-icons/fa';
import Lottie from 'lottie-react';
import animationData from '../assets/book loading.json';
import { MdOutlineRateReview } from "react-icons/md";
import { TfiWrite } from "react-icons/tfi";
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReviewForm from '../components/ReviewForm';

const BranchDetails = () => {
  const { branchId, universityId } = useParams();
  const userId = localStorage.getItem('uid');

  const [branch, setBranch] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState('All');

  const fetchBranchDetails = useCallback(async () => {
    try {
      const [branchResponse, reviewsResponse] = await Promise.all([
        axios.get(getBranchRoute(branchId)),
        axios.get(reviewRoute(universityId, branchId))
      ]);

      setBranch(branchResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching branch details:', error);
      setError('Failed to fetch branch details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [branchId, universityId]);

  useEffect(() => {
    fetchBranchDetails();
  }, [fetchBranchDetails]);

  useEffect(() => {
    if (selectedRating === 'All') {
      setFilteredReviews(reviews);
    } else {
      const ratingValue = parseInt(selectedRating);
      setFilteredReviews(reviews.filter(review => review.overall_rating >= ratingValue));
    }
  }, [selectedRating, reviews]);

  const handleWriteReview = () => setIsReviewFormOpen(true);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <Lottie
        animationData={animationData}
      />
  </div>;
  }

  if (error) return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">{error}</div>;

  if (!branch) return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">Branch not found</div>;

  const isStudent = branch.students?.includes(userId);

  return (
    <div className="bg-cream min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-brown text-center text-2xl font-extrabold mb-6">{branch.name}</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-brown mb-4">Branch Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
              <p className="flex items-center"><FaMapMarkerAlt className="text-brown mr-2" />{branch.location}</p>
              <p className="flex items-center"><FaPhone className="text-brown mr-2" />{branch.phone}</p>
              <p className="flex items-center"><FaEnvelope className="text-brown mr-2" />
                <a href={`mailto:${branch.email}`} className="text-blue-500 underline">{branch.email}</a>
              </p>
            </div>
            <div className="flex flex-col space-y-4">
              <p className="flex items-center"><FaStar className="text-yellow-500 mr-2" />Overall Rating: {branch.overall_rating?.toFixed(1)}/10</p>
              <p>{branch.description}</p>
            </div>
          </div>
        </div>

        {/* Additional Branch Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-brown mb-4">Branch Ratings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <p className="flex items-center"><FaUniversity className="text-brown mr-2" />Academic Rating: {branch.academic_rating?.toFixed(1)}/10</p>
            <p className="flex items-center"><FaBuilding className="text-brown mr-2" />Facilities Rating: {branch.facilities_rating?.toFixed(1)}/10</p>
            <p className="flex items-center"><FaUsers className="text-brown mr-2" />Social Life Rating: {branch.social_life_rating?.toFixed(1)}/10</p>
            <p className="flex items-center"><FaStar className="text-yellow-500 mr-2" />Career Prospects Rating: {branch.career_prospects_rating?.toFixed(1)}/10</p>
            <p className="flex items-center"><FaMoneyBillAlt className="text-brown mr-2" />Cost of Living: Ksh. {branch.cost_of_living} per day</p>
          </div>
        </div>

        {/* Programs Offered */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-brown mb-4">Programs Offered</h2>
          {branch.programs_offered?.length > 0 ? (
            <ul className="list-disc pl-6 text-brown">
              {branch.programs_offered.map((program, index) => (
                <li key={index}>{program}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700">No programs available for this branch.</p>
          )}
        </div>

        {/* Image Gallery */}
        {branch.image_gallery?.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold text-brown mb-4">Image Gallery</h2>
            <div className="flex space-x-4 overflow-x-auto">
              {branch.image_gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-40 h-40 object-cover rounded flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}


        {isReviewFormOpen && (
          <ReviewForm
            universityId={universityId}
            branchId={branchId}
            onClose={() => setIsReviewFormOpen(false)}
          />
        )}

        <div className='flex justify-between my-8'>
          {isStudent && (
            <>
              <button
              onClick={handleWriteReview}
              className="bg-brown text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-light-brown transition duration-300 flex items-center"
              >
              <TfiWrite size={15} title='Write a review' className="mr-2" />
              Write a Review
              </button>

              <Link to='/forums'>
                <button
                    className="bg-brown text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:bg-light-brown transition duration-300 flex items-center"
                >
                    <MdOutlineRateReview size={15} title='Find forums' className="mr-2" />
                    Find Forums
                </button>
              </Link>
            </>
          )}
        </div>


        {/* Review Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-brown">Reviews</h2>
          <div className="relative flex items-center space-x-2">
            <label htmlFor="ratingFilter" className="text-brown font-medium">Filter by Rating:</label>
            <div className="relative">
              <select
                id="ratingFilter"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-brown rounded-md py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-brown focus:border-transparent cursor-pointer transition duration-200 ease-in-out"
              >
                <option value="All">All</option>
                {[...Array(10).keys()].map(i => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-3 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
            <div key={index} className="p-5 bg-white rounded-lg shadow-lg border border-gray-200">
                {/* Header with overall rating, date, and username */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <p className="font-bold text-lg sm:text-xl text-brown">
                    Overall Rating: ⭐ {review.overall_rating?.toFixed(1)}/10
                    </p>
                    <div className="text-sm text-gray-500 space-y-1 sm:space-y-0 sm:ml-4">
                    <p>Posted on: {new Date(review.date).toLocaleDateString()}</p>
                    <p>By: {review.user_id.username}</p>
                    </div>
                </div>

                {/* Ratings section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p><strong>Academic:</strong> ⭐ {review.academic_rating.toFixed(1)}/10</p>
                    <p><strong>Facilities:</strong> ⭐ {review.facilities_rating.toFixed(1)}/10</p>
                    <p><strong>Social Life:</strong> ⭐ {review.social_life_rating.toFixed(1)}/10</p>
                    <p><strong>Career Prospects:</strong> ⭐ {review.career_prospects_rating.toFixed(1)}/10</p>
                    <p><strong>Cost of Living:</strong>Ksh.{review.cost_of_living} per day</p>
                </div>

                {/* Review comment */}
                <p className="mt-4 text-base sm:text-lg text-brown">{review.comment}</p>

                {/* response */}
                {review.responses && (
                  <div>
                    <p className='mb-3 text-lg mt-4 font-bold'>Response</p>
                    <p className="text-gray-700">By admin.</p>
                    <p className="text-gray-700">{review.responses[0].response}</p>
                  </div>
                )}
            </div>

            ))
          ) : (
            <p className="text-center text-gray-700">No reviews available.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BranchDetails;
