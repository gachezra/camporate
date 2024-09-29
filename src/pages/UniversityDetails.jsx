import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import animationData from '../assets/book loading.json';
import { getUniversityDetails, getBranchesRoute } from '../utils/APIRoutes';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UniversityDetails = () => {
  const { universityId } = useParams();
  const [university, setUniversity] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversityDetails = async () => {
      try {
        const universityResponse = await axios.get(`${getUniversityDetails}/${universityId}`);
        setUniversity(universityResponse.data);

        const branchDetailsResponses = await axios.get(getBranchesRoute(universityId))
        setBranches(branchDetailsResponses.data);
      } catch (error) {
        console.error('Error fetching university details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityDetails();
  }, [universityId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <Lottie
        animationData={animationData}
      />
  </div>;
  }

  if (!university) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-700">University not found</div>;
  }

  return (
    <div className="bg-cream min-h-full">
      <Header />
      <h1 className="text-brown text-center text-2xl font-extrabold mb-6">{university.name}</h1>

      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-lg font-semibold text-brown mb-4 text-center">University Information</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="mb-2"><strong>Location:</strong> {university.location}</p>
            <p className="mb-2"><strong>Programs Offered:</strong> {university.programs_offered.join(', ')}</p>
            <p className="mb-2"><strong>Website:</strong> <a href={university.website} className="text-blue-500 underline">{university.website}</a></p>
            <p className="mb-2"><strong>Description:</strong> {university.description}</p>
          </div>
          <div>
            <p className="mb-2"><strong>Overall Rating:</strong> ⭐ {university.overall_rating.toFixed(1)}/5</p>
            <p className="mb-2"><strong>Academic Rating:</strong> ⭐ {university.academic_rating.toFixed(1)}/5</p>
            <p className="mb-2"><strong>Facilities Rating:</strong> ⭐ {university.facilities_rating.toFixed(1)}/5</p>
            <p className="mb-2"><strong>Social Life Rating:</strong> ⭐ {university.social_life_rating.toFixed(1)}/5</p>
            <p className="mb-2"><strong>Career Prospects Rating:</strong> ⭐ {university.career_prospects_rating.toFixed(1)}/5</p>
            <p className="mb-2"><strong>Cost of Living:</strong> ${university.cost_of_living}</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-brown mb-2">Branches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <Link to={`${branch._id}`} className='cursor-pointer'>
                <div key={branch._id} className="bg-cream p-4 rounded-lg shadow-md">
                  <h4 className="text-lg font-semibold text-brown mb-2">{branch.name}</h4>
                  <p className="mb-1"><strong>Location:</strong> {branch.location}</p>
                  <p className="mb-1"><strong>Programs:</strong> {branch.programs_offered.join(', ')}</p>
                  <p className="mb-1"><strong>Contact:</strong> {branch.contact}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-brown mb-2">Image Gallery</h3>
          <div className="flex space-x-4 overflow-x-auto">
            {branches.map((branch, index) => (
              <Link to={`${branch._id}`} className='cursor-pointer'>
                <img key={index} src={branch.image_gallery} alt={`University ${index + 1}`} className="w-40 h-40 object-cover rounded-md" />
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UniversityDetails;
