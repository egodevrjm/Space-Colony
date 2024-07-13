import React, { useState, useEffect } from 'react';
import { Zap, Droplet, Apple, Home, Flask, Users } from 'lucide-react';


const GRID_SIZE = 7;
const TICK_RATE = 1000; // 1 second

const BUILDING_COSTS = {
  'oxygen': { energy: 10 },
  'food': { energy: 15 },
  'energy': { food: 5 },
  'habitat': { oxygen: 10, food: 10, energy: 10 },
  'lab': { energy: 20, food: 10 },
};

const PRODUCTION_RATES = {
  'oxygen': 5,
  'food': 4,
  'energy': 6,
  'lab': 1, // research points
};

const EVENTS = [
  { name: 'Meteor Shower', effect: { oxygen: -10, energy: -15 }, message: 'A meteor shower has damaged some facilities!' },
  { name: 'Solar Flare', effect: { energy: 20 }, message: 'A solar flare has supercharged our energy systems!' },
  { name: 'Alien Fruit Discovery', effect: { food: 30 }, message: 'We have discovered a new edible alien fruit!' },
  { name: 'Cosmic Radiation', effect: { oxygen: -5 }, message: 'Cosmic radiation is affecting our oxygen systems.' },
];

const PHASES = {
  ESTABLISHMENT: 'Establishment',
  EXPANSION: 'Expansion',
  CRISIS: 'Crisis',
  PREPARATION: 'Preparation',
  ARRIVAL: 'Arrival',
};

const PHASE_OBJECTIVES = {
  [PHASES.ESTABLISHMENT]: 'Build basic infrastructure (2 of each resource building)',
  [PHASES.EXPANSION]: 'Reach 20 colonists and build a research lab',
  [PHASES.CRISIS]: 'Survive the impending crisis (not yet implemented)',
  [PHASES.PREPARATION]: 'Prepare for the refugees (not yet implemented)',
  [PHASES.ARRIVAL]: 'Welcome the last of humanity (not yet implemented)',
};

