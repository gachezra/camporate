import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { addBranchRoute, getBranchesRoute, getUniversityNamesRoute, schoolEmailRoute } from '../../utils/APIRoutes';

const UniversitySetup = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [schoolEmail, setSchoolEmail] = useState(''); // New state for the school email
  const [isAddingNewUniversity, setIsAddingNewUniversity] = useState(false);
  const [universityData, setUniversityData] = useState({
    name: '',
    description: '',
    website: '',
    emailDomain: '',
    branches: [{ name: '', location: ''}],
  });
  const [newBranch, setNewBranch] = useState({ name: '', location: '' });
  const userId = localStorage.getItem('uid');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      fetchBranches(selectedUniversity);
    }
  }, [selectedUniversity]);

  const fetchUniversities = async () => {
    try {
      const response = await axios.get(getUniversityNamesRoute, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setUniversities(response.data);
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const fetchBranches = async (universityId) => {
    try {
      const response = await axios.get(getBranchesRoute(universityId), {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Branches: ', response.data);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
    setSelectedBranch('');
    setSchoolEmail(''); // Reset school email when changing university
  };

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleSchoolEmailChange = (e) => {
    setSchoolEmail(e.target.value);
  };

  const handleAddNewUniversity = () => {
    setIsAddingNewUniversity(true);
  };

  const handleUniversityDataChange = (e) => {
    setUniversityData({ ...universityData, [e.target.name]: e.target.value });
  };

  const handleNewBranchChange = (e) => {
    setNewBranch({ ...newBranch, [e.target.name]: e.target.value });
  };

  const handleAddBranch = async () => {
    try {
      const addedBranch = {
        name: newBranch.name,
        location: newBranch.location
      };

      const response = await axios.post(addBranchRoute(selectedUniversity, userId), addedBranch, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setUniversityData({
        ...universityData,
        branches: [...universityData.branches, response.data]
      });

      setNewBranch({ name: '', location: '' });
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/universities', universityData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('University created:', response.data);
      // Reset form and fetch updated list of universities
      setUniversityData({
        name: '',
        description: '',
        website: '',
        emailDomain: '',
        branches: [{ name: '', location: '' }],
      });
      setIsAddingNewUniversity(false);
      fetchUniversities();
    } catch (error) {
      console.error('Error creating university:', error);
    }
  };

  const handleAddNewAdmin = async () => {
    try {
      const response = await axios.post(schoolEmailRoute, { 
        userId,
        branchId: selectedBranch,
        universityId: selectedUniversity,
        schoolEmail: schoolEmail
       }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Admin added:', response.data);
      setNotification(response.data.message);
    } catch (error) {
      console.error('Error adding admin:', error);
      setNotification(error.response.data.error);
    }
  }

  return (
    <div className="flex h-screen bg-cream text-brown items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">University Setup</h1>
        
        {!isAddingNewUniversity ? (
          <>
          <div>
            <p clasName='font-bold text-brown mb-3 bg-cream-light'>{notification}</p>
            <div className="mb-4">
              <label className="block mb-2">Select University</label>
              <select
                value={selectedUniversity}
                onChange={handleUniversityChange}
                className="w-full p-2 border rounded"
              >
                <option value="">-- Select University --</option>
                {universities.map(university => (
                  <option key={university._id} value={university._id}>
                    {university.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedUniversity && (
              <div className="mb-4">
                <label className="block mb-2">Select Branch</label>
                <select
                  value={selectedBranch}
                  onChange={handleBranchChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">-- Select Branch --</option>
                  {branches.map(branch => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                  <option value="new">Branch not available</option>
                </select>

                {selectedBranch === 'new' && (
                  <div className="mt-4">
                    <input
                      type="text"
                      name="name"
                      value={newBranch.name}
                      onChange={handleNewBranchChange}
                      placeholder="New Branch Name"
                      className="w-full p-2 border rounded my-2"
                    />
                    <input
                      type="text"
                      name="location"
                      value={newBranch.location}
                      onChange={handleNewBranchChange}
                      placeholder="New Branch Location"
                      className="w-full p-2 border rounded mb-2"
                    />
                    <button
                      type="button"
                      onClick={handleAddBranch}
                      className="bg-green-500 text-white p-2 rounded"
                    >
                      Add Branch
                    </button>
                  </div>
                )}
                {selectedBranch && selectedBranch !== 'new' && (
                  <div className="mt-4">
                    <label className="block mb-2">School Email</label>
                    <input
                      type="email"
                      value={schoolEmail}
                      onChange={handleSchoolEmailChange}
                      placeholder="Enter School Email"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                )}
                <button
                  onClick={handleAddNewAdmin}
                  className="bg-blue-500 text-white p-2 mt-2 rounded w-full"
                >
                  Add University Admin
                </button>
              </div>
            )}
          </div>
          <button
            onClick={handleAddNewUniversity}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Add New University
          </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">University Name</label>
              <input
                type="text"
                name="name"
                value={universityData.name}
                onChange={handleUniversityDataChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block">Description</label>
              <textarea
                name="description"
                value={universityData.description}
                onChange={handleUniversityDataChange}
                className="w-full p-2 border rounded"
              ></textarea>
            </div>
            <div>
              <label className="block">Website</label>
              <input
                type="url"
                name="website"
                value={universityData.website}
                onChange={handleUniversityDataChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block">Email Domain for Verification</label>
              <input
                type="text"
                name="emailDomain"
                value={universityData.emailDomain}
                onChange={handleUniversityDataChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Branches</h2>
              <div className="border p-4 my-2">
                <input
                  type="text"
                  name="name"
                  value={newBranch.name}
                  onChange={handleNewBranchChange}
                  placeholder="New Branch Name"
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="location"
                  value={newBranch.location}
                  onChange={handleNewBranchChange}
                  placeholder="New Branch Location"
                  className="w-full p-2 border rounded mb-2"
                />
                <button
                  type="button"
                  onClick={handleAddBranch}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Add Branch
                </button>
              </div>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
              Save University
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UniversitySetup;
