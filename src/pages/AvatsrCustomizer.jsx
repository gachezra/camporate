import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactNiceAvatar from 'react-nice-avatar';
import axios from 'axios';
import { setAvatarRoute } from '../utils/APIRoutes';
import { 
  FaUpload, 
  FaVenusMars, 
  FaEye, 
  FaPalette, 
  FaImage, 
  FaPencilAlt,
} from 'react-icons/fa';
import { FaEarListen } from "react-icons/fa6";
import { IoMdGlasses } from 'react-icons/io';
import { GiHairStrands, GiTShirt, GiNoseFront } from 'react-icons/gi';
import { MdFace } from 'react-icons/md';

import Header from '../components/Header';
import Footer from '../components/Footer';

const AvatarCustomizer = () => {
  const userId = localStorage.getItem('uid');
  const [config, setConfig] = useState({
    sex: 'man',
    faceColor: '#f5a623',
    earSize: 'small',
    hairColor: '#000000',
    hairStyle: 'normal',
    hatColor: '#ffffff',
    hatStyle: 'none',
    eyeStyle: 'circle',
    glassesStyle: 'none',
    noseStyle: 'short',
    mouthStyle: 'smile',
    shirtStyle: 'hoody',
    shirtColor: '#0081ff',
    bgColor: '#eeeeee',
  });
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const preBuiltAvatars = [
    { id: '1', config: { sex: 'man', glassesStyle: 'none', hatStyle: 'none', faceColor: '#f5a623', hairColor: '#000000', hairStyle: 'thick', eyeStyle: 'circle', earSize: 'small', noseStyle: 'short', mouthStyle: 'smile', shirtStyle: 'hoody', shirtColor: '#0081ff', bgColor: '#eeeeee' } },
    { id: '2', config: { sex: 'woman', glassesStyle: 'none', hatStyle: 'none', faceColor: '#f5a623', hairColor: '#000000', hairStyle: 'womanLong', eyeStyle: 'circle', earSize: 'small', noseStyle: 'short', mouthStyle: 'smile', shirtStyle: 'hoody', shirtColor: '#0081ff', bgColor: '#dfe6e9' } },
    { id: '3', config: { sex: 'man', glassesStyle: 'none', hatStyle: 'none', faceColor: '#f5a623', hairColor: '#000000', hairStyle: 'mohawk', earSize: 'small', eyeStyle: 'circle', noseStyle: 'short', mouthStyle: 'smile', shirtStyle: 'hoody', shirtColor: '#0081ff', bgColor: '#b2bec3' } },
    { id: '4', config: { sex: 'woman', glassesStyle: 'none', hatStyle: 'none', faceColor: '#f5a623', hairColor: '#000000', hairStyle: 'womanShort', eyeStyle: 'circle', earSize: 'small', noseStyle: 'short', mouthStyle: 'smile', shirtStyle: 'hoody', shirtColor: '#0081ff', bgColor: '#636e72' } },
  ];

  const handleOptionChange = (optionType, options) => () => {
    const currentIndex = options.indexOf(config[optionType]);
    const nextIndex = (currentIndex + 1) % options.length;
    setConfig((prev) => ({
      ...prev,
      [optionType]: options[nextIndex],
    }));
  };

  const handleUploadAvatar = async () => {
    try {
      const response = await axios.post(setAvatarRoute(userId), {
        newConfig: config
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.message === 'Success') {
        localStorage.setItem('isAvatarSet', 'true');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleSelectAvatar = (avatarConfig) => {
    setConfig(avatarConfig);
    setSelectedAvatar(avatarConfig);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-white">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <ReactNiceAvatar
              {...config}
              className="avatar-svg w-64 h-64 shadow-lg rounded-full transition-transform transform hover:scale-105"
            />
            <button
              onClick={handleUploadAvatar}
              className="mt-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full flex items-center space-x-2"
            >
              <FaUpload size={20} />
              <span>Upload Avatar</span>
            </button>
          </div>

          {/* Controls Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {/* Hair Style */}
            <button
              onClick={handleOptionChange('hairStyle', ['normal', 'thick', 'mohawk', 'womanLong', 'womanShort'])}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Hair Style"
            >
              <GiHairStrands size={24} />
            </button>

            {/* Hat Style */}
            <button
              onClick={handleOptionChange('hatStyle', ['beanie', 'turban', 'none'])}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Hat Style"
            >
              <MdFace size={24} />
            </button>

            {/* Glasses Style */}
            <button
              onClick={handleOptionChange('glassesStyle', ['round', 'square', 'none'])}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Glasses Style"
            >
              <IoMdGlasses size={24} />
            </button>

            {/* Gender / Sex */}
            <button
              onClick={handleOptionChange('sex', ['man', 'woman'])}
              className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Gender"
            >
              <FaVenusMars size={24} />
            </button>

            {/* Ear Size */}
            <button 
              onClick={handleOptionChange('earSize', ['small', 'big'])}
              className="bg-yellow-500 hover:bg-yellow-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Ear Size"
            >
              <FaEarListen size={24} />
            </button>

            {/* Eye Style */}
            <button 
              onClick={handleOptionChange('eyeStyle', ['circle', 'oval', 'smile'])}
              className="bg-gray-500 hover:bg-gray-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Eye Style"
            >
              <FaEye size={24} />
            </button>

            {/* Nose Style */}
            <button 
              onClick={handleOptionChange('noseStyle', ['short', 'long', 'round'])}
              className="bg-pink-500 hover:bg-pink-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Nose Style"
            >
              <GiNoseFront size={24} />
            </button>

            {/* Mouth Style */}
            <button 
              onClick={handleOptionChange('mouthStyle', ['laugh', 'smile', 'peace'])}
              className="bg-red-500 hover:bg-red-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Mouth Style"
            >
              <FaPalette size={24} />
            </button>

            {/* Shirt Style */}
            <button 
              onClick={handleOptionChange('shirtStyle', ['hoody', 'short', 'polo'])}
              className="bg-blue-500 hover:bg-blue-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Shirt Style"
            >
              <GiTShirt size={24} />
            </button>

            {/* Eyebrow Style */}
            <button 
              onClick={handleOptionChange('eyeBrowStyle', ['up', 'upWoman'])}
              className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Eyebrow Style"
            >
              <FaPencilAlt size={24} />
            </button>

            {/* Face Color */}
            <button 
              onClick={handleOptionChange('faceColor', ['#f5a623', '#8b572a', '#7ed321', '#d0021b', '#4a90e2'])}
              className="bg-orange-500 hover:bg-orange-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Face Color"
            >
              <FaPalette size={24} />
            </button>

            {/* Hair Color */}
            <button 
              onClick={handleOptionChange('hairColor', ['#000000', '#ffffff', '#f5a623', '#4a90e2', '#9013fe'])}
              className="bg-purple-500 hover:bg-purple-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Hair Color"
            >
              <FaPalette size={24} />
            </button>

            {/* Hat Color */}
            <button 
              onClick={handleOptionChange('hatColor', ['#ffffff', '#000000', '#4a90e2', '#f5a623', '#9013fe'])}
              className="bg-teal-500 hover:bg-teal-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Hat Color"
            >
              <FaPalette size={24} />
            </button>

            {/* Shirt Color */}
            <button 
              onClick={handleOptionChange('shirtColor', ['#0081ff', '#f5a623', '#9013fe', '#4a90e2', '#000000'])}
              className="bg-indigo-500 hover:bg-indigo-700 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Shirt Color"
            >
              <FaPalette size={24} />
            </button>

            {/* Background Color */}
            <button 
              onClick={handleOptionChange('bgColor', ['#eeeeee', '#dfe6e9', '#b2bec3', '#636e72', '#2d3436'])}
              className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-lg flex flex-col items-center justify-center"
              title="Background Color"
            >
              <FaImage size={24} />
            </button>
          </div>

          {/* Pre-Built Avatars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {preBuiltAvatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => handleSelectAvatar(avatar.config)}
                className={`relative p-2 rounded-full shadow-xl transition-transform hover:scale-105 ${
                  selectedAvatar === avatar.config ? 'border-4 border-blue-500' : 'border-2 border-gray-300'
                }`}
                title="Select Pre-built Avatar"
              >
                <ReactNiceAvatar
                  {...avatar.config}
                  className="w-20 h-20 rounded-full"
                />
              </button>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AvatarCustomizer;
