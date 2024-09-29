import React from 'react';

const UniversityCard = ({ university, onReviewClick, isProfile }) => {
  return (
    <div className="bg-cream-light rounded-xl shadow-2xl m-4 p-6 w-64 text-center">
      <h2 className="text-brown text-xl font-semibold mb-2">{university.name}</h2>
      <p className="text-light-brown mb-2">{university.location}</p>
      <p className="text-brown font-bold mb-2"><span role="img">⭐</span> {university.overall_rating.toFixed(1)}/5</p>
      <p className="text-brown text-sm mb-1">Academics: {university.academic_rating.toFixed(1)}/5</p>
      <p className="text-brown text-sm mb-1">Facilities: {university.facilities_rating.toFixed(1)}/5</p>
      <p className="text-brown text-sm mb-1">Social Life: {university.social_life_rating.toFixed(1)}/5</p>
      <p className="text-brown text-sm mb-1">Career Prospects: {university.career_prospects_rating.toFixed(1)}/5</p>
      <p className="text-brown text-sm mb-1">Cost of Living: Ksh. {university.cost_of_living} per day</p>
      {isProfile ? (
        <button 
          className="bg-light-brown text-cream border border-light-brown-dark hover:bg-cream hover:text-light-brown hover:border-light-brown-dark py-2 px-4 rounded mt-4 transition-colors duration-300"
          onClick={() => onReviewClick(university)}
        >
          Write a Review
        </button>
      ) : ''}
    </div>
  );
};

export default UniversityCard;