export const ExodusGame = () => {
  const [resources, setResources] = useState({ oxygen: 100, food: 100, energy: 100, research: 0 });
  const [colonists, setColonists] = useState(5);
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [message, setMessage] = useState('Welcome to Exodus: The Last Colony');
  const [currentPhase, setCurrentPhase] = useState(PHASES.ESTABLISHMENT);
  const [day, setDay] = useState(1);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      updateResources();
      handleRandomEvent();
      setDay(prevDay => prevDay + 1);
      checkPhaseProgression();
    }, TICK_RATE);

    return () => clearInterval(gameLoop);
  }, [resources, colonists, grid, currentPhase]);

  const updateResources = () => {
    setResources(prev => {
      const production = calculateProduction();
      const consumption = calculateConsumption();
      return {
        oxygen: Math.max(0, prev.oxygen + production.oxygen - consumption.oxygen),
        food: Math.max(0, prev.food + production.food - consumption.food),
        energy: Math.max(0, prev.energy + production.energy - consumption.energy),
        research: prev.research + production.research,
      };
    });
  };

  const calculateProduction = () => {
    return grid.flat().reduce((acc, cell) => {
      if (cell in PRODUCTION_RATES) {
        acc[cell === 'lab' ? 'research' : cell] += PRODUCTION_RATES[cell];
      }
      return acc;
    }, { oxygen: 0, food: 0, energy: 0, research: 0 });
  };

  const calculateConsumption = () => {
    return {
      oxygen: colonists,
      food: colonists,
      energy: colonists + grid.flat().filter(cell => cell !== null).length, // Buildings consume energy
    };
  };

  const placeBuilding = (row, col) => {
    if (selectedBuilding) {
      const cost = BUILDING_COSTS[selectedBuilding];
      if (Object.entries(cost).every(([resource, amount]) => resources[resource] >= amount)) {
        const newGrid = grid.map(row => [...row]);
        newGrid[row][col] = selectedBuilding;
        setGrid(newGrid);
        setResources(prev => {
          const newResources = { ...prev };
          Object.entries(cost).forEach(([resource, amount]) => {
            newResources[resource] -= amount;
          });
          return newResources;
        });
        setSelectedBuilding(null);
        setMessage(`${selectedBuilding} placed successfully!`);
      } else {
        setMessage('Not enough resources to build!');
      }
    }
  };

  const handleRandomEvent = () => {
    if (Math.random() < 0.05) { // 5% chance of event occurring
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      setResources(prev => {
        const newResources = { ...prev };
        Object.entries(event.effect).forEach(([resource, amount]) => {
          newResources[resource] = Math.max(0, newResources[resource] + amount);
        });
        return newResources;
      });
      setMessage(`Event: ${event.name}. ${event.message}`);
    }
  };

  const addColonist = () => {
    if (resources.oxygen >= 10 && resources.food >= 10) {
      setColonists(prev => prev + 1);
      setResources(prev => ({
        ...prev,
        oxygen: prev.oxygen - 10,
        food: prev.food - 10,
      }));
      setMessage('New colonist added!');
    } else {
      setMessage('Not enough resources to add colonist!');
    }
  };

  const checkPhaseProgression = () => {
    if (currentPhase === PHASES.ESTABLISHMENT) {
      const buildingCounts = grid.flat().reduce((acc, cell) => {
        if (cell) acc[cell] = (acc[cell] || 0) + 1;
        return acc;
      }, {});
      if (buildingCounts['oxygen'] >= 2 && buildingCounts['food'] >= 2 && buildingCounts['energy'] >= 2) {
        setCurrentPhase(PHASES.EXPANSION);
        setMessage('Phase complete! Entering Expansion phase.');
      }
    } else if (currentPhase === PHASES.EXPANSION) {
      if (colonists >= 20 && grid.flat().includes('lab')) {
        setCurrentPhase(PHASES.CRISIS);
        setMessage('Phase complete! Entering Crisis phase.');
      }
    }
    // Add more phase progression checks as needed
  };

  const getBuildingIcon = (building) => {
    switch (building) {
      case 'oxygen': return <Droplet className="w-8 h-8 text-blue-500" />;
      case 'food': return <Apple className="w-8 h-8 text-green-500" />;
      case 'energy': return <Zap className="w-8 h-8 text-yellow-500" />;
      case 'habitat': return <Home className="w-8 h-8 text-indigo-500" />;
      case 'lab': return <Flask className="w-8 h-8 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white p-4 flex flex-col">
      <h1 className="text-4xl font-bold mb-4 text-center text-blue-300">Exodus: The Last Colony</h1>
      
      <div className="flex-grow flex space-x-4">
        <div className="w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Colony Status</h2>
          <p className="mb-2">Day: {day}</p>
          <p className="mb-2">Phase: {currentPhase}</p>
          <p className="mb-4">Objective: {PHASE_OBJECTIVES[currentPhase]}</p>
          
          <h3 className="text-xl font-semibold mb-2 text-blue-300">Resources</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center"><Droplet className="w-5 h-5 mr-2 text-blue-500" /> Oxygen: {resources.oxygen}</div>
            <div className="flex items-center"><Apple className="w-5 h-5 mr-2 text-green-500" /> Food: {resources.food}</div>
            <div className="flex items-center"><Zap className="w-5 h-5 mr-2 text-yellow-500" /> Energy: {resources.energy}</div>
            <div className="flex items-center"><Flask className="w-5 h-5 mr-2 text-purple-500" /> Research: {resources.research}</div>
            <div className="flex items-center"><Users className="w-5 h-5 mr-2 text-indigo-500" /> Colonists: {colonists}</div>
          </div>
        </div>
        
        <div className="flex-grow bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="grid grid-cols-7 gap-1">
            {grid.map((row, rowIndex) => (
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square border border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-200`}
                  onClick={() => placeBuilding(rowIndex, colIndex)}
                >
                  {getBuildingIcon(cell)}
                </div>
              ))
            ))}
          </div>
        </div>
        
        <div className="w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Build</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(BUILDING_COSTS).map(([building, cost]) => (
              <button 
                key={building}
                className={`flex flex-col items-center justify-center p-2 rounded ${selectedBuilding === building ? 'bg-blue-600' : 'bg-blue-500'} hover:bg-blue-400 transition-colors duration-200`}
                onClick={() => setSelectedBuilding(building)}
              >
                {getBuildingIcon(building)}
                <span className="mt-1">{building}</span>
                <span className="text-xs">{Object.entries(cost).map(([r, a]) => `${a} ${r}`).join(', ')}</span>
              </button>
            ))}
          </div>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition-colors duration-200 mt-auto"
            onClick={addColonist}
          >
            Add Colonist (10 oxygen, 10 food)
          </button>
        </div>
      </div>
      
      <div className="mt-4 bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-2 text-blue-300">Event Log</h2>
        <div className="h-20 overflow-y-auto bg-gray-700 p-2 rounded">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ExodusGame;