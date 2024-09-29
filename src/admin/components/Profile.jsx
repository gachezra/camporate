import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserProfileRoute, updateUserRoute } from '../../utils/APIRoutes';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');

    if (uid && token) {
      fetchUserData(uid, token)
        .then(response => {
          setUserData(response.data);
          setUpdatedData(response.data);
          setLoading(false);
        })
        .catch(error => console.error(error));
    }
  }, []);

  const fetchUserData = (uid, token) => {
    return axios.get(`${getUserProfileRoute}/${uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSave = () => {
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    axios
      .put(`${updateUserRoute}/${uid}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setUserData(updatedData);
        setIsEditing(false);
        console.log(userData);
      })
      .catch((error) => console.error('Error updating profile:', error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-cream p-6 rounded-lg shadow-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Profile</h2>
        {isEditing ? (
          <div className='flex '>
            <button onClick={handleSave} className="bg-brown text-white px-4 py-2 rounded shadow hover:bg-light-brown transition">
              <FaCheck />
            </button>
            <button onClick={handleEditToggle} className="bg-brown text-white px-4 py-2 ml-3 rounded shadow hover:bg-light-brown transition">
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
            value={updatedData.username}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full p-3 border border-light-brown rounded-lg bg-light-cream ${
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
            value={updatedData.email}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full p-3 border border-light-brown rounded-lg bg-light-cream ${
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
            value={updatedData.role}
            readOnly
            className="w-full p-3 border border-light-brown rounded-lg bg-light-cream cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
