import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { getUserProfileRoute, getBranchRoute, updateBranchRoute } from '../../utils/APIRoutes';

const BranchData = ({ userId }) => {
  const [branch, setBranch] = useState({
    _id: '',
    name: '',
    location: '',
    academic_rating: 0,
    career_prospects_rating: 0,
    cost_of_living: 0,
    facilities_rating: 0,
    image_gallery: [],
    overall_rating: 0,
    programs_offered: [],
    social_life_rating: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(branch);

  const fetchBranch = useCallback(async (branchId) => {
    const branchDeets = await axios.get(getBranchRoute(branchId), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    return branchDeets.data;
  }, []);

  const fetchBranchId = useCallback(async () => {
    const res = await axios.get(`${getUserProfileRoute}/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const branches = res.data.universities.map((university) => university.branch);

    return branches;
  }, [userId]);

  useEffect(() => {
    fetchBranchId().then(async (branches) => {
      const branchDeets = await fetchBranch(branches);
      setBranch(branchDeets);
      setFormData(branchDeets);
    });
  }, [fetchBranch, fetchBranchId]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (name === 'programs_offered' || name === 'image_gallery') {
        const values = value.split(',').map(item => item.trim());
        setFormData({
        ...formData,
        [name]: values,
        });
    } else {
        setFormData({
        ...formData,
        [name]: value,
        });
    }
    try {
        const updatedData = {
            ...formData,
            // Only include updated fields here
            name: formData.name !== branch.name ? formData.name : branch.name,
            location: formData.location !== branch.location ? formData.location : branch.location,
            programs_offered: formData.programs_offered !== branch.programs_offered ? formData.programs_offered : branch.programs_offered,
            image_gallery: formData.image_gallery !== branch.image_gallery ? formData.image_gallery : branch.image_gallery,
        };

        await axios.post(updateBranchRoute(branch._id, userId), updatedData, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        setBranch(formData); // Update the displayed branch data
        setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating branch data:', error);
    }
  };

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg text-brown">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{branch.name || 'Branch Name'}</h1>
        <button
          onClick={handleEditClick}
          className="bg-brown text-white px-4 py-2 ml-3 rounded shadow hover:bg-light-brown transition"
        >
          {isEditing ? <FaTimes /> : <FaEdit />}
        </button>
      </div>

      {!isEditing ? (
        <div>
          <p className="text-lg mb-2">Location: {branch.location || 'N/A'}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h2 className="font-semibold">Ratings</h2>
              <p>Academic: {branch.academic_rating || 'N/A'}</p>
              <p>Career Prospects: {branch.career_prospects_rating || 'N/A'}</p>
              <p>Facilities: {branch.facilities_rating || 'N/A'}</p>
              <p>Social Life: {branch.social_life_rating || 'N/A'}</p>
              <p>Cost of Living: {branch.cost_of_living || 'N/A'}</p>
              <p>Overall: {branch.overall_rating || 'N/A'}</p>
            </div>
            <div>
              <h2 className="font-semibold">Programs Offered</h2>
              <ul>
                {branch.programs_offered.length > 0 ? (
                  branch.programs_offered.map((program, index) => (
                    <li key={index}>{program}</li>
                  ))
                ) : (
                  <li>No programs listed</li>
                )}
              </ul>
            </div>
          </div>
          <div>
            <h2 className="font-semibold">Image Gallery</h2>
            <div className="h-55">
            {branch.image_gallery.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto h-48">
                {branch.image_gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="h-full object-cover rounded flex-shrink-0"
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No images available</p>
            )}

            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>          
          <div>
            <label className="block font-semibold mb-1">Programs Offered (comma-separated):</label>
            <input
              type="text"
              name="programs_offered"
              value={formData.programs_offered}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Image Gallery (comma-separated URLs):</label>
            <input
              type="text"
              name="image_gallery"
              value={formData.image_gallery}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-brown text-white px-4 py-2 ml-3 rounded shadow hover:bg-light-brown transition"
          >
            <FaCheck />
          </button>
        </form>
      )}
    </div>
  );
};

export default BranchData;
