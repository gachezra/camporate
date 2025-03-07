import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { getUserProfileRoute, getUniversityDetails, getBranchesRoute } from '../../utils/APIRoutes';

const UniversityManagement = ({userId}) => {
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
    website:'',
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
      const branchDeets = await axios.get(`${getUniversityDetails}/${uni}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return branchDeets.data;
    } catch (error) {
      throw new Error("Failed to fetch university details");
    }
  }, []);

  const fetchUniId = useCallback(async () => {
    try {
      const res = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const uni = res.data.universities.map(university => university.university);
      return uni;
    } catch (error) {
      throw new Error("Failed to fetch user's university ID");
    }
  }, [userId]);


  const fetchBranchDetails = async (uni) => {
    try {
      const branchDeets = await axios.get(getBranchesRoute(uni))
      return branchDeets.data;
    } catch (error) {
      throw new Error("Failed to fetch branch details");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const uni = await fetchUniId();
        const uniDetails = await fetchUni(uni);
        setUniversity(uniDetails);
        setEditForm({
          name: uniDetails.name,
          location: uniDetails.location,
          description: uniDetails.description,
          website: uniDetails.website,
          emailDomain: uniDetails.emailDomain,
        });
        
        const branchDetails = await fetchBranchDetails(uni);
        setBranchDetails(branchDetails);
      } catch (err) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [fetchUni, fetchUniId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Here you would typically send a PUT or PATCH request to update the university details
      // For now, we'll just update the local state
      setUniversity({
        ...university,
        ...editForm
      });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update university details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !university.name) {
    return (
      <div className="bg-cream p-6 rounded-lg shadow-lg flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-brown text-3xl" />
        <p className="ml-3 text-lg">Loading university details...</p>
      </div>
    );
  }

  if (error && !university.name) {
    return (
      <div className="bg-cream p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">University Details</h2>
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
          <FaSpinner className="animate-spin text-brown text-3xl" />
        </div>
      )}
      
      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {university.name || 'N/A'}</p>
          <p><strong>Main Campus Location:</strong> {university.location || 'N/A'}</p>
          <p><strong>Description:</strong> {university.description || 'No description available'}</p>
          <p><strong>Website:</strong> {university.website ? 
            <a href={university.website} className="text-blue-500 underline">{university.website}</a> : 
            'N/A'}
          </p>
          <p><strong>Email Domain:</strong> {university.emailDomain || 'N/A'}</p>
          <p><strong>Academic Rating:</strong> {university.academic_rating || 'Not rated'}</p>
          <p><strong>Career Prospects Rating:</strong> {university.career_prospects_rating || 'Not rated'}</p>
          <p><strong>Cost of Living:</strong> {university.cost_of_living ? `Ksh.${university.cost_of_living} per day` : 'Not specified'}</p>
          <p><strong>Facilities Rating:</strong> {university.facilities_rating || 'Not rated'}</p>
          <p><strong>Overall Rating:</strong> {university.overall_rating || 'Not rated'}</p>
          <p><strong>Social Life Rating:</strong> {university.social_life_rating || 'Not rated'}</p>
          <p><strong>Programs Offered:</strong> {university.programs_offered && university.programs_offered.length > 0 ? 
            university.programs_offered.join(', ') : 
            'No programs listed'}
          </p>
          <p><strong>Branches:</strong> {branchDetails && branchDetails.length > 0 ? 
            branchDetails.map(branch => branch.name).join(', ') : 
            'No branches listed'}
          </p>
          <button 
            onClick={handleEdit} 
            className="mt-4 px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown"
            disabled={isLoading}
          >
            <FaEdit />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="block mb-2 text-lg" htmlFor="name">University Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editForm.name}
              onChange={handleChange}
              className="w-full p-3 border border-light-brown rounded-lg"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="block mb-2 text-lg" htmlFor="location">Main Campus Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={editForm.location}
              onChange={handleChange}
              className="w-full p-3 border border-light-brown rounded-lg"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="block mb-2 text-lg" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editForm.description}
              onChange={handleChange}
              className="w-full p-3 border border-light-brown rounded-lg"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="block mb-2 text-lg" htmlFor="website">University Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={editForm.website}
              onChange={handleChange}
              className="w-full p-3 border border-light-brown rounded-lg"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="block mb-2 text-lg" htmlFor="emailDomain">Email Domain</label>
            <input
              type="text"
              id="emailDomain"
              name="emailDomain"
              value={editForm.emailDomain}
              onChange={handleChange}
              className="w-full p-3 border border-light-brown rounded-lg"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex">
            <button 
              type="submit" 
              className="mt-4 px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown flex items-center"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck />}
              {isLoading ? 'Saving...' : ''}
            </button>
            <button
              type="button"
              className="mt-4 px-4 py-2 ml-3 bg-brown text-cream rounded-lg hover:bg-light-brown"
              onClick={() => {
                setIsEditing(false);
                setError(null);
              }}
              disabled={isLoading}
            >
              <FaTimes/>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UniversityManagement;