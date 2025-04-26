import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaTimes, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'; // Added icons
import { getUserProfileRoute, getBranchRoute, updateBranchRoute } from '../../utils/APIRoutes';

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 1000; // 1 second delay after typing stops

const BranchData = ({ userId }) => {
  const [branch, setBranch] = useState({
    _id: '',
    name: '',
    location: '',
    phone: '', // Added phone
    email: '', // Added email
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
  // formData should mirror the structure, using arrays for gallery/programs
  const [formData, setFormData] = useState({
      ...branch,
      programs_offered: [],
      image_gallery: [],
      phone: '', // Added phone
      email: '', // Added email
  });
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Ref to store the debounce timer ID
  const debounceTimeoutRef = useRef(null);

  // --- Data Fetching ---
  const fetchBranch = useCallback(async (branchId) => {
    if (!branchId) return null;
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found.");
        const { data } = await axios.get(getBranchRoute(branchId), {
            headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure default empty strings if data is missing
        return {data};
    } catch (err) {
        console.error("Error fetching branch details:", err);
        setError("Failed to fetch branch details.");
        return null;
    }
  }, []);

  const fetchBranchId = useCallback(async () => {
    if (!userId) return null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found.");
      const { data } = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const firstBranchId = data?.universities?.[0]?.branch;
      if (!firstBranchId) {
          console.log("No associated branch found for this user.");
      }
      return firstBranchId;
    } catch (err) {
      console.error("Error fetching user profile/branch ID:", err);
      setError("Failed to fetch user profile or associated branch.");
      return null;
    }
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchBranchId()
      .then(async (branchId) => {
        if (branchId) {
          const branchDeets = await fetchBranch(branchId);
          if (branchDeets) {
            setBranch(branchDeets);
            // Initialize formData correctly, including new fields
            setFormData({
                ...branchDeets,
                programs_offered: Array.isArray(branchDeets.programs_offered) ? branchDeets.programs_offered.join(', ') : '',
                image_gallery: Array.isArray(branchDeets.image_gallery) ? branchDeets.image_gallery.join(', ') : '',
                // phone and email should already be strings from fetchBranch
            });
          } else {
              setError("Branch details found but could not be loaded.");
          }
        } else {
            setBranch(prev => ({ ...prev, name: 'No Branch Assigned' }));
            setFormData(prev => ({ ...prev, name: 'No Branch Assigned' }));
        }
      })
      .catch(err => {
          console.error("Error in initial data fetch chain:", err);
          setError("An error occurred during initial data loading.");
      })
      .finally(() => {
          setIsLoading(false);
      });

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [fetchBranchId, fetchBranch, userId]);

  // --- Edit Mode Toggle ---
  const handleEditClick = () => {
      if (isEditing) {
          // If cancelling edit, reset formData to original branch data
          setFormData({
              ...branch,
              programs_offered: Array.isArray(branch.programs_offered) ? branch.programs_offered.join(', ') : '',
              image_gallery: Array.isArray(branch.image_gallery) ? branch.image_gallery.join(', ') : '',
          });
      } else {
          // Entering edit mode, sync formData with current branch state
           setFormData({
               ...branch,
               programs_offered: Array.isArray(branch.programs_offered) ? branch.programs_offered.join(', ') : '',
               image_gallery: Array.isArray(branch.image_gallery) ? branch.image_gallery.join(', ') : '',
           });
      }
    setIsEditing(!isEditing);
  };

  // --- Input Change Handler with Debounce ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData state immediately
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // --- Debounced Update Logic for Arrays ---
    if (name === 'programs_offered' || name === 'image_gallery') {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(async () => {
        if (!branch._id || !userId) {
          console.error("Cannot update: Branch ID or User ID is missing.");
          return;
        }
        const itemsArray = value.split(',').map((item) => item.trim()).filter((item) => item);
        const updatePayload = { [name]: itemsArray };
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Authentication token not found.");
          console.log(`Debounced update for ${name}:`, updatePayload);
          await axios.post(updateBranchRoute(branch._id, userId), updatePayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`Successfully updated ${name} via debounce.`);
        } catch (error) {
          console.error(`Error updating ${name} on the fly:`, error);
          setError(`Failed to auto-update ${name}. Please try saving the form.`);
        }
      }, DEBOUNCE_DELAY);
    }
    // No debounce for phone/email/location/name - these update on final submit
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!branch._id || !userId) {
      console.error("Cannot submit: Branch ID or User ID is missing.");
      setError("Cannot save data: Branch or User information is missing.");
      return;
    }

    // Parse array fields
    const programsArray = formData.programs_offered.split(',').map(item => item.trim()).filter(Boolean);
    const imagesArray = formData.image_gallery.split(',').map(item => item.trim()).filter(Boolean);

    // Prepare the final data payload including new fields
    const finalDataToSend = {
      name: formData.name,
      location: formData.location,
      phone: formData.phone, // Add phone
      email: formData.email, // Add email
      programs_offered: programsArray,
      image_gallery: imagesArray,
      // Include other editable fields if necessary (e.g., ratings if they become editable)
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found.");
      console.log("Submitting final form data:", finalDataToSend);

      const { data: updatedBranchData } = await axios.post(
        updateBranchRoute(branch._id, userId),
        finalDataToSend,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Branch data updated successfully via form submit.');

      // Update main state and formData state (convert arrays back for inputs)
      setBranch(updatedBranchData);
      setFormData({
          ...updatedBranchData,
          programs_offered: Array.isArray(updatedBranchData.programs_offered) ? updatedBranchData.programs_offered.join(', ') : '',
          image_gallery: Array.isArray(updatedBranchData.image_gallery) ? updatedBranchData.image_gallery.join(', ') : '',
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating branch data via form submit:', error);
      setError("Failed to save branch data. Please try again.");
    }
  };

  // --- Render Logic ---
  if (isLoading) {
      return <div className="text-center p-6">Loading branch data...</div>;
  }
  if (!branch._id && !isLoading && !error) {
       return <div className="bg-cream p-6 rounded-lg shadow-lg text-brown">
           <h1 className="text-2xl font-bold text-center">No branch data available or assigned.</h1>
       </div>;
  }

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg text-brown">
       {/* Display loading/error states first if they occurred */}
        {error && (
             <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
             </div>
        )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{isEditing ? formData.name : branch.name || 'Branch Name'}</h1>
        {branch._id && (
             <button
                onClick={handleEditClick}
                className="bg-brown text-white px-4 py-2 ml-3 rounded shadow hover:bg-light-brown transition"
                aria-label={isEditing ? 'Cancel Edit' : 'Edit Branch'}
                >
                {isEditing ? <FaTimes /> : <FaEdit />}
            </button>
        )}
      </div>

      {!isEditing ? (
        // --- Display Mode ---
        <div>
          {/* Contact Info Section */}
          <div className="mb-6 border-b border-light-brown pb-4">
              <h2 className="font-semibold text-xl mb-3">Contact Information</h2>
              <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="mr-3 text-brown" />
                  <span>{branch.location || 'N/A'}</span>
              </div>
              <div className="flex items-center mb-2">
                  <FaPhone className="mr-3 text-brown" />
                  <span>{branch.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                  <FaEnvelope className="mr-3 text-brown" />
                  <span>{branch.email || 'N/A'}</span>
              </div>
          </div>

          {/* Ratings & Programs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="font-semibold text-xl mb-2">Ratings</h2>
              <p>Academic: {branch.academic_rating || 'N/A'}</p>
              <p>Career Prospects: {branch.career_prospects_rating || 'N/A'}</p>
              <p>Facilities: {branch.facilities_rating || 'N/A'}</p>
              <p>Social Life: {branch.social_life_rating || 'N/A'}</p>
              <p>Cost of Living: Ksh.{branch.cost_of_living || 'N/A'} per day</p>
              <p>Overall: {branch.overall_rating || 'N/A'}</p>
            </div>
            <div>
              <h2 className="font-semibold text-xl mb-2">Programs Offered</h2>
              <ul>
                {branch.programs_offered && branch.programs_offered.length > 0 ? (
                  branch.programs_offered.map((program, index) => (
                    <li key={index} className="list-disc list-inside">{program}</li>
                  ))
                ) : (
                  <li>No programs listed</li>
                )}
              </ul>
            </div>
          </div>

          {/* Image Gallery Section */}
          <div>
            <h2 className="font-semibold text-xl mb-2">Image Gallery</h2>
            <div className="h-55">
              {branch.image_gallery && branch.image_gallery.length > 0 ? (
                <div className="flex space-x-4 overflow-x-auto h-48 pb-2">
                  {branch.image_gallery.map((image, index) => (
                    <img
                      key={index} src={image} alt={`Gallery ${index + 1}`}
                      className="h-full w-auto object-cover rounded flex-shrink-0 border border-gray-300"
                      loading="lazy"
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
        // --- Edit Mode ---
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display save error specific to form if any */}
          {error && isEditing && <div className="text-red-600">{error}</div>}

          {/* Basic Info Fields */}
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">Name:</label>
            <input id="name" type="text" name="name" value={formData.name || ''} onChange={handleChange}
                   className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="location" className="block font-semibold mb-1">Location:</label>
            <input id="location" type="text" name="location" value={formData.location || ''} onChange={handleChange}
                   className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50" />
          </div>
          {/* Added Phone Field */}
          <div>
            <label htmlFor="phone" className="block font-semibold mb-1">Phone:</label>
            <input id="phone" type="tel" name="phone" value={formData.phone || ''} onChange={handleChange}
                   className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50" />
          </div>
           {/* Added Email Field */}
          <div>
            <label htmlFor="email" className="block font-semibold mb-1">Email:</label>
            <input id="email" type="email" name="email" value={formData.email || ''} onChange={handleChange}
                   className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50" />
          </div>

          {/* Array Fields */}
          <div>
            <label htmlFor="programs_offered" className="block font-semibold mb-1">Programs Offered (comma-separated):</label>
            <textarea id="programs_offered" name="programs_offered" value={formData.programs_offered || ''} onChange={handleChange}
                      className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50" rows="4" />
             <p className="text-xs text-gray-500 mt-1">Changes are auto-saved shortly after you type a comma.</p>
          </div>
          <div>
            <label htmlFor="image_gallery" className="block font-semibold mb-1">Image Gallery (comma-separated URLs):</label>
             <textarea id="image_gallery" name="image_gallery" value={formData.image_gallery || ''} onChange={handleChange}
                       className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50" rows="4" />
             <p className="text-xs text-gray-500 mt-1">Changes are auto-saved shortly after you type a comma.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-2">
            <button type="button" onClick={handleEditClick}
                    className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition mr-2">
                <FaTimes className="inline-block mr-1" /> Cancel
            </button>
            <button type="submit"
                    className="bg-brown text-white px-4 py-2 rounded shadow hover:bg-light-brown transition">
              <FaCheck className="inline-block mr-1"/> Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BranchData;
