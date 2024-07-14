// src/components/ResourceDetails.js
import React from 'react';

const ResourceDetails = ({
  calculateResourceProduction,
  calculateResourceConsumption,
  showResourceDetails,
  setShowResourceDetails
}) => {
  return (
    <>
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
    </>
  );
};

export default ResourceDetails;
