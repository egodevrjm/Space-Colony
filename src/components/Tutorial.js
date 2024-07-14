// src/components/Tutorial.js
import React from 'react';

const Tutorial = ({ tutorialSteps, tutorialStep, setTutorialStep, setShowTutorial }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Tutorial</h2>
        <p className="mb-4">{tutorialSteps[tutorialStep]}</p>
        <div className="flex justify-between items-center">
          <button 
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
            disabled={tutorialStep === 0}
          >
            Previous
          </button>
          <span>{tutorialStep + 1} / {tutorialSteps.length}</span>
          <button 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded"
            onClick={() => {
              if (tutorialStep < tutorialSteps.length - 1) {
                setTutorialStep(tutorialStep + 1);
              } else {
                setShowTutorial(false);
              }
            }}
          >
            {tutorialStep < tutorialSteps.length - 1 ? "Next" : "Close Tutorial"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
