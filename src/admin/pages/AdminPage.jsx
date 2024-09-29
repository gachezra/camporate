import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import UniversityManagement from '../components/UniversityManagement';
import ReviewsManagement from '../components/ReviewsManagement';
import ForumManagement from '../components/ForumManagement';
import BranchData from '../components/BranchData';
import Profile from '../components/Profile';
import axios from 'axios';
import { getUserProfileRoute } from '../../utils/APIRoutes';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('university-profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const history = useNavigate();
  const uid = localStorage.getItem('uid');
  const token = localStorage.getItem('token');

  const roleCheck = useCallback( async () => {
    const res = await axios.get(`${getUserProfileRoute}/${uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const universityNotVerified = res.data.universities.some(university => !university.isVerified);

    if (res.data.role !== 'admin') {
      history('/unauthorized');
    }

    if (res.data.universities.length === 0) {
      history('/setup');
    }

    if (universityNotVerified) {
      history('/verify');
    }
  }, [history, uid, token]);

  useEffect(() => {
    if (!uid) {
      history('/unauthorized');
    }

    roleCheck(uid);
  }, [roleCheck, history, uid]);

  const renderSection = () => {
    switch (activeSection) {
      case 'university':
        return <UniversityManagement userId={uid} />;
      case 'reviews':
        return <ReviewsManagement userId={uid} />;
      case 'forum':
        return <ForumManagement userId={uid} />;
      case 'profile':
        return <Profile />;
      case 'university-profile':
        return <BranchData userId={uid} />;
      default:
        return <BranchData userId={uid} />;
    }
  };

  return (
    <div className="flex h-screen bg-cream text-brown">
      {/* Sidebar */}
      <AdminSidebar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {/* Main Content */}
      <div
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;
