// src/components/ColonyStatus.js
import React from 'react';
import GameIcons from './GameIcons';

const ColonyStatus = ({
  PHASES,
  currentPhase,
  turn,
  colonists,
  resources,
  happiness,
  health,
  showResourceDetails,
  setShowResourceDetails,
  calculateResourceProduction,
  calculateResourceConsumption,
}) => {
  return (
    <div className="bg-gray-900 bg-opacity-75 rounded-lg p-6 shadow-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Colony Status</h2>
      <p className="text-lg mb-2">Phase: <span className="text-yellow-300">{PHASES[currentPhase]}</span></p>
      <p className="text-lg mb-2">Turn: <span className="text-yellow-300">{turn}</span></p>
      <p className="flex items-center text-lg mb-2">
        <span className="mr-2 text-2xl">👥</span> Colonists: {colonists.total}
        (<span className="text-purple-300">🧑‍🔬 {colonists.scientists}</span> |
        <span className="text-yellow-300">🧑‍🔧 {colonists.engineers}</span> |
        <span className="text-red-300">🧑‍⚕️ {colonists.medics}</span>)
      </p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {Object.entries(resources).map(([resource, amount]) => (
          <div key={resource} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <span className="text-2xl mr-2">{GameIcons[resource]}</span>
            <span className="text-lg">{resource.charAt(0).toUpperCase() + resource.slice(1)}: {amount}</span>
          </div>
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded w-full"
        onClick={() => setShowResourceDetails(!showResourceDetails)}
      >
        {showResourceDetails ? "Hide" : "Show"} Resource Details
      </button>
      {showResourceDetails && (
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <h3 className="font-bold mb-2">Production per Turn:</h3>
          {Object.entries(calculateResourceProduction()).map(([resource, amount]) => (
            <p key={resource}>{resource.charAt(0).toUpperCase() + resource.slice(1)}: +{amount}</p>
          ))}
          <h3 className="font-bold mt-4 mb-2">Consumption per Turn:</h3>
          {Object.entries(calculateResourceConsumption()).map(([resource, amount]) => (
            <p key={resource}>{resource.charAt(0).toUpperCase() + resource.slice(1)}: -{amount}</p>
          ))}
        </div>
      )}
      <div className="mt-4 space-y-2">
        <div>
          <p className="flex items-center mb-1">
            <span className="mr-2 text-2xl">😊</span> Happiness:
          </p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-green-600 h-4 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${happiness}%` }}></div>
          </div>
        </div>
        <div>
          <p className="flex items-center mb-1">
            <span className="mr-2 text-2xl">❤️</span> Health:
          </p>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-red-600 h-4 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${health}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColonyStatus;
