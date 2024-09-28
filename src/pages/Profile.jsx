import React, { useState, useEffect } from 'react';
import EditProfileForm from '../components/EditProfileForm';
import { getUserProfileRoute, getUniversityDetails } from '../utils/APIRoutes';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';
import UniversityCard from '../components/UniversityCard';
import UniversityForm from '../components/Universityform';

const Profile = () => {
  const userId = localStorage.getItem('uid');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isUniversityFormOpen, setIsUniversityFormOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        console.error('No token found, redirecting to login.');
        navigate('/login'); // Redirect to login page if no token is found
        return;
      }

      try {
        const response = await axios.get(`${getUserProfileRoute}/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        console.log(response.data)
        if (response.status === 200){
          setUser(response.data);
        } else {
          console.error(response.error)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle token expiration or invalid token cases by redirecting to login
        if (error.response && error.response.status === 401) {
          console.error('Token expired or invalid, redirecting to login.');
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [userId, token, navigate]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(getUniversityDetails);
        
        // Extract the universities array from the response
        const { universities } = response.data;

        if (Array.isArray(universities)) {
          // Filter universities where the userId matches one of the students
          const filteredUniversities = universities.filter(university =>
            university.students.includes(userId)
          );
          setUniversities(filteredUniversities);
        } else {
          console.error('Unexpected universities format:', universities);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      }
    };

    fetchUniversities();
  }, [userId]);

  const handleReviewClick = (university) => {
    setSelectedUniversity(university._id);
    setIsReviewFormOpen(true);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-cream p-5 text-center">
      <h1 className="text-brown mb-5 text-3xl font-bold">Profile</h1>
      <div className="inline-block text-left">
        <div className="mb-2">
          <span className="text-light-brown font-bold">Username:</span>
          <span className="text-brown ml-2">{user.username}</span>
        </div>
        <div className="mb-2">
          <span className="text-light-brown font-bold">Email:</span>
          <span className="text-brown ml-2">{user.email}</span>
        </div>
        <div className="mb-2">
          <span className="text-light-brown font-bold">Role:</span>
          <span className="text-brown ml-2">{user.role}</span>
        </div>
        <div className="mb-2">
          <span className="text-light-brown font-bold">Program(s):</span>
          <span className="text-brown ml-2">{user.program}</span>
        </div>
        {user.university && (
          <div className="mb-2">
            <span className="text-light-brown font-bold">University:</span>
            <span className="text-brown ml-2">{user.university.name}</span>
          </div>
        )}
        <button
          className="bg-light-brown hover:bg-light-brown-dark text-cream py-2 px-4 rounded mt-2"
          onClick={() => setIsEditFormOpen(true)}
        >
          Edit Profile
        </button>
        <button 
          className="bg-light-brown hover:bg-light-brown-dark text-cream py-2 px-4 rounded ml-3 mt-2"
          onClick={() => setIsUniversityFormOpen(true)}
        >
          Add University
        </button>
      </div>
      {isEditFormOpen && (
        <EditProfileForm
          user={user}
          onClose={() => setIsEditFormOpen(false)}
          onUpdate={setUser}
        />
      )}
      {isUniversityFormOpen && (
        <UniversityForm
          user={user}
          onClose={() => setIsUniversityFormOpen(false)}
          onUpdate={setUser}
        />
      )}
      {universities.map(university => (
        <UniversityCard 
          key={university._id}
          university={university}
          onReviewClick={handleReviewClick}
          isProfile={true}
        />
      ))}
      {isReviewFormOpen && (
        <ReviewForm
          universityId={selectedUniversity}
          onClose={() => setIsReviewFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;
