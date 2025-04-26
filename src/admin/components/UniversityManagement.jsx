import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { getUserProfileRoute, getUniversityDetails, getBranchesRoute, updateUniversityRoute } from '../../utils/APIRoutes';

const UniversityManagement = ({ userId }) => {
  const [university, setUniversity] = useState({
    _id: '', name: '', description: '', website: '', emailDomain: '',
    academic_rating: 0, career_prospects_rating: 0, cost_of_living: 0,
    facilities_rating: 0, overall_rating: 0, programs_offered: [], social_life_rating: '', branches: [],
  });
  const [editForm, setEditForm] = useState({
    name: '', description: '', website: '', emailDomain: '',
    programs_offered: '',
  });
  const [branchDetails, setBranchDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUni = useCallback(async (uniId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const { data } = await axios.get(`${getUniversityDetails}/${uniId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      throw new Error('Failed to fetch university details');
    }
  }, []);

  const fetchUniId = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const { data } = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.universities?.[0]?.university || null;
    } catch (err) {
      throw new Error('Failed to fetch university ID');
    }
  }, [userId]);

  const fetchBranchDetails = async (uniId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(getBranchesRoute(uniId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      throw new Error('Failed to fetch branch details');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUniId().then(async (uniId) => {
      if (uniId) {
        const [uniDetails, branches] = await Promise.all([
          fetchUni(uniId),
          fetchBranchDetails(uniId),
        ]);
        console.log('Fetched university details:', uniDetails);
        console.log('Fetched branch details:', branches);
        setUniversity(uniDetails);
        setEditForm({
          name: uniDetails.name, description: uniDetails.description,
          website: uniDetails.website, emailDomain: uniDetails.emailDomain,
          programs_offered: uniDetails.programs_offered?.join(', ') || '',
        });
        setBranchDetails(branches);
      }
    }).catch((err) => setError(err.message)).finally(() => setIsLoading(false));

  }, [fetchUni, fetchUniId]);

  const handleEdit = () => setIsEditing(true);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const programsArray = editForm.programs_offered.split(',').map((item) => item.trim()).filter(Boolean);
    const payload = { ...editForm, programs_offered: programsArray };

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(updateUniversityRoute(university._id), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUniversity(data);
      setEditForm({
        ...data,
        programs_offered: data.programs_offered?.join(', ') || '',
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update university details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !university.name) {
    return <div className="flex justify-center items-center h-64 bg-cream rounded-lg"><FaSpinner className="animate-spin text-brown text-3xl" /> <span className="ml-2 text-brown">Loading...</span></div>;
  }

  if (error && !university.name) {
    return (
      <div className="bg-cream p-6 rounded-lg text-brown">
        <p className="text-red-600">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 bg-brown text-cream px-4 py-2 rounded hover:bg-light-brown">Retry</button>
      </div>
    );
  }

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg text-brown">
      <h2 className="text-2xl font-semibold mb-6">University Details</h2>
      {isLoading && <div className="absolute inset-0 bg-cream/70 flex justify-center items-center"><FaSpinner className="animate-spin text-brown text-3xl" /></div>}
      
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p><strong>Name:</strong> {university.name || 'N/A'}</p>
            <p><strong>Description:</strong> {university.description || 'N/A'}</p>
            <p><strong>Website:</strong> {university.website ? <a href={university.website} className="text-blue-500 underline">{university.website}</a> : 'N/A'}</p>
            <p><strong>Email Domain:</strong> {university.emailDomain || 'N/A'}</p>
          </div>
          <div className="space-y-4">
            <p><strong>Programs:</strong> {university.programs_offered?.length ? university.programs_offered.join(', ') : 'N/A'}</p>
            <p><strong>Branches:</strong> {branchDetails?.length ? branchDetails.map(b => b.name).join(', ') : 'No branches'}</p>
            <div>
              <h3 className="font-semibold">Ratings</h3>
              <p>Academic: {university.academic_rating || 'N/A'}</p>
              <p>Career: {university.career_prospects_rating || 'N/A'}</p>
              <p>Facilities: {university.facilities_rating || 'N/A'}</p>
              <p>Social Life: {university.social_life_rating || 'N/A'}</p>
              <p>Cost of Living: Ksh.{university.cost_of_living || 'N/A'}</p>
              <p>Overall: {university.overall_rating || 'N/A'}</p>
            </div>
          </div>
          <button onClick={handleEdit} className="mt-4 bg-brown text-cream px-4 py-2 rounded hover:bg-light-brown"><FaEdit className="inline mr-1" /> Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {['name', 'website', 'emailDomain'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block font-semibold capitalize">{field}</label>
              <input
                id={field}
                type={field === 'emailDomain' ? 'text' : field === 'website' ? 'url' : 'text'}
                name={field}
                value={editForm[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown/50"
                disabled={isLoading}
              />
            </div>
          ))}
          <div>
            <label htmlFor="description" className="block font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              value={editForm.description}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown/50"
              rows="4"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="programs_offered" className="block font-semibold">Programs Offered (comma-separated)</label>
            <textarea
              id="programs_offered"
              name="programs_offered"
              value={editForm.programs_offered}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown/50"
              rows="3"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={isLoading}
            >
              <FaTimes className="inline mr-1" /> Cancel
            </button>
            <button
              type="submit"
              className="bg-brown text-white px-4 py-2 rounded hover:bg-light-brown"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin inline mr-1" /> : <FaCheck className="inline mr-1" />}
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UniversityManagement;