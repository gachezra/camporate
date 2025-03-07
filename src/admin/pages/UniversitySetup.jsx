import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  addUniversityRoute, 
  addBranchRoute, 
  getBranchesRoute, 
  getUniversityNamesRoute, 
  schoolEmailRoute 
} from '../../utils/APIRoutes';

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

    // Add branch to the university data (for new university)
    setUniversityData({
      ...universityData,
      branches: [...universityData.branches, { ...newBranch }]
    });
    
    // Reset the new branch form
    setNewBranch({ name: '', location: '' });
    
    setNotification({
      message: 'Branch added successfully!',
      isError: false
    });
  };

  // Add branch to existing university
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
      
      // Reset form and fetch updated list of universities
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
    <div className="min-h-screen bg-gray-50 text-gray-700 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold">University Setup</h1>
        </div>
        
        {notification.message && (
          <div className={`p-4 ${notification.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {notification.message}
          </div>
        )}
        
        {isLoading && (
          <div className="p-4 text-center text-blue-600">
            Loading...
          </div>
        )}
        
        <div className="p-6">
          {!isAddingNewUniversity ? (
            <div>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Select University</label>
                <select
                  value={selectedUniversity}
                  onChange={handleUniversityChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
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
                <div className="mb-6 border-t pt-4">
                  <div className="mb-4">
                    <label className="block mb-2 font-medium">Select Branch</label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
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
                    <div className="mb-4">
                      <label className="block mb-2 font-medium">School Email</label>
                      <input
                        type="email"
                        value={schoolEmail}
                        onChange={(e) => setSchoolEmail(e.target.value)}
                        placeholder="Enter School Email"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleAddAdmin}
                        className={`mt-3 px-4 py-2 rounded text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Adding...' : 'Add University Admin'}
                      </button>
                    </div>
                  )}

                  <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Add New Branch to University</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        name="name"
                        value={newBranch.name}
                        onChange={handleNewBranchChange}
                        placeholder="Branch Name"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                      <input
                        type="text"
                        name="location"
                        value={newBranch.location}
                        onChange={handleNewBranchChange}
                        placeholder="Branch Location"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      onClick={handleAddBranchToExisting}
                      className={`px-4 py-2 rounded text-white ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Adding...' : 'Add Branch'}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-6 border-t pt-4">
                <button
                  onClick={() => {
                    setIsAddingNewUniversity(true);
                    setNotification({ message: '', isError: false });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={isLoading}
                >
                  Add New University
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveUniversity} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">University Name *</label>
                <input
                  type="text"
                  name="name"
                  value={universityData.name}
                  onChange={handleUniversityDataChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  name="description"
                  value={universityData.description}
                  onChange={handleUniversityDataChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Website</label>
                <input
                  type="url"
                  name="website"
                  value={universityData.website}
                  onChange={handleUniversityDataChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Email Domain for Verification *</label>
                <input
                  type="text"
                  name="emailDomain"
                  value={universityData.emailDomain}
                  onChange={handleUniversityDataChange}
                  placeholder="e.g., university.edu"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-3">Branches</h2>
                
                {universityData.branches.length > 0 && (
                  <div className="mb-4 bg-gray-50 p-3 rounded">
                    <h3 className="font-medium mb-2">Added Branches:</h3>
                    <ul className="list-disc pl-5">
                      {universityData.branches.map((branch, index) => (
                        <li key={index}>
                          {branch.name} - {branch.location}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="border border-gray-200 p-4 rounded">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      name="name"
                      value={newBranch.name}
                      onChange={handleNewBranchChange}
                      placeholder="Branch Name"
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      name="location"
                      value={newBranch.location}
                      onChange={handleNewBranchChange}
                      placeholder="Branch Location"
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addBranchToUniversity}
                    className={`px-4 py-2 rounded text-white ${isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={isLoading}
                  >
                    Add Branch
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={isLoading}
                >
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
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  disabled={isLoading}
                >
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