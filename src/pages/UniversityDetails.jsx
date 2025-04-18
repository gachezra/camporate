import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import animationData from '../assets/book loading.json';
import { getUniversityDetails, getBranchesRoute } from '../utils/APIRoutes';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UniversityDetails = () => {
  const { universityId } = useParams();
  const [university, setUniversity] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const universityResponse = await axios.get(`${getUniversityDetails}/${universityId}`);
        setUniversity(universityResponse.data);

        const branchDetailsResponses = await axios.get(getBranchesRoute(universityId));
        setBranches(branchDetailsResponses.data);
      } catch (error) {
        console.error('Error fetching university details:', error);
        setError(error.response?.data?.message || 'Failed to load university details');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityDetails();
  }, [universityId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Lottie animationData={animationData} className="w-64 h-64" />
        <p className="mt-4 text-brown font-medium">Loading university details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
          <p className="font-bold">University not found</p>
          <p>The university you're looking for doesn't exist or has been removed.</p>
        </div>
        <Link to="/universities" className="mt-4 px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown">
          Browse All Universities
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <h1 className="text-brown text-center text-2xl font-extrabold mb-6">{university.name || 'University Details'}</h1>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-lg font-semibold text-brown mb-4 text-center">University Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="mb-2"><strong>Location:</strong> {university.location || 'Not specified'}</p>
              <p className="mb-2"><strong>Programs Offered:</strong> {
                university.programs_offered && university.programs_offered.length > 0 
                  ? university.programs_offered.join(', ') 
                  : 'No programs listed'
              }</p>
              <p className="mb-2"><strong>Website:</strong> {
                university.website 
                  ? <a href={university.website} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">{university.website}</a> 
                  : 'Not available'
              }</p>
              <p className="mb-2"><strong>Description:</strong> {university.description || 'No description available'}</p>
            </div>
            <div>
              {university.overall_rating !== undefined && (
                <p className="mb-2"><strong>Overall Rating:</strong> ⭐ {(university.overall_rating || 0).toFixed(1)}/10</p>
              )}
              {university.academic_rating !== undefined && (
                <p className="mb-2"><strong>Academic Rating:</strong> ⭐ {(university.academic_rating || 0).toFixed(1)}/10</p>
              )}
              {university.facilities_rating !== undefined && (
                <p className="mb-2"><strong>Facilities Rating:</strong> ⭐ {(university.facilities_rating || 0).toFixed(1)}/10</p>
              )}
              {university.social_life_rating !== undefined && (
                <p className="mb-2"><strong>Social Life Rating:</strong> ⭐ {(university.social_life_rating || 0).toFixed(1)}/10</p>
              )}
              {university.career_prospects_rating !== undefined && (
                <p className="mb-2"><strong>Career Prospects Rating:</strong> ⭐ {(university.career_prospects_rating || 0).toFixed(1)}/10</p>
              )}
              {university.cost_of_living !== undefined && (
                <p className="mb-2"><strong>Cost of Living:</strong> Ksh.{university.cost_of_living || 0} per day</p>
              )}
            </div>
          </div>

          {branches && branches.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-brown mb-2">Branches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                  <Link to={`${branch._id}`} key={branch._id} className="cursor-pointer">
                    <div className="bg-cream p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                      <h4 className="text-lg font-semibold text-brown mb-2">{branch.name || 'Branch'}</h4>
                      <p className="mb-1"><strong>Location:</strong> {branch.location || 'Not specified'}</p>
                      <p className="mb-1"><strong>Programs:</strong> {
                        branch.programs_offered && branch.programs_offered.length > 0 
                          ? branch.programs_offered.join(', ') 
                          : 'No programs listed'
                      }</p>
                      <p className="mb-1"><strong>Contact:</strong> {branch.contact || 'Not available'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-500">No branches available for this university</p>
            </div>
          )}

          {branches && branches.some(branch => branch.image_gallery) ? (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-brown mb-2">Image Gallery</h3>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {branches.map((branch, index) => 
                  branch.image_gallery && (
                    <Link to={`${branch._id}`} key={`gallery-${index}`} className="cursor-pointer flex-shrink-0">
                      <img 
                        src={branch.image_gallery} 
                        alt={`${branch.name || 'University branch'} ${index + 1}`} 
                        className="w-40 h-40 object-cover rounded-md shadow-sm hover:shadow-md transition-shadow"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    </Link>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-center text-gray-500">No images available</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UniversityDetails;
