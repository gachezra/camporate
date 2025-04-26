import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { getUserProfileRoute, getBranchRoute, updateBranchRoute } from '../../utils/APIRoutes';

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 1000; // 1 second delay after typing stops

const BranchData = ({ userId }) => {
  const [branch, setBranch] = useState({
    _id: '',
    name: '',
    location: '',
    academic_rating: 0,
    career_prospects_rating: 0,
    cost_of_living: 0,
    facilities_rating: 0,
    image_gallery: [], // Keep as array
    overall_rating: 0,
    programs_offered: [], // Keep as array
    social_life_rating: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  // formData should mirror the structure, using arrays for gallery/programs
  const [formData, setFormData] = useState({
      ...branch,
      programs_offered: [],
      image_gallery: [],
  });
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Ref to store the debounce timer ID
  const debounceTimeoutRef = useRef(null);

  // --- Data Fetching ---
  const fetchBranch = useCallback(async (branchId) => {
    if (!branchId) return null; // Handle case where no branchId is found
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Authentication token not found.");
        const { data } = await axios.get(getBranchRoute(branchId), {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data;
    } catch (err) {
        console.error("Error fetching branch details:", err);
        setError("Failed to fetch branch details.");
        return null;
    }
  }, []);

  const fetchBranchId = useCallback(async () => {
    if (!userId) return null; // Handle case where no userId is provided
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found.");
      const { data } = await axios.get(`${getUserProfileRoute}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assuming the user profile links to universities, and each has ONE branch ID
      // If a user can have multiple branches, this logic needs adjustment.
      // Taking the first branch found for this example.
      const firstBranchId = data?.universities?.[0]?.branch;
      if (!firstBranchId) {
          console.log("No associated branch found for this user.");
          // Decide how to handle this - maybe show a message or allow creating one?
      }
      return firstBranchId; // Return only the first branch ID found

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
            // Initialize formData correctly, ensuring arrays are handled
            setFormData({
                ...branchDeets,
                // Convert arrays to comma-separated strings for the input fields
                programs_offered: Array.isArray(branchDeets.programs_offered) ? branchDeets.programs_offered.join(', ') : '',
                image_gallery: Array.isArray(branchDeets.image_gallery) ? branchDeets.image_gallery.join(', ') : '',
            });
          } else {
              // Handle case where branch details couldn't be fetched for a valid ID
              setError("Branch details found but could not be loaded.");
          }
        } else {
            // Handle case where no branch ID was found for the user
            setBranch(prev => ({ ...prev, name: 'No Branch Assigned' })); // Update UI appropriately
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

    // Cleanup function for the debounce timer on component unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [fetchBranchId, fetchBranch, userId]); // Rerun if userId changes

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
          // Entering edit mode, formData is already set (or should be based on 'branch')
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

    // Update formData state immediately for input responsiveness
    const newFormData = {
        ...formData,
        [name]: value,
    };
    setFormData(newFormData);

    // --- Debounced Update Logic for Arrays ---
    if (name === 'programs_offered' || name === 'image_gallery') {
      // Clear existing timer
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set a new timer
      debounceTimeoutRef.current = setTimeout(async () => {
        // Only proceed if we have a branch ID and user ID
        if (!branch._id || !userId) {
          console.error("Cannot update: Branch ID or User ID is missing.");
          // Optionally show an error message to the user
          return;
        }

        // Parse the comma-separated string from the input field into an array
        const itemsArray = value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item); // Remove empty strings

        // Prepare the data payload for the specific field
        const updatePayload = { [name]: itemsArray };

        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error("Authentication token not found.");

          console.log(`Debounced update for ${name}:`, updatePayload); // Debug log

          // Make the API call to update just this field
          await axios.post(updateBranchRoute(branch._id, userId), updatePayload, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log(`Successfully updated ${name} via debounce.`);
          // Optionally update the main 'branch' state here if needed immediately,
          // but be cautious about potential race conditions if user types fast.
          // It might be better to rely on the final submit or a refetch.
          // Example: setBranch(prev => ({ ...prev, ...updatePayload }));

        } catch (error) {
          console.error(`Error updating ${name} on the fly:`, error);
          // Optionally show an error notification to the user
          setError(`Failed to auto-update ${name}. Please try saving the form.`);
        }
      }, DEBOUNCE_DELAY);
    }
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Clear any pending debounce timer before final submit
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Ensure we have the necessary IDs
    if (!branch._id || !userId) {
      console.error("Cannot submit: Branch ID or User ID is missing.");
      setError("Cannot save data: Branch or User information is missing.");
      return;
    }

    // Parse array fields from formData strings correctly
    const programsArray = formData.programs_offered
                            .split(',')
                            .map(item => item.trim())
                            .filter(Boolean); // Ensure empty strings are removed
    const imagesArray = formData.image_gallery
                            .split(',')
                            .map(item => item.trim())
                            .filter(Boolean); // Ensure empty strings are removed

    // Prepare the final data payload
    const finalDataToSend = {
      name: formData.name,
      location: formData.location,
      programs_offered: programsArray,
      image_gallery: imagesArray,
      // Include other fields from formData if they are meant to be editable
      // Example: if ratings were editable:
      // academic_rating: formData.academic_rating,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found.");

      console.log("Submitting final form data:", finalDataToSend); // Debug log

      // Make the API call to update the branch with all edited data
      const { data: updatedBranchData } = await axios.post(
        updateBranchRoute(branch._id, userId),
        finalDataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Branch data updated successfully via form submit.');

      // Update the main branch state with the response from the server
      setBranch(updatedBranchData);

      // Update formData to reflect the saved state (including array-to-string conversion for inputs)
      setFormData({
          ...updatedBranchData,
          programs_offered: Array.isArray(updatedBranchData.programs_offered) ? updatedBranchData.programs_offered.join(', ') : '',
          image_gallery: Array.isArray(updatedBranchData.image_gallery) ? updatedBranchData.image_gallery.join(', ') : '',
      });

      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating branch data via form submit:', error);
      setError("Failed to save branch data. Please try again.");
      // Optionally: Provide more specific error feedback based on error response
    }
  };

  // --- Render Logic ---
  if (isLoading) {
      return <div className="text-center p-6">Loading branch data...</div>;
  }

  // Display error if any occurred during loading or saving
  if (error) {
      // You might want a more sophisticated error display (e.g., a toast notification)
      return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
      </div>;
  }

  // Display if no branch is assigned/found after loading
  if (!branch._id && !isLoading) {
       return <div className="bg-cream p-6 rounded-lg shadow-lg text-brown">
           <h1 className="text-2xl font-bold text-center">No branch data available or assigned.</h1>
           {/* Optionally add a button or link here for admins to assign/create one */}
       </div>;
  }

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg text-brown">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{isEditing ? formData.name : branch.name || 'Branch Name'}</h1>
         {/* Only show edit button if branch exists */}
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
          <p className="text-lg mb-2">Location: {branch.location || 'N/A'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          <div>
            <h2 className="font-semibold text-xl mb-2">Image Gallery</h2>
            <div className="h-55"> {/* Consider using a fixed height container if needed */}
              {branch.image_gallery && branch.image_gallery.length > 0 ? (
                <div className="flex space-x-4 overflow-x-auto h-48 pb-2"> {/* Added padding-bottom */}
                  {branch.image_gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="h-full w-auto object-cover rounded flex-shrink-0 border border-gray-300" // Added border
                      loading="lazy" // Lazy load images
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
          {/* Display error specific to saving */}
          {error && <div className="text-red-600">{error}</div>}
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="location" className="block font-semibold mb-1">Location:</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50"
            />
          </div>
          <div>
            {/* Use textarea for better editing experience with lists */}
            <label htmlFor="programs_offered" className="block font-semibold mb-1">Programs Offered (comma-separated):</label>
            <textarea
              id="programs_offered"
              name="programs_offered"
              value={formData.programs_offered || ''} // Ensure controlled component using the string form
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50"
              rows="4"
            />
             <p className="text-xs text-gray-500 mt-1">Changes are auto-saved shortly after you type a comma.</p>
          </div>
          <div>
            <label htmlFor="image_gallery" className="block font-semibold mb-1">Image Gallery (comma-separated URLs):</label>
             <textarea
              id="image_gallery"
              name="image_gallery"
              value={formData.image_gallery || ''} // Ensure controlled component using the string form
              onChange={handleChange}
              className="w-full p-2 border rounded border-gray-300 focus:border-brown focus:ring focus:ring-brown focus:ring-opacity-50"
              rows="4"
            />
             <p className="text-xs text-gray-500 mt-1">Changes are auto-saved shortly after you type a comma.</p>
          </div>
          <div className="flex justify-end"> {/* Align button to the right */}
            <button
                type="button" // Cancel button
                onClick={handleEditClick}
                className="bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-gray-600 transition mr-2"
            >
                <FaTimes className="inline-block mr-1" /> Cancel
            </button>
            <button
              type="submit"
              className="bg-brown text-white px-4 py-2 rounded shadow hover:bg-light-brown transition"
            >
              <FaCheck className="inline-block mr-1"/> Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BranchData;
