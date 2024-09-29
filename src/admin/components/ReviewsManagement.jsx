import axios from 'axios';
import React, { useCallback, useState, useEffect } from 'react';
import { reviewRoute, getUserProfileRoute, responseRoute } from '../../utils/APIRoutes';
import { MdSend } from 'react-icons/md'; // Added React Icons for a better UI

const ReviewsManagement = ({ userId }) => {
  const [reviews, setReviews] = useState([]);
  const [activeRespondReviewId, setActiveRespondReviewId] = useState(null); // Tracks which review is open for response

  const fetchUniBranch = useCallback(async (userId) => {
    const res = await axios.get(`${getUserProfileRoute}/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const universityId = res.data.universities[0].university;
    const branchId = res.data.universities[0].branch;

    return { uni: universityId, branch: branchId };
  }, []);

  const fetchReviews = useCallback(async (universityId, branchId) => {
    const response = await axios.get(reviewRoute(universityId, branchId));
    return response.data;
  }, []);

  useEffect(() => {
    fetchUniBranch(userId).then(async ({ uni: universityId, branch: branchId }) => {
      const res = await fetchReviews(universityId, branchId);
      setReviews(res);
    });
  }, [fetchReviews, fetchUniBranch, userId]);

  const RespondForm = ({ reviewId, onSubmit }) => {
    const [respondContent, setRespondContent] = useState('');

    const handleRespond = async () => {
      try {
        await axios.post(responseRoute, {
          userId,
          reviewId,
          response: respondContent,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setRespondContent('');
        onSubmit(); // Refreshes the reviews list
        setActiveRespondReviewId(null); // Closes the form after submitting
      } catch (error) {
        console.error('Error responding:', error);
      }
    };

    return (
      <div className="mt-4">
        <div className="relative">
          <textarea
            value={respondContent}
            onChange={(e) => setRespondContent(e.target.value)}
            placeholder="Respond to this review"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-light"
          />
          <button
            onClick={handleRespond}
            className="absolute right-3 top-3 bg-brown text-white p-2 rounded-full hover:bg-brown-light flex items-center justify-center"
          >
            <MdSend />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-cream p-8 rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Manage Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews available.</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li key={review._id} className="p-6 bg-white border border-light-brown rounded-lg shadow-sm">
              <p className="font-bold text-lg">{review.user_id.username}</p>
              <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <p><strong>Academic:</strong> ⭐ {review.academic_rating.toFixed(1)}/10</p>
                <p><strong>Facilities:</strong> ⭐ {review.facilities_rating.toFixed(1)}/10</p>
                <p><strong>Social Life:</strong> ⭐ {review.social_life_rating.toFixed(1)}/10</p>
                <p><strong>Career Prospects:</strong> ⭐ {review.career_prospects_rating.toFixed(1)}/10</p>
                <p><strong>Cost of Living:</strong> Ksh.{review.cost_of_living} per day</p>
              </div>
              <p className="mt-4 text-gray-700">{review.comment}</p>
              {review.responses && (
                <div>
                  <p className='my-3 font-bold'>Response</p>
                  <p className="text-gray-700">{review.responses.user_id}</p>
                  <p className="text-gray-700">{review.responses[0].response}</p>
                </div>
              )}
              <div className="mt-4">
                <button
                  onClick={() => setActiveRespondReviewId(review._id)}
                  className={`px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown transition-colors ${
                    activeRespondReviewId === review.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={activeRespondReviewId === review._id} // Disable button if the form is already open
                >
                  Respond
                </button>
              </div>
              {activeRespondReviewId === review._id && (
                <RespondForm
                  reviewId={review._id}
                  onSubmit={() => fetchUniBranch(userId).then(({ uni, branch }) => fetchReviews(uni, branch).then(setReviews))} // Refresh reviews after response
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsManagement;
