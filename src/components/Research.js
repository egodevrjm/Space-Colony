// src/components/Research.js
import React from 'react';

const Research = ({ TECHS, techs, researchTech, showTechInfo, setShowTechInfo }) => {
  return (
    <div className="bg-gray-900 bg-opacity-75 rounded-lg p-6 shadow-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Research</h2>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(TECHS).map(([tech, { name, effect, cost }]) => (
          <button 
            key={tech}
            className={`px-3 py-2 rounded ${techs[tech] ? 'bg-green-600' : 'bg-green-500'} hover:bg-green-400 text-left transition-all duration-200 transform hover:scale-105`}
            onClick={() => researchTech(tech)}
            disabled={techs[tech]}
          >
            <div className="font-bold">{name}</div>
            <div>{cost} RP</div>
            {showTechInfo && <p className="mt-1">{effect}</p>}
          </button>
        ))}
      </div>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded transition-all duration-200 transform hover:scale-105 w-full"
        onClick={() => setShowTechInfo(!showTechInfo)}
      >
        {showTechInfo ? '🔼 Hide' : '🔽 Show'} Tech Info
      </button>
    </div>
  );
};

export default Research;
