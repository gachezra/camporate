import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserProfileRoute, updateUserRoute } from '../../utils/APIRoutes';
import { FaEdit, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');

    if (!uid || !token) {
      setError("Authentication required. Please log in again.");
      setLoading(false);
      return;
    }

    fetchUserData(uid, token);
  }, []);

  const fetchUserData = async (uid, token) => {
    try {
      const response = await axios.get(`${getUserProfileRoute}/${uid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUserData(response.data);
      setUpdatedData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load profile data. Please refresh and try again.");
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    // Reset form data if canceling edit
    if (isEditing) {
      setUpdatedData(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSave = async () => {
    // Basic validation
    if (!updatedData.username?.trim()) {
      setError("Name cannot be empty");
      return;
    }
    
    if (!validateEmail(updatedData.email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    
    if (!uid || !token) {
      setError("Authentication required. Please log in again.");
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      await axios.put(`${updateUserRoute}/${uid}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUserData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-brown" />
      </div>
    );
  }

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Profile</h2>
        {isEditing ? (
          <div className="flex">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-brown text-white px-4 py-2 rounded shadow hover:bg-light-brown transition flex items-center justify-center"
            >
              {saving ? <FaSpinner className="animate-spin" /> : <FaCheck />}
            </button>
            <button 
              onClick={handleEditToggle} 
              disabled={saving}
              className="bg-brown text-white px-4 py-2 ml-3 rounded shadow hover:bg-light-brown transition"
            >
              <FaTimes />
            </button>
          </div>          
        ) : (
          <button onClick={handleEditToggle} className="bg-brown text-white px-4 py-2 ml-3 rounded shadow hover:bg-light-brown transition">
            <FaEdit />
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="form-group">
          <label className="block mb-2 text-lg" htmlFor="username">
            Name
          </label>
          <input
            type="text"
            id="username"
            value={updatedData.username || ''}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full p-3 border border-light-brown rounded-lg ${
              isEditing ? 'bg-white' : 'bg-light-cream'
            }`}
          />
        </div>
        
        <div className="form-group">
          <label className="block mb-2 text-lg" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={updatedData.email || ''}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full p-3 border border-light-brown rounded-lg ${
              isEditing ? 'bg-white' : 'bg-light-cream'
            }`}
          />
        </div>
        
        <div className="form-group">
          <label className="block mb-2 text-lg" htmlFor="role">
            Role
          </label>
          <input
            type="text"
            id="role"
            value={updatedData.role || ''}
            readOnly
            className="w-full p-3 border border-light-brown rounded-lg bg-light-cream cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;