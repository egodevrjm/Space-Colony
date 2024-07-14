// src/components/ColonyMap.js
import React from 'react';
import GameIcons from './GameIcons';

const ColonyMap = ({ grid, placeBuilding }) => {
  return (
    <div className="lg:col-span-2 bg-gray-900 bg-opacity-75 rounded-lg p-6 shadow-lg border border-blue-500">
      <h2 className="text-2xl font-bold mb-4 text-blue-300">Colony Map</h2>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="aspect-square border border-gray-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
              onClick={() => placeBuilding(rowIndex, colIndex)}
            >
              {GameIcons[cell]}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default ColonyMap;
