import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { 
  FaEdit, FaCheck, FaTimes, FaMapMarkerAlt, FaPhone, 
  FaEnvelope, FaSpinner, FaBuilding, FaGraduationCap 
} from 'react-icons/fa';
import { getUserProfileRoute, getBranchRoute, updateBranchRoute } from '../../utils/APIRoutes';

const DEBOUNCE_DELAY = 1000;

const BranchData = ({ userId }) => {
  const [branch, setBranch] = useState({
    _id: '',
    name: '',
    location: '',
    phone: '',
    email: '',
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
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    programs_offered: '',
    image_gallery: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const debounceTimeoutRef = useRef(null);

  const fetchBranch = useCallback(async (branchId) => {
    if (!branchId) return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found");
      
      const { data } = await axios.get(getBranchRoute(branchId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (err) {
      console.error("Error fetching branch details:", err);
      throw new Error("Failed to fetch branch details");
    }
  }, []);

  const fetchBranchId = useCallback(async () => {
    if (!userId) return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found");
      
      const { data } = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return data?.universities?.[0]?.branch;
    } catch (err) {
      console.error("Error fetching user profile/branch ID:", err);
      throw new Error("Failed to fetch user profile or associated branch");
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const branchId = await fetchBranchId();
        if (branchId) {
          const branchData = await fetchBranch(branchId);
          console.log(branchData)
          if (branchData) {
            setBranch(branchData);
            setFormData({
              name: branchData.name || '',
              location: branchData.location || '',
              phone: branchData.phone || '',
              email: branchData.email || '',
              programs_offered: Array.isArray(branchData.programs_offered) 
                ? branchData.programs_offered.join(', ') 
                : '',
              image_gallery: Array.isArray(branchData.image_gallery) 
                ? branchData.image_gallery.join(', ') 
                : '',
            });
          }
        }
      } catch (err) {
        setError(err.message || "An error occurred during data loading");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [fetchBranchId, fetchBranch, userId]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling edit
      setFormData({
        name: branch.name || '',
        location: branch.location || '',
        phone: branch.phone || '',
        email: branch.email || '',
        programs_offered: Array.isArray(branch.programs_offered) 
          ? branch.programs_offered.join(', ') 
          : '',
        image_gallery: Array.isArray(branch.image_gallery) 
          ? branch.image_gallery.join(', ') 
          : '',
      });
    }
    setIsEditing(!isEditing);
    setSaveStatus(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Handle debounced updates for arrays
    if (name === 'programs_offered' || name === 'image_gallery') {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      
      debounceTimeoutRef.current = setTimeout(async () => {
        if (!branch._id || !userId) return;
        
        const itemsArray = value.split(',').map(item => item.trim()).filter(Boolean);
        const updatePayload = { [name]: itemsArray };
        
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Authentication token not found");
          
          setSaveStatus('saving');
          await axios.post(updateBranchRoute(branch._id, userId), updatePayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus(null), 2000);
        } catch (error) {
          setSaveStatus('error');
          console.error(`Error updating ${name}:`, error);
        }
      }, DEBOUNCE_DELAY);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaveStatus('saving');

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!branch._id || !userId) {
      setError("Branch ID or User ID is missing");
      setSaveStatus('error');
      return;
    }

    // Parse array fields
    const programsArray = formData.programs_offered.split(',').map(item => item.trim()).filter(Boolean);
    const imagesArray = formData.image_gallery.split(',').map(item => item.trim()).filter(Boolean);

    const payload = {
      name: formData.name,
      location: formData.location,
      phone: formData.phone,
      email: formData.email,
      programs_offered: programsArray,
      image_gallery: imagesArray,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found");

      const { data: updatedBranchData } = await axios.post(
        updateBranchRoute(branch._id, userId),
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBranch(updatedBranchData);
      setFormData({
        ...payload,
        programs_offered: programsArray.join(', '),
        image_gallery: imagesArray.join(', '),
      });
      
      setSaveStatus('saved');
      setTimeout(() => {
        setSaveStatus(null);
        setIsEditing(false);
      }, 1000);
    } catch (err) {
      console.error('Error updating branch data:', err);
      setError("Failed to save branch data");
      setSaveStatus('error');
    }
  };

  const renderRatingBar = (rating) => {
    const value = parseFloat(rating) || 0;
    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-brown h-2 rounded-full transition-all duration-300" 
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-cream p-8 rounded-lg shadow-lg flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-brown text-3xl" />
        <p className="ml-3 text-lg">Loading branch data...</p>
      </div>
    );
  }

  if (!branch._id && !isLoading && !error) {
    return (
      <div className="bg-cream p-8 rounded-lg shadow-lg">
        <div className="text-center py-12">
          <FaBuilding className="text-gray-400 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Branch Assigned</h2>
          <p className="text-gray-500">No branch data available for this user.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream p-8 rounded-lg shadow-lg">
      {error && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 border-b border-light-brown pb-4">
        <h1 className="text-3xl font-bold flex items-center">
          <FaBuilding className="mr-3 text-brown" />
          {isEditing ? formData.name : branch.name || 'Branch Management'}
        </h1>
        
        {branch._id && (
          <button
            onClick={handleEditToggle}
            className={`px-4 py-2 rounded shadow flex items-center transition-colors ${
              isEditing 
                ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                : 'bg-brown hover:bg-light-brown text-white'
            }`}
            disabled={isLoading}
          >
            {isEditing ? (
              <>
                <FaTimes className="mr-2" /> Cancel
              </>
            ) : (
              <>
                <FaEdit className="mr-2" /> Edit Branch
              </>
            )}
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-brown" /> Contact Information
              </h2>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-3 text-brown" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{branch.location || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaPhone className="mt-1 mr-3 text-brown" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{branch.phone || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaEnvelope className="mt-1 mr-3 text-brown" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{branch.email || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaGraduationCap className="mr-2 text-brown" /> Programs Offered
              </h2>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {branch.programs_offered && branch.programs_offered.length > 0 ? (
                    branch.programs_offered.map((program, index) => (
                      <span 
                        key={index} 
                        className="bg-light-brown bg-opacity-20 px-3 py-1 rounded-full text-sm"
                      >
                        {program}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No programs listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Branch Ratings</h2>
              
              <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Academic</span>
                    <span className="font-medium">{branch.academic_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(branch.academic_rating)}
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Career Prospects</span>
                    <span className="font-medium">{branch.career_prospects_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(branch.career_prospects_rating)}
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Facilities</span>
                    <span className="font-medium">{branch.facilities_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(branch.facilities_rating)}
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Social Life</span>
                    <span className="font-medium">{branch.social_life_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(branch.social_life_rating)}
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Overall Rating</span>
                    <span className="font-medium">{branch.overall_rating || 'N/A'}/5</span>
                  </div>
                  {renderRatingBar(branch.overall_rating)}
                </div>
                
                <div className="pt-2">
                  <p className="text-gray-700">Cost of Living: <span className="font-medium">
                    {branch.cost_of_living ? `Ksh.${branch.cost_of_living} per day` : 'Not specified'}
                  </span></p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Image Gallery</h2>
              
              {branch.image_gallery && branch.image_gallery.length > 0 ? (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex space-x-4 overflow-x-auto py-2 -mx-2 px-2">
                    {branch.image_gallery.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="h-48 w-auto object-cover rounded-lg shadow flex-shrink-0 transition transform hover:scale-105"
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-sm flex justify-center items-center h-32">
                  <p className="text-gray-500 italic">No images available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700 mb-2">Branch Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
                placeholder="Main Campus"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block font-medium text-gray-700 mb-2">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
                placeholder="City, Country"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
                placeholder="+123 456 7890"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
                placeholder="contact@university.edu"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="programs_offered" className="block font-medium text-gray-700 mb-2">
              Programs Offered
              {saveStatus === 'saving' && name === 'programs_offered' && (
                <span className="ml-2 text-xs text-gray-500">Saving...</span>
              )}
              {saveStatus === 'saved' && name === 'programs_offered' && (
                <span className="ml-2 text-xs text-green-500">Saved</span>
              )}
            </label>
            <textarea
              id="programs_offered"
              name="programs_offered"
              value={formData.programs_offered}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
              rows="4"
              placeholder="Computer Science, Business Administration, Medicine (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Changes are auto-saved shortly after you type a comma.</p>
          </div>
          
          <div>
            <label htmlFor="image_gallery" className="block font-medium text-gray-700 mb-2">
              Image Gallery URLs
              {saveStatus === 'saving' && name === 'image_gallery' && (
                <span className="ml-2 text-xs text-gray-500">Saving...</span>
              )}
              {saveStatus === 'saved' && name === 'image_gallery' && (
                <span className="ml-2 text-xs text-green-500">Saved</span>
              )}
            </label>
            <textarea
              id="image_gallery"
              name="image_gallery"
              value={formData.image_gallery}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-brown focus:ring-opacity-30 focus:border-brown"
              rows="4"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">Changes are auto-saved shortly after you type a comma.</p>
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4">
            <div className="flex-1">
              {saveStatus === 'saving' && (
                <span className="text-sm text-gray-500 flex items-center">
                  <FaSpinner className="animate-spin mr-2" /> Saving changes...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-sm text-green-600 flex items-center">
                  <FaCheck className="mr-2" /> Changes saved successfully
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-sm text-red-600 flex items-center">
                  <FaTimes className="mr-2" /> Error saving changes
                </span>
              )}
            </div>
            
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
            
            <button
              type="submit"
              className="px-6 py-2 bg-brown text-white rounded-lg hover:bg-light-brown transition-colors flex items-center"
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaCheck className="mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BranchData;
