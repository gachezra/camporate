import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getUniversityNamesRoute, schoolEmailRoute, getProgramsRoute, getBranchesRoute } from '../utils/APIRoutes';

const UniversityForm = ({ onClose, onUniversityAdded }) => {
  const [universities, setUniversities] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    universityId: '',
    branchId: '',
    program: '',
    schoolEmail: '',
  });
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(getUniversityNamesRoute);
        setUniversities(response.data);
      } catch (error) {
        console.error('Error fetching universities:', error);
        setNotification('Failed to load universities. Please try again later.');
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      if (formData.universityId) {
        try {
          const branches = await axios.get(getBranchesRoute(formData.universityId))
          setBranches(branches.data);
        } catch (error) {
          console.error('Error fetching branches:', error);
          setNotification(error.response.data.error);
        }
      } else {
        setBranches([]);
      }
    }
    fetchBranches();
  }, [formData.universityId]);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (formData.branchId) {
        try {
          const response = await axios.get(getProgramsRoute(formData.branchId));
          console.log(response.data)
          setPrograms(response.data);
        } catch (error) {
          console.error('Error fetching programs:', error);
          setNotification('Failed to load programs. Please try again later.');
        }
      } else {
        setPrograms([]);
      }
    };

    fetchPrograms();
  }, [formData.branchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset the program selection when the university changes
    if (name === 'universityId') {
      setFormData((prev) => ({ ...prev, program: '', branchId: ''  }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setNotification('');

  try {
    const response = await axios.post(schoolEmailRoute, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });

    if (response.status === 400 && response.data.error) {
      setNotification(response.data.error);
    } else {
      setNotification(response.data.message || 'University and email added successfully!');
      onUniversityAdded();
      onClose();
    }
  } catch (error) {
    console.error('Error submitting form:', error);

    // Handle the error as needed
    if (error.response && error.response.status === 400) {
      // Handle 400 Bad Request error
      setNotification(error.response.data.error);
      console.log('Bad Request error:', error.response.data);
    } else {
      // Handle other errors
      setNotification('Failed to submit the form. Please try again.');
      console.log('Error:', error);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#FFF8F0] rounded-lg p-8 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-semibold text-center text-[#40342A] mb-4">Add University Email</h2>
        {notification && (
          <div className="bg-[#C3A287] text-[#FFF8F0] text-center py-2 rounded mb-4">
            {notification}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#A58A6F] mb-1">Select University:</label>
            <select
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#C3A287] rounded focus:outline-none focus:ring focus:ring-[#C3A287] transition duration-300"
            >
              <option value="">-- Select a University --</option>
              {universities.map((university) => (
                <option key={university._id} value={university._id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#A58A6F] mb-1">Select Branch:</label>
            <select
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              required
              disabled={!branches.length}
              className="w-full px-3 py-2 border border-[#C3A287] rounded focus:outline-none focus:ring focus:ring-[#C3A287] transition duration-300"
            >
              <option value="">-- Select a Branch --</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#A58A6F] mb-1">Select Program:</label>
            <select
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
              disabled={!programs.length}
              className="w-full px-3 py-2 border border-[#C3A287] rounded focus:outline-none focus:ring focus:ring-[#C3A287] transition duration-300"
            >
              <option value="">-- Select a Program --</option>
              {programs.map((program, index) => (
                <option key={index} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[#A58A6F] mb-1">School Email:</label>
            <input
              type="email"
              name="schoolEmail"
              value={formData.schoolEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-[#C3A287] rounded focus:outline-none focus:ring focus:ring-[#C3A287] transition duration-300"
              placeholder="example@university.edu"
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className={`bg-[#C3A287] text-[#FFF8F0] px-4 py-2 rounded shadow ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#A58A6F] transition duration-300'
              }`}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              className="bg-[#A58A6F] text-[#FFF8F0] px-4 py-2 rounded shadow hover:bg-[#C3A287] transition duration-300"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UniversityForm;
