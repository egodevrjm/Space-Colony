// src/components/Missions.js
import React from 'react';

const Missions = ({ missions, startMission }) => {
  return (
    <div className="bg-gray-900 bg-opacity-75 rounded-lg p-6 shadow-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Missions</h2>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
        <button 
          className="flex-1 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-400 transition-all duration-200 transform hover:scale-105"
          onClick={() => startMission('Exploration')}
        >
          Start Exploration Mission
        </button>
        <button 
          className="flex-1 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-400 transition-all duration-200 transform hover:scale-105"
          onClick={() => startMission('Research')}
        >
          Start Research Mission
        </button>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Active Missions:</h3>
        {missions.length > 0 ? (
          missions.map((mission, index) => (
            <div key={index} className="bg-gray-800 rounded p-3 mb-2">
              <p>{mission.type} - {mission.duration} turns left</p>
            </div>
          ))
        ) : (
          <p>No active missions</p>
        )}
      </div>
    </div>
  );
};

export default Missions;
