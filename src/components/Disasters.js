// src/components/Disasters.js
import React from 'react';

const Disasters = ({ disasters }) => {
  return (
    <div className="bg-gray-900 bg-opacity-75 rounded-lg p-6 shadow-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Disasters</h2>
      {disasters.length > 0 ? (
        disasters.map((disaster, index) => (
          <div key={index} className="bg-red-900 p-3 rounded mb-2">
            <p className="font-bold">{disaster.type} - {disaster.duration} turns left</p>
            <p>Health: {disaster.effect.health}/turn, Happiness: {disaster.effect.happiness}/turn</p>
          </div>
        ))
      ) : (
        <p>No active disasters</p>
      )}
    </div>
  );
};

export default Disasters;
