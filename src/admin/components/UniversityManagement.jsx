import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
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
 
  const fetchUni = useCallback(async (uni) => {
    const branchDeets = await axios.get(`${getUniversityDetails}/${uni}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return branchDeets.data;
  }, []);

  const fetchUniId = useCallback(async () => {
    const res = await axios.get(`${getUserProfileRoute}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const uni = res.data.universities.map(university => university.university);
    return uni;
  }, [userId]);


  const fetchBranchDetails = async (uni) => {
    const branchDeets = await axios.get(getBranchesRoute(uni))
    return branchDeets.data
  };

  useEffect(() => {
    fetchUniId().then(async (uni) => {
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
    });
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
    // Here you would typically send a PUT or PATCH request to update the university details
    // For now, we'll just update the local state
    setUniversity({
      ...university,
      ...editForm
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">University Details</h2>
      {!isEditing ? (
        <div>
          <p><strong>Name:</strong> {university.name}</p>
          <p><strong>Main Campus Location:</strong> {university.location}</p>
          <p><strong>Description:</strong> {university.description}</p>
          <p><strong>Website:</strong> <a href={university.website} className="text-blue-500 underline">{university.website}</a></p>
          <p><strong>Email Domain:</strong> {university.emailDomain}</p>
          <p><strong>Academic Rating:</strong> {university.academic_rating}</p>
          <p><strong>Career Prospects Rating:</strong> {university.career_prospects_rating}</p>
          <p><strong>Cost of Living:</strong> Ksh.{university.cost_of_living} per day</p>
          <p><strong>Facilities Rating:</strong> {university.facilities_rating}</p>
          <p><strong>Overall Rating:</strong> {university.overall_rating}</p>
          <p><strong>Social Life Rating:</strong> {university.social_life_rating}</p>
          <p><strong>Programs Offered:</strong> {university.programs_offered.join(', ')}</p>
          <p><strong>Branches:</strong> {branchDetails.map(branch => branch.name).join(', ')}</p>
          <button onClick={handleEdit} className="mt-4 px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown">
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
            />
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-brown text-cream rounded-lg hover:bg-light-brown">
            <FaCheck/>
          </button>
          <button
            type="submit"
            className="mt-4 px-4 py-2 ml-3 bg-brown text-cream rounded-lg hover:bg-light-brown"
            onClick={() => {
              setIsEditing(false)
            }}
          >
            <FaTimes/>
          </button>
        </form>
      )}
    </div>
  );
};

export default UniversityManagement;