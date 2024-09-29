import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditProfileForm from '../components/EditProfileForm';
import { getUserProfileRoute, getUniversityDetails, getThreadsRoute } from '../utils/APIRoutes';
import axios from 'axios';
import Lottie from 'lottie-react';
import animationData from '../assets/book loading.json';
import ReviewForm from '../components/ReviewForm';
import UniversityCard from '../components/UniversityCard';
import UniversityForm from '../components/UniversityForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactNiceAvatar from 'react-nice-avatar';

const Profile = () => {
  const userId = localStorage.getItem('uid');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isUniversityFormOpen, setIsUniversityFormOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [user, setUser] = useState(null);
  const [verifiedPrograms, setVerifiedPrograms] = useState([]);

  const fetchThreads = useCallback(async () => {
    try {
      const response = await axios.get(getThreadsRoute(userId));
      setThreads(response.data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) {
        console.error('No token found, redirecting to login.');
        navigate('/');
        return;
      }

      const avatar = localStorage.getItem('isAvatarSet');

      if (!avatar) {
        navigate('/setAvatar');
      }

      try {
        const response = await axios.get(`${getUserProfileRoute}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.response?.status === 401) {
          console.error('Token expired or invalid, redirecting to login.');
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [userId, token, navigate]);

  useEffect(() => {
    const fetchVerifiedUniversities = async () => {
      if (user?.universities) {
        try {
          const verifiedUniversities = [];

          for (const universityEntry of user.universities) {
            if (universityEntry.isVerified) {
              const response = await axios.get(`${getUniversityDetails}/${universityEntry.university}`);
              if (response.status === 200) {
                verifiedUniversities.push(response.data);
              }
            }
          }

          setUniversities(verifiedUniversities);

          const verifiedProgramsList = user.universities
            .filter(userUni => userUni.isVerified)
            .map(userUni => userUni.program);

          setVerifiedPrograms(verifiedProgramsList);
        } catch (error) {
          console.error('Error fetching universities:', error);
        }
      }
    };

    fetchVerifiedUniversities();
  }, [user]);

  const avatarEdit = () => {
    navigate('/setAvatar');
  }
  
  const handleReviewClick = (university) => {
    setSelectedUniversity(university._id);
    setIsReviewFormOpen(true);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-cream">
        <Lottie animationData={animationData} />
      </div>
    );
  }

  return (
    <>
      <div className="bg-cream text-brown-dark min-h-screen">
        <Header />
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-brown-dark my-6 text-2xl font-bold text-center">Profile</h1>
          <h2 className="text-brown-dark mt-10 mb-6 text-xl font-bold">User</h2>
          <div className="bg-cream-light p-6 rounded-md shadow-md flex flex-col items-center ">
            <div className="flex flex-col items-center justify-between md:items-center md:justify-center md:w-1/2">
              <ReactNiceAvatar
                {...user.avatarImage[0]}
                className="avatar-svg w-40 h-40 md:h-50 md:w-50 shadow-lg rounded-full"
              />
              <div className="mb-4">
                <span className="text-brown font-bold">Username:</span>
                <span className="text-brown-dark ml-2">{user.username}</span>
              </div>
              <div className="mb-4">
                <span className="text-brown font-bold">Email:</span>
                <span className="text-brown-dark ml-2">{user.email}</span>
              </div>
              {user.role === 'admin' && (
                <div className="mb-4">
                  <span className="text-brown font-bold">Role:</span>
                  <span className="text-brown-dark ml-2">{user.role}</span>
                </div>
              )}
              <div className="mb-4">
                <span className="text-brown font-bold">Program(s):</span>
                <span className="text-brown-dark ml-2">
                  {verifiedPrograms.length > 0 ? verifiedPrograms.join(', ') : 'No verified programs'}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-center md:justify-center md:w-1/2 mt-4 md:mt-0">
              <div className="flex space-x-3">
                <button
                  className="bg-brown hover:bg-brown-light text-white py-2 px-4 rounded transition duration-300"
                  onClick={() => setIsEditFormOpen(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded transition duration-300"
                  onClick={() => setIsUniversityFormOpen(true)}
                >
                  Add University
                </button>
              </div>
            </div>
          </div>

          {isEditFormOpen && (
            <EditProfileForm
              user={user}
              onClose={() => setIsEditFormOpen(false)}
              onUpdate={setUser}
              avatarEdit={avatarEdit}
            />
          )}
          {isUniversityFormOpen && (
            <UniversityForm
              user={user}
              onClose={() => setIsUniversityFormOpen(false)}
              onUpdate={setUser}
            />
          )}

          <h2 className="text-brown-dark mt-10 mb-6 text-xl font-bold">Campus</h2>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-8">
            {universities.map((university) => (
              <Link to={`/campus/${university._id}`} key={university._id}>
                <UniversityCard
                  university={university}
                  onReviewClick={handleReviewClick}
                  isProfile
                />
              </Link>
            ))}
          </div>

          {isReviewFormOpen && (
            <ReviewForm
              universityId={selectedUniversity}
              onClose={() => setIsReviewFormOpen(false)}
            />
          )}

          <h2 className="text-brown-dark mt-10 mb-6 text-xl font-bold">Participate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {threads.slice(0, 6).map((thread) => (
              <div
                key={thread._id}
                className="bg-cream-light p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/forums/${thread._id}`}>
                  <h3 className="text-xl font-semibold text-brown-dark">{thread.title}</h3>
                  <p className="text-brown mt-2">{thread.content}</p>
                  <p className="text-sm text-brown-light mt-1">
                    Posted by {thread.author.username} | {new Date(thread.createdAt).toLocaleString()}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
