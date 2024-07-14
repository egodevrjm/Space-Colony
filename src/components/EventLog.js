// src/components/EventLog.js
import React from 'react';

const EventLog = ({ message, nextTurn }) => {
  return (
    <div className="mt-6 bg-gray-900 bg-opacity-75 p-4 rounded-lg shadow-lg border border-blue-500 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
      <div className="w-full sm:w-auto">
        <p className="font-bold text-blue-300 mb-2">Event Log:</p>
        <p>{message}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
        <button 
          className="px-6 py-3 bg-blue-500 hover:bg-blue-400 rounded text-lg font-bold transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
          onClick={nextTurn}
        >
          Next Turn
        </button>
      </div>
    </div>
  );
};

export default EventLog;
