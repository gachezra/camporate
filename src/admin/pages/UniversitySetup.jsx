import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  addUniversityRoute, 
  addBranchRoute, 
  getBranchesRoute, 
  getUniversityNamesRoute, 
  schoolEmailRoute 
} from '../../utils/APIRoutes';
import { FaUniversity, FaBuilding, FaEnvelope, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const UniversitySetup = () => {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [isAddingNewUniversity, setIsAddingNewUniversity] = useState(false);
  const [universityData, setUniversityData] = useState({
    name: '',
    description: '',
    website: '',
    emailDomain: '',
    branches: []
  });
  const [newBranch, setNewBranch] = useState({ name: '', location: '' });
  const [notification, setNotification] = useState({ message: '', isError: false });
  const [isLoading, setIsLoading] = useState(false);
  
  const userId = localStorage.getItem('uid');
  const token = localStorage.getItem('token');

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
      setIsLoading(true);
      const response = await axios.get(getUniversityNamesRoute, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUniversities(response.data);
    } catch (error) {
      setNotification({
        message: 'Error fetching universities. Please try again.',
        isError: true
      });
      console.error('Error fetching universities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBranches = async (universityId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(getBranchesRoute(universityId), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBranches(response.data);
    } catch (error) {
      setNotification({
        message: 'Error fetching branches. Please try again.',
        isError: true
      });
      console.error('Error fetching branches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUniversityChange = (e) => {
    setSelectedUniversity(e.target.value);
    setSelectedBranch('');
    setSchoolEmail('');
  };

  const handleUniversityDataChange = (e) => {
    setUniversityData({ ...universityData, [e.target.name]: e.target.value });
  };

  const handleNewBranchChange = (e) => {
    setNewBranch({ ...newBranch, [e.target.name]: e.target.value });
  };

  const addBranchToUniversity = () => {
    if (!newBranch.name.trim() || !newBranch.location.trim()) {
      setNotification({
        message: 'Branch name and location are required',
        isError: true
      });
      return;
    }

    setUniversityData({
      ...universityData,
      branches: [...universityData.branches, { ...newBranch }]
    });
    
    setNewBranch({ name: '', location: '' });
    
    setNotification({
      message: 'Branch added successfully!',
      isError: false
    });
  };

  const handleAddBranchToExisting = async () => {
    if (!newBranch.name.trim() || !newBranch.location.trim()) {
      setNotification({
        message: 'Branch name and location are required',
        isError: true
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        addBranchRoute(selectedUniversity, userId),
        { name: newBranch.name, location: newBranch.location },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      setBranches([...branches, response.data]);
      setNewBranch({ name: '', location: '' });
      setSelectedBranch(response.data._id);
      
      setNotification({
        message: 'Branch added successfully!',
        isError: false
      });
    } catch (error) {
      setNotification({
        message: error.response?.data?.error || 'Error adding branch',
        isError: true
      });
      console.error('Error adding branch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUniversity = async (e) => {
    e.preventDefault();
    
    if (!universityData.name || !universityData.emailDomain) {
      setNotification({
        message: 'University name and email domain are required',
        isError: true
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post(
        addUniversityRoute,
        universityData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setNotification({
        message: 'University created successfully!',
        isError: false
      });
      
      setUniversityData({
        name: '',
        description: '',
        website: '',
        emailDomain: '',
        branches: []
      });
      setIsAddingNewUniversity(false);
      fetchUniversities();
    } catch (error) {
      setNotification({
        message: error.response?.data?.error || 'Error creating university',
        isError: true
      });
      console.error('Error creating university:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!selectedBranch || !schoolEmail) {
      setNotification({
        message: 'Branch and school email are required',
        isError: true
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.post(
        schoolEmailRoute, 
        { 
          userId,
          branchId: selectedBranch,
          universityId: selectedUniversity,
          schoolEmail 
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      setNotification({
        message: response.data.message,
        isError: false
      });
      setSchoolEmail('');
    } catch (error) {
      setNotification({
        message: error.response?.data?.error || 'Error adding admin',
        isError: true
      });
      console.error('Error adding admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-gray-700 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-brown p-4 text-cream">
          <h1 className="text-2xl font-bold flex items-center">
            <FaUniversity className="mr-2" />
            University Setup
          </h1>
        </div>
        
        {notification.message && (
          <div className={`p-4 ${notification.isError ? 'bg-brown bg-opacity-10 text-brown' : 'bg-blue-100 text-blue-700'} rounded-md mx-6 mt-4`}>
            {notification.message}
          </div>
        )}
        
        {isLoading && (
          <div className="p-4 text-center text-light-brown">
            Loading...
          </div>
        )}
        
        <div className="p-6">
          {!isAddingNewUniversity ? (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-light-brown flex items-center">
                  <FaUniversity className="mr-2" />
                  Select University
                </label>
                <select
                  value={selectedUniversity}
                  onChange={handleUniversityChange}
                  className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Select University"
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
                <div className="border-t border-gray-200 pt-4 space-y-6">
                  <div>
                    <label className="block mb-2 font-medium text-light-brown flex items-center">
                      <FaBuilding className="mr-2" />
                      Select Branch
                    </label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                      disabled={isLoading}
                      aria-label="Select Branch"
                    >
                      <option value="">-- Select Branch --</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name} - {branch.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedBranch && (
                    <div>
                      <label className="block mb-2 font-medium text-light-brown flex items-center">
                        <FaEnvelope className="mr-2" />
                        School Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={schoolEmail}
                          onChange={(e) => setSchoolEmail(e.target.value)}
                          placeholder="Enter School Email"
                          className="w-full p-2 pl-10 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                          disabled={isLoading}
                          aria-label="School Email"
                        />
                        <FaEnvelope className="absolute left-3 top-3 text-light-brown" />
                      </div>
                      <button
                        onClick={handleAddAdmin}
                        className={`mt-3 px-4 py-2 rounded text-cream flex items-center ${
                          isLoading 
                            ? 'bg-light-brown cursor-not-allowed opacity-50' 
                            : 'bg-brown hover:bg-light-brown hover:text-cream border border-light-brown-dark hover:border-brown'
                        }`}
                        disabled={isLoading}
                      >
                        <FaPlus className="mr-2" />
                        {isLoading ? 'Adding...' : 'Add University Admin'}
                      </button>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-brown mb-3 flex items-center">
                      <FaBuilding className="mr-2" />
                      Add New Branch to University
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        name="name"
                        value={newBranch.name}
                        onChange={handleNewBranchChange}
                        placeholder="Branch Name"
                        className="p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                        disabled={isLoading}
                        aria-label="Branch Name"
                      />
                      <input
                        type="text"
                        name="location"
                        value={newBranch.location}
                        onChange={handleNewBranchChange}
                        placeholder="Branch Location"
                        className="p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                        disabled={isLoading}
                        aria-label="Branch Location"
                      />
                    </div>
                    <button
                      onClick={handleAddBranchToExisting}
                      className={`px-4 py-2 rounded text-cream flex items-center ${
                        isLoading 
                          ? 'bg-light-brown cursor-not-allowed opacity-50' 
                          : 'bg-brown hover:bg-light-brown hover:text-cream border border-light-brown-dark hover:border-brown'
                      }`}
                      disabled={isLoading}
                    >
                      <FaPlus className="mr-2" />
                      {isLoading ? 'Adding...' : 'Add Branch'}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4">
                <button
                  onClick={() => {
                    setIsAddingNewUniversity(true);
                    setNotification({ message: '', isError: false });
                  }}
                  className={`px-4 py-2 rounded text-cream flex items-center ${
                    isLoading 
                      ? 'bg-light-brown cursor-not-allowed opacity-50' 
                      : 'bg-brown hover:bg-light-brown hover:text-cream border border-light-brown-dark hover:border-brown'
                  }`}
                  disabled={isLoading}
                >
                  <FaPlus className="mr-2" />
                  Add New University
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveUniversity} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-light-brown flex items-center">
                  <FaUniversity className="mr-2" />
                  University Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={universityData.name}
                  onChange={handleUniversityDataChange}
                  className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                  required
                  disabled={isLoading}
                  aria-label="University Name"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-light-brown flex items-center">
                  Description
                </label>
                <textarea
                  name="description"
                  value={universityData.description}
                  onChange={handleUniversityDataChange}
                  className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                  rows="3"
                  disabled={isLoading}
                  aria-label="University Description"
                ></textarea>
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-light-brown flex items-center">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={universityData.website}
                  onChange={handleUniversityDataChange}
                  className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="University Website"
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-light-brown flex items-center">
                  <FaEnvelope className="mr-2" />
                  Email Domain for Verification *
                </label>
                <input
                  type="text"
                  name="emailDomain"
                  value={universityData.emailDomain}
                  onChange={handleUniversityDataChange}
                  placeholder="e.g., university.edu"
                  className="w-full p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                  required
                  disabled={isLoading}
                  aria-label="Email Domain"
                />
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h2 className="text-xl font-semibold text-brown mb-3 flex items-center">
                  <FaBuilding className="mr-2" />
                  Branches
                </h2>
                
                {universityData.branches.length > 0 && (
                  <div className="mb-4 bg-cream p-4 rounded-md border border-light-brown">
                    <h3 className="font-medium text-light-brown mb-2">Added Branches:</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                      {universityData.branches.map((branch, index) => (
                        <li key={index}>
                          {branch.name} - {branch.location}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="border border-light-brown p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="name"
                      value={newBranch.name}
                      onChange={handleNewBranchChange}
                      placeholder="Branch Name"
                      className="p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                      disabled={isLoading}
                      aria-label="New Branch Name"
                    />
                    <input
                      type="text"
                      name="location"
                      value={newBranch.location}
                      onChange={handleNewBranchChange}
                      placeholder="Branch Location"
                      className="p-2 border border-light-brown rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown focus:border-light-brown-dark transition-colors disabled:opacity-50"
                      disabled={isLoading}
                      aria-label="New Branch Location"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addBranchToUniversity}
                    className={`px-4 py-2 rounded text-cream flex items-center ${
                      isLoading 
                        ? 'bg-light-brown cursor-not-allowed opacity-50' 
                        : 'bg-brown hover:bg-light-brown hover:text-cream border border-light-brown-dark hover:border-brown'
                    }`}
                    disabled={isLoading}
                  >
                    <FaPlus className="mr-2" />
                    Add Branch
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-cream flex items-center ${
                    isLoading 
                      ? 'bg-light-brown cursor-not-allowed opacity-50' 
                      : 'bg-brown hover:bg-light-brown hover:text-cream border border-light-brown-dark hover:border-brown'
                  }`}
                  disabled={isLoading}
                >
                  <FaSave className="mr-2" />
                  {isLoading ? 'Saving...' : 'Save University'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNewUniversity(false);
                    setUniversityData({
                      name: '',
                      description: '',
                      website: '',
                      emailDomain: '',
                      branches: []
                    });
                    setNotification({ message: '', isError: false });
                  }}
                  className={`px-4 py-2 rounded text-cream flex items-center ${
                    isLoading 
                      ? 'bg-light-brown cursor-not-allowed opacity-50' 
                      : 'bg-light-brown-dark hover:bg-brown hover:text-cream border border-light-brown-dark hover:border-brown'
                  }`}
                  disabled={isLoading}
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversitySetup;