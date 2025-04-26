import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { getUserProfileRoute, getBranchRoute, updateBranchRoute } from '../../utils/APIRoutes';

const DEBOUNCE_DELAY = 1000;

const BranchData = ({ userId }) => {
  const [branch, setBranch] = useState({
    _id: '', name: '', location: '', contact: '', email: '',
    academic_rating: 0, career_prospects_rating: 0, cost_of_living: 0,
    facilities_rating: 0, image_gallery: [], overall_rating: 0,
    programs_offered: [], social_life_rating: '',
  });
  const [formData, setFormData] = useState({ ...branch });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceTimeoutRef = useRef(null);

  const fetchBranch = useCallback(async (branchId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const { data } = await axios.get(getBranchRoute(branchId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      setError('Failed to fetch branch details');
      return null;
    }
  }, []);

  const fetchBranchId = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      const { data } = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data?.universities?.[0]?.branch || null;
    } catch (err) {
      setError('Failed to fetch branch ID');
      return null;
    }
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    fetchBranchId().then(async (branchId) => {
      if (branchId) {
        const branchData = await fetchBranch(branchId);
        console.log('Fetched data: ', branchData)
        if (branchData) {
          setBranch(branchData);
          setFormData({
            ...branchData,
            programs_offered: branchData.programs_offered?.join(', ') || '',
            image_gallery: branchData.image_gallery?.join(', ') || '',
          });
        }
      } else {
        setBranch({ ...branch, name: 'No Branch Assigned' });
      }
    }).catch(() => setError('Error loading data')).finally(() => setIsLoading(false));

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [fetchBranchId, fetchBranch, userId]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        ...branch,
        programs_offered: branch.programs_offered?.join(', ') || '',
        image_gallery: branch.image_gallery?.join(', ') || '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (['programs_offered', 'image_gallery'].includes(name)) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(async () => {
        if (!branch._id || !userId) return;
        const itemsArray = value.split(',').map((item) => item.trim()).filter(Boolean);
        try {
          const token = localStorage.getItem('token');
          await axios.post(updateBranchRoute(branch._id, userId), { [name]: itemsArray }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          setError(`Failed to update ${name}`);
        }
      }, DEBOUNCE_DELAY);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    clearTimeout(debounceTimeoutRef.current);

    if (!branch._id || !userId) {
      setError('Missing branch or user information');
      return;
    }

    const programsArray = formData.programs_offered.split(',').map((item) => item.trim()).filter(Boolean);
    const imagesArray = formData.image_gallery.split(',').map((item) => item.trim()).filter(Boolean);

    const payload = {
      name: formData.name, location: formData.location, contact: formData.contact, email: formData.email,
      programs_offered: programsArray, image_gallery: imagesArray,
    };

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(updateBranchRoute(branch._id, userId), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data)
      setBranch(data);
      setFormData({
        ...data,
        programs_offered: data.programs_offered?.join(', ') || '',
        image_gallery: data.image_gallery?.join(', ') || '',
      });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 bg-cream rounded-lg"><FaSpinner className="animate-spin text-brown text-3xl" /> <span className="ml-2 text-brown">Loading...</span></div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  if (!branch._id) {
    return <div className="bg-cream p-6 rounded-lg text-brown text-center">No branch assigned.</div>;
  }

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg text-brown">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? formData.name : branch.name}</h1>
        <button onClick={handleEditClick} className="bg-brown text-white p-2 rounded hover:bg-light-brown transition">
          {isEditing ? <FaTimes /> : <FaEdit />}
        </button>
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p><strong>Location:</strong> {branch.location || 'N/A'}</p>
            <p><strong>Phone:</strong> {branch.contact || 'N/A'}</p>
            <p><strong>Email:</strong> {branch.email || 'N/A'}</p>
            <div>
              <h2 className="font-semibold text-lg">Ratings</h2>
              <p>Academic: {branch.academic_rating || 'N/A'}</p>
              <p>Career: {branch.career_prospects_rating || 'N/A'}</p>
              <p>Facilities: {branch.facilities_rating || 'N/A'}</p>
              <p>Social Life: {branch.social_life_rating || 'N/A'}</p>
              <p>Cost of Living: Ksh.{branch.cost_of_living || 'N/A'}</p>
              <p>Overall: {branch.overall_rating || 'N/A'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-lg">Programs Offered</h2>
              <ul className="list-disc pl-5">
                {branch.programs_offered?.length ? branch.programs_offered.map((program, i) => (
                  <li key={i}>{program}</li>
                )) : <li>No programs listed</li>}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Image Gallery</h2>
              {branch.image_gallery?.length ? (
                <div className="flex overflow-x-auto space-x-4 py-2">
                  {branch.image_gallery.map((image, i) => (
                    <img key={i} src={image} alt={`Gallery ${i + 1}`} className="h-32 w-auto rounded object-cover" loading="lazy" />
                  ))}
                </div>
              ) : <p className="text-gray-500">No images available</p>}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600">{error}</div>}
          {['name', 'location', 'contact', 'email'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block font-semibold capitalize">{field}</label>
              <input
                id={field}
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field] || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown/50"
              />
            </div>
          ))}
          <div>
            <label htmlFor="programs_offered" className="block font-semibold">Programs Offered (comma-separated)</label>
            <textarea
              id="programs_offered"
              name="programs_offered"
              value={formData.programs_offered || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown/50"
              rows="3"
            />
            <p className="text-xs text-gray-500">Auto-saves after typing.</p>
          </div>
          <div>
            <label htmlFor="image_gallery" className="block font-semibold">Image Gallery (comma-separated URLs)</label>
            <textarea
              id="image_gallery"
              name="image_gallery"
              value={formData.image_gallery || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown/50"
              rows="3"
            />
            <p className="text-xs text-gray-500">Auto-saves after typing.</p>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={handleEditClick} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            <button type="submit" className="bg-brown text-white px-4 py-2 rounded hover:bg-light-brown"><FaCheck className="inline mr-1" /> Save</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BranchData;