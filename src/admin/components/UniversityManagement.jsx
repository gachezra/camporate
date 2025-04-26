import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaTimes, FaSpinner, FaUniversity, FaGlobe, FaEnvelope } from 'react-icons/fa';
import { getUserProfileRoute, getUniversityDetails, getBranchesRoute } from '../../utils/APIRoutes';

const UniversityManagement = ({ userId }) => {
  const [university, setUniversity] = useState({
    name: '',
    location: '',
    academic_rating: 0,
    career_prospects_rating: 0,
    cost_of_living: 0,
    facilities_rating: 0,
    overall_rating: 0,
    programs_offered: [],
    social_life_rating: '',
    branches: [],
    website: '',
    description: '',
    emailDomain: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    description: '',
    website: '',
    emailDomain: '',
  });
  const [branchDetails, setBranchDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const fetchUni = useCallback(async (uni) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found");
      
      const response = await axios.get(`${getUniversityDetails}/${uni}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch university details");
    }
  }, []);

  const fetchUniId = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found");
      
      const response = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      return response.data.universities.map(university => university.university);
    } catch (error) {
      throw new Error("Failed to fetch user's university ID");
    }
  }, [userId]);

  const fetchBranchDetails = useCallback(async (uni) => {
    try {
      const response = await axios.get(getBranchesRoute(uni));
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch branch details");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const uni = await fetchUniId();
        const uniDetails = await fetchUni(uni);
        console.log(uniDetails)
        setUniversity(uniDetails);
        setEditForm({
          name: uniDetails.name || '',
          location: uniDetails.location || '',
          description: uniDetails.description || '',
          website: uniDetails.website || '',
          emailDomain: uniDetails.emailDomain || '',
        });
        
        const branches = await fetchBranchDetails(uni);
        setBranchDetails(branches);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [fetchUni, fetchUniId, fetchBranchDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // In a real implementation, send a PUT/PATCH request to update university details
      // For now, just updating local state
      setUniversity(prev => ({
        ...prev,
        ...editForm
      }));
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update university details");
    } finally {
      setIsLoading(false);
    }
  };

  const renderRatingBar = (rating) => {
    const value = parseFloat(rating) || 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-brown h-2.5 rounded-full" 
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
      </div>
    );
  };

  if (isLoading && !university.name) {
    return (
      <div className="bg-cream p-8 rounded-lg shadow-lg flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-brown text-3xl" />
        <p className="ml-3 text-lg">Loading university details...</p>
      </div>
    );
  }

  if (error && !university.name) {
    return (
      <div className="bg-cream p-8 rounded-lg shadow-lg">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-cream p-8 rounded-lg shadow-lg relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10 rounded-lg">
          <FaSpinner className="animate-spin text-brown text-3xl" />
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6 border-b border-light-brown pb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <FaUniversity className="mr-2 text-brown" />
          University Management
        </h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown transition-colors flex items-center"
            disabled={isLoading}
          >
            <FaEdit className="mr-2" /> Edit Details
          </button>
        )}
      </div>
      
      {!isEditing ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">University Name</p>
                  <p className="font-medium text-lg">{university.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Main Campus Location</p>
                  <p className="font-medium">{university.location || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Description</p>
                  <p className="text-gray-800">{university.description || 'No description available'}</p>
                </div>
                <div className="flex items-center">
                  <FaGlobe className="text-brown mr-2" />
                  <p className="text-gray-600 text-sm">Website:</p>
                  {university.website ? 
                    <a href={university.website} className="ml-2 text-blue-600 hover:underline">{university.website}</a> : 
                    <span className="ml-2">N/A</span>
                  }
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-brown mr-2" />
                  <p className="text-gray-600 text-sm">Email Domain:</p>
                  <span className="ml-2">{university.emailDomain || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Programs Offered</h3>
              {university.programs_offered && university.programs_offered.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {university.programs_offered.map((program, index) => (
                    <span key={index} className="bg-light-brown bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {program}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No programs listed</p>
              )}
            </div>
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">University Ratings</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Academic</span>
                    <span className="font-medium">{university.academic_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(university.academic_rating)}
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Career Prospects</span>
                    <span className="font-medium">{university.career_prospects_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(university.career_prospects_rating)}
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Facilities</span>
                    <span className="font-medium">{university.facilities_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(university.facilities_rating)}
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Social Life</span>
                    <span className="font-medium">{university.social_life_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(university.social_life_rating)}
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Overall Rating</span>
                    <span className="font-medium">{university.overall_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(university.overall_rating)}
                </div>
                <div className="pt-2">
                  <p className="text-gray-700">Cost of Living: <span className="font-medium">
                    {university.cost_of_living ? `Ksh.${university.cost_of_living} per day` : 'Not specified'}
                  </span></p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Campus Branches</h3>
              {branchDetails && branchDetails.length > 0 ? (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <ul className="divide-y divide-gray-200">
                    {branchDetails.map((branch, index) => (
                      <li key={index} className="py-2">
                        {branch.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 italic">No branches listed</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">University Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editForm.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="location">Main Campus Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={editForm.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editForm.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="website">University Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={editForm.website}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
              disabled={isLoading}
              placeholder="https://example.edu"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="emailDomain">Email Domain</label>
            <input
              type="text"
              id="emailDomain"
              name="emailDomain"
              value={editForm.emailDomain}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
              disabled={isLoading}
              placeholder="example.edu"
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button 
              type="submit" 
              className="px-6 py-3 bg-brown text-cream rounded-lg hover:bg-light-brown transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
              onClick={() => {
                setIsEditing(false);
                setError(null);
                setEditForm({
                  name: university.name || '',
                  location: university.location || '',
                  description: university.description || '',
                  website: university.website || '',
                  emailDomain: university.emailDomain || '',
                });
              }}
              disabled={isLoading}
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UniversityManagement;
