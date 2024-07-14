// src/components/RecruitColonists.js
import React from 'react';

const RecruitColonists = ({ addColonist }) => {
  return (
    <div className="bg-gray-900 bg-opacity-75 rounded-lg p-6 shadow-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Recruit Colonists</h2>
      <div className="space-y-3">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition-all duration-200 transform hover:scale-105 w-full"
          onClick={() => addColonist('general')}
        >
          Add General Colonist (10 food, 10 oxygen)
        </button>
        <button 
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-400 transition-all duration-200 transform hover:scale-105 w-full"
          onClick={() => addColonist('scientist')}
        >
          Add Scientist (15 food, 15 oxygen)
        </button>
        <button 
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 w-full"
          onClick={() => addColonist('engineer')}
        >
          Add Engineer (15 food, 15 oxygen)
        </button>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition-all duration-200 transform hover:scale-105 w-full"
          onClick={() => addColonist('medic')}
        >
          Add Medic (15 food, 15 oxygen)
        </button>
      </div>
    </div>
  );
};

export default RecruitColonists;
