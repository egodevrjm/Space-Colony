// src/components/Build.js
import React from 'react';
import GameIcons from './GameIcons';

const Build = ({ BUILDING_TYPES, selectedBuilding, setSelectedBuilding }) => {
  return (
    <div className="bg-gray-900 bg-opacity-75 rounded-lg p-6 shadow-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Build</h2>
      <div className="grid grid-cols-2 gap-3">
        {BUILDING_TYPES.map(({ type, cost }) => (
          <button 
            key={type}
            className={`px-3 py-2 rounded flex items-center justify-center ${selectedBuilding === type ? 'bg-blue-600' : 'bg-blue-500'} hover:bg-blue-400 transition-all duration-200 transform hover:scale-105`}
            onClick={() => setSelectedBuilding(type)}
          >
            <span className="mr-2 text-2xl">{GameIcons[type]}</span>
            <span className="capitalize">{type} ({cost} materials)</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Build;
