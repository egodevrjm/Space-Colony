import React, { useState, useEffect } from 'react';
import GameIcons from './GameIcons';

const GRID_SIZE = 10;
const BUILDING_TYPES = ['oxygen', 'food', 'energy', 'habitat', 'research', 'defense', 'medical', 'entertainment'];
const PHASES = ['Establishment', 'Expansion', 'Crisis', 'Preparation', 'Final Stand'];
const TECHS = {
  advancedFarming: { name: 'Advanced Farming', effect: 'Increases food production by 50%', cost: 50 },
  improvedOxygenation: { name: 'Improved Oxygenation', effect: 'Increases oxygen production by 50%', cost: 50 },
  efficientEnergy: { name: 'Efficient Energy', effect: 'Increases energy production by 50%', cost: 50 },
  rapidConstruction: { name: 'Rapid Construction', effect: 'Reduces building cost by 25%', cost: 75 },
  advancedRecycling: { name: 'Advanced Recycling', effect: 'Reduces resource consumption by 20%', cost: 100 },
  medicalBreakthrough: { name: 'Medical Breakthrough', effect: 'Improves colonist health and lifespan', cost: 150 },
  aiAssistants: { name: 'AI Assistants', effect: 'Increases overall efficiency by 10%', cost: 200 },
  quantumComputing: { name: 'Quantum Computing', effect: 'Doubles research output', cost: 250 },
};

const EVENTS = [
  { name: 'Meteor Shower', effect: { oxygen: -20, energy: -15, buildings: 'damage' }, symbol: '☄️' },
  { name: 'Solar Flare', effect: { energy: 30, electronics: 'damage' }, symbol: '☀️' },
  { name: 'Alien Microbes', effect: { food: -25, health: -10 }, symbol: '🦠' },
  { name: 'Resource Cache', effect: { oxygen: 15, food: 15, energy: 15 }, symbol: '📦' },
  { name: 'Cosmic Storm', effect: { oxygen: -10, energy: -10, morale: -5 }, symbol: '🌪️' },
  { name: 'Alien Artifact Discovery', effect: { research: 50, morale: 10 }, symbol: '🏺' },
];

const getRandomTerrain = () => {
  const terrainTypes = ['empty', 'rocky', 'water'];
  return terrainTypes[Math.floor(Math.random() * terrainTypes.length)];
};

const getBuildingIcon = (building) => {
  return GameIcons[building] || GameIcons.empty;
};

const ExodusGame = () => {
  const [resources, setResources] = useState({ oxygen: 100, food: 100, energy: 100, research: 0, materials: 50 });
  const [colonists, setColonists] = useState({ total: 5, scientists: 0, engineers: 0, medics: 0 });
  const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null).map(() => getRandomTerrain())));
  const [turn, setTurn] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [message, setMessage] = useState('Welcome to Exodus: The Last Colony');
  const [techs, setTechs] = useState(Object.fromEntries(Object.keys(TECHS).map(tech => [tech, false])));
  const [happiness, setHappiness] = useState(100);
  const [health, setHealth] = useState(100);
  const [showTechInfo, setShowTechInfo] = useState(false);
  const [missions, setMissions] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showResourceDetails, setShowResourceDetails] = useState(false);

  const tutorialSteps = [
    "Welcome to Exodus: The Last Colony! Your mission is to build a thriving colony on this alien planet.",
    "Start by placing oxygen generators, food farms, and energy plants to sustain your colonists.",
    "Recruit more colonists to grow your colony, but make sure you have enough resources to support them.",
    "Research new technologies to improve your colony's efficiency and unlock new buildings.",
    "Be prepared for random events and disasters. They can help or harm your colony.",
    "Complete missions to gain additional resources and advance through the game phases.",
    "Good luck, Administrator! The fate of humanity rests in your hands."
  ];

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const calculateResourceProduction = () => {
    return {
      oxygen: calculateProduction('oxygen'),
      food: calculateProduction('food'),
      energy: calculateProduction('energy'),
      research: calculateProduction('research'),
      materials: calculateProduction('materials')
    };
  };

  const calculateResourceConsumption = () => {
    return {
      oxygen: calculateConsumption('oxygen'),
      food: calculateConsumption('food'),
      energy: calculateConsumption('energy'),
      materials: calculateConsumption('materials')
    };
  };

  const nextTurn = () => {
    setTurn(prevTurn => prevTurn + 1);
    updateResources();
    handleRandomEvent();
    checkPhaseProgression();
    updateHappiness();
    updateHealth();
    manageMissions();
    manageDisasters();
  };

  const updateResources = () => {
    setResources(prev => ({
      oxygen: Math.max(0, prev.oxygen + calculateProduction('oxygen') - calculateConsumption('oxygen')),
      food: Math.max(0, prev.food + calculateProduction('food') - calculateConsumption('food')),
      energy: Math.max(0, prev.energy + calculateProduction('energy') - calculateConsumption('energy')),
      research: prev.research + calculateProduction('research'),
      materials: prev.materials + calculateProduction('materials') - calculateConsumption('materials'),
    }));
  };

  const calculateProduction = (resourceType) => {
    let production = grid.flat().filter(cell => cell === resourceType).length * 2;
    if (resourceType === 'food' && techs.advancedFarming) production *= 1.5;
    if (resourceType === 'oxygen' && techs.improvedOxygenation) production *= 1.5;
    if (resourceType === 'energy' && techs.efficientEnergy) production *= 1.5;
    if (resourceType === 'research') production += colonists.scientists * 2;
    if (techs.aiAssistants) production *= 1.1;
    if (resourceType === 'research' && techs.quantumComputing) production *= 2;
    return Math.floor(production);
  };

  const calculateConsumption = (resourceType) => {
    let consumption = colonists.total;
    if (resourceType === 'energy') {
      consumption += grid.flat().filter(cell => cell !== null).length;
    }
    if (techs.advancedRecycling) {
      consumption *= 0.8;
    }
    return Math.floor(consumption);
  };

  const placeBuilding = (row, col) => {
    if (selectedBuilding && resources.materials >= 20) {
      const cost = techs.rapidConstruction ? 15 : 20;
      const newGrid = [...grid];
      newGrid[row] = [...newGrid[row]];
      newGrid[row][col] = selectedBuilding;
      setGrid(newGrid);
      setResources(prev => ({
        ...prev,
        materials: prev.materials - cost
      }));
      setMessage(`${selectedBuilding.charAt(0).toUpperCase() + selectedBuilding.slice(1)} building placed!`);
    } else {
      setMessage('Not enough materials to build!');
    }
  };

  const handleRandomEvent = () => {
    if (Math.random() < 0.15) {
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      setResources(prev => {
        const newResources = { ...prev };
        Object.entries(event.effect).forEach(([resource, amount]) => {
          if (typeof amount === 'number') {
            newResources[resource] = Math.max(0, newResources[resource] + amount);
          }
        });
        return newResources;
      });
      if (event.effect.buildings === 'damage') {
        damageRandomBuilding();
      }
      if (event.effect.health) {
        setHealth(prev => Math.max(0, Math.min(100, prev + event.effect.health)));
      }
      if (event.effect.morale) {
        setHappiness(prev => Math.max(0, Math.min(100, prev + event.effect.morale)));
      }
      setMessage(`Event: ${event.name} ${event.symbol}`);
    }
  };

  const damageRandomBuilding = () => {
    const flatGrid = grid.flat();
    const buildings = flatGrid.filter(cell => cell !== null);
    if (buildings.length > 0) {
      const randomIndex = Math.floor(Math.random() * buildings.length);
      const newGrid = [...grid];
      const rowIndex = Math.floor(randomIndex / GRID_SIZE);
      const colIndex = randomIndex % GRID_SIZE;
      newGrid[rowIndex][colIndex] = null;
      setGrid(newGrid);
      setMessage('A building was damaged and destroyed!');
    }
  };

  const checkPhaseProgression = () => {
    if (currentPhase < PHASES.length - 1) {
      if (
        (currentPhase === 0 && colonists.total >= 20) ||
        (currentPhase === 1 && resources.research >= 100) ||
        (currentPhase === 2 && Object.values(techs).filter(Boolean).length >= 5) ||
        (currentPhase === 3 && colonists.total >= 50)
      ) {
        setCurrentPhase(prev => prev + 1);
        setMessage(`Entering new phase: ${PHASES[currentPhase + 1]}`);
      }
    }
  };

  const researchTech = (tech) => {
    if (resources.research >= TECHS[tech].cost && !techs[tech]) {
      setTechs(prev => ({ ...prev, [tech]: true }));
      setResources(prev => ({ ...prev, research: prev.research - TECHS[tech].cost }));
      setMessage(`Researched: ${TECHS[tech].name}`);
    } else {
      setMessage('Not enough research points or technology already researched!');
    }
  };

  const updateHappiness = () => {
    const resourceScarcity = Object.values(resources).some(value => value < 20);
    const overcrowding = colonists.total > grid.flat().filter(cell => cell === 'habitat').length * 5;
    const entertainment = grid.flat().filter(cell => cell === 'entertainment').length;
    let happinessChange = 0;
    if (resourceScarcity) happinessChange -= 5;
    if (overcrowding) happinessChange -= 5;
    happinessChange += entertainment;
    if (!resourceScarcity && !overcrowding) happinessChange += 1;
    setHappiness(prev => Math.max(0, Math.min(100, prev + happinessChange)));
  };

  const updateHealth = () => {
    const medicalCapacity = grid.flat().filter(cell => cell === 'medical').length * 10;
    const healthChange = medicalCapacity >= colonists.total ? 1 : -1;
    setHealth(prev => Math.max(0, Math.min(100, prev + healthChange)));
  };

  const addColonist = (type = 'general') => {
    if (resources.food >= 10 && resources.oxygen >= 10) {
      setColonists(prev => ({
        ...prev,
        total: prev.total + 1,
        [type]: (prev[type] || 0) + 1
      }));
      setResources(prev => ({ ...prev, food: prev.food - 10, oxygen: prev.oxygen - 10 }));
      setMessage(`New ${type} colonist added!`);
    } else {
      setMessage('Not enough resources to add a colonist!');
    }
  };

  const startMission = (type) => {
    const newMission = { type, duration: 5, rewards: { research: 20, materials: 15 } };
    setMissions(prev => [...prev, newMission]);
    setMessage(`Started new ${type} mission!`);
  };

  const manageMissions = () => {
    setMissions(prev => {
      const updatedMissions = prev.map(mission => ({ ...mission, duration: mission.duration - 1 }));
      const completedMissions = updatedMissions.filter(mission => mission.duration <= 0);
      completedMissions.forEach(mission => {
        setResources(prev => ({
          ...prev,
          research: prev.research + mission.rewards.research,
          materials: prev.materials + mission.rewards.materials
        }));
        setMessage(`${mission.type} mission completed! Gained resources.`);
      });
      return updatedMissions.filter(mission => mission.duration > 0);
    });
  };

  const manageDisasters = () => {
    if (Math.random() < 0.01 && disasters.length < 3) {
      const newDisaster = { type: 'Alien Invasion', duration: 10, effect: { health: -2, happiness: -2 } };
      setDisasters(prev => [...prev, newDisaster]);
      setMessage(`New disaster: ${newDisaster.type}! Defend the colony!`);
    }

    setDisasters(prev => {
      const updatedDisasters = prev.map(disaster => {
        setHealth(h => Math.max(0, h + disaster.effect.health));
        setHappiness(h => Math.max(0, h + disaster.effect.happiness));
        return { ...disaster, duration: disaster.duration - 1 };
      });
      const resolvedDisasters = updatedDisasters.filter(disaster => disaster.duration <= 0);
      resolvedDisasters.forEach(disaster => {
        setMessage(`${disaster.type} has been resolved!`);
      });
      return updatedDisasters.filter(disaster => disaster.duration > 0);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 md:p-6 flex flex-col overflow-auto bg-[url('/space-background.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center text-blue-300 tracking-wider">
          Exodus: The Last Colony
        </h1>

        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 p-4 sm:p-6 md:p-8 rounded-lg max-w-lg sm:max-w-xl md:max-w-2xl w-full">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Tutorial</h2>
              <p className="mb-4 text-sm sm:text-base">{tutorialSteps[tutorialStep]}</p>
              <div className="flex justify-between items-center">
                <button 
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm sm:text-base"
                  onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                  disabled={tutorialStep === 0}
                >
                  Previous
                </button>
                <span className="text-sm sm:text-base">{tutorialStep + 1} / {tutorialSteps.length}</span>
                <button 
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-400 rounded text-sm sm:text-base"
                  onClick={nextTutorialStep}
                >
                  {tutorialStep < tutorialSteps.length - 1 ? "Next" : "Start Game"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-gray-800 bg-opacity-75 rounded-lg p-4 sm:p-6 shadow-lg border border-blue-500 backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">Colony Status</h2>
            <p className="text-base sm:text-lg mb-2">Phase: <span className="text-yellow-300">{PHASES[currentPhase]}</span></p>
            <p className="text-base sm:text-lg mb-2">Turn: <span className="text-yellow-300">{turn}</span></p>
            <p className="flex items-center text-base sm:text-lg mb-2">
              <span className="mr-2 text-xl sm:text-2xl">👥</span> Colonists: {colonists.total} 
              (<span className="text-purple-300">🧑‍🔬 {colonists.scientists}</span> | 
              <span className="text-yellow-300">🧑‍🔧 {colonists.engineers}</span> | 
              <span className="text-red-300">🧑‍⚕️ {colonists.medics}</span>)
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4">
              {Object.entries(resources).map(([resource, amount]) => (
                <div key={resource} className="bg-gray-700 rounded-lg p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-xl sm:text-2xl mr-2">{getBuildingIcon(resource)}</span>
                  <span className="text-base sm:text-lg">{amount}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-4 px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-400 rounded w-full text-sm sm:text-base"
              onClick={() => setShowResourceDetails(!showResourceDetails)}
            >
              {showResourceDetails ? "Hide" : "Show"} Resource Details
            </button>
            {showResourceDetails && (
              <div className="mt-4 bg-gray-700 rounded-lg p-3 sm:p-4 text-sm sm:text-base">
                <h3 className="font-bold mb-2">Production per Turn:</h3>
                {Object.entries(calculateResourceProduction()).map(([resource, amount]) => (
                  <p key={resource}>{resource}: +{amount}</p>
                ))}
                <h3 className="font-bold mt-4 mb-2">Consumption per Turn:</h3>
                {Object.entries(calculateResourceConsumption()).map(([resource, amount]) => (
                  <p key={resource}>{resource}: -{amount}</p>
                ))}
              </div>
            )}
            <div className="mt-4 space-y-2">
              <div>
                <p className="flex items-center mb-1 text-sm sm:text-base">
                  <span className="mr-2 text-xl sm:text-2xl">😊</span> Happiness: 
                </p>
                <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4">
                  <div className="bg-green-600 h-3 sm:h-4 rounded-full transition-all duration-500 ease-in-out" style={{width: `${happiness}%`}}></div>
                </div>
              </div>
              <div>
                <p className="flex items-center mb-1 text-sm sm:text-base">
                  <span className="mr-2 text-xl sm:text-2xl">❤️</span> Health: 
                </p>
                <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4">
                  <div className="bg-red-600 h-3 sm:h-4 rounded-full transition-all duration-500 ease-in-out" style={{width: `${health}%`}}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-gray-800 bg-opacity-75 rounded-lg p-4 sm:p-6 shadow-lg border border-blue-500 backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">Colony Map</h2>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1">
              {grid.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="aspect-square border border-gray-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all duration-200 transform hover:scale-110"
                    onClick={() => placeBuilding(rowIndex, colIndex)}
                  >
                    {getBuildingIcon(cell)}
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-gray-800 bg-opacity-75 rounded-lg p-4 sm:p-6 shadow-lg border border-blue-500 backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">Research</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {Object.entries(TECHS).map(([tech, { name, effect, cost }]) => (
                <button 
                  key={tech}
                  className={`px-2 py-1 sm:px-3 sm:py-2 rounded ${techs[tech] ? 'bg-green-600' : 'bg-green-500'} hover:bg-green-400 text-left transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm`}
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
              className="mt-4 px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-400 rounded transition-all duration-200 transform hover:scale-105 w-full text-sm sm:text-base"
              onClick={() => setShowTechInfo(!showTechInfo)}
            >
              {showTechInfo ? '🔼 Hide' : '🔽 Show'} Tech Info
            </button>
          </div>
          
          <div className="bg-gray-800 bg-opacity-75 rounded-lg p-4 sm:p-6 shadow-lg border border-blue-500 backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">Build</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {BUILDING_TYPES.map(type => (
                <button 
                  key={type}
                  className={`px-2 py-1 sm:px-3 sm:py-2 rounded flex items-center justify-center ${selectedBuilding === type ? 'bg-blue-600' : 'bg-blue-500'} hover:bg-blue-400 transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm`}
                  onClick={() => setSelectedBuilding(type)}
                >
                  <span className="mr-1 sm:mr-2 text-xl sm:text-2xl">{getBuildingIcon(type)}</span>
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-75 rounded-lg p-4 sm:p-6 shadow-lg border border-blue-500 backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">Recruit Colonists</h2>
            <div className="space-y-2 sm:space-y-3">
              <button 
                className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-green-400 transition-all duration-200 transform hover:scale-105 w-full text-xs sm:text-sm"
                onClick={() => addColonist('general')}
              >
                Add General Colonist (10 food, 10 oxygen)
              </button>
              <button 
                className="bg-purple-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-purple-400 transition-all duration-200 transform hover:scale-105 w-full text-xs sm:text-sm"
                onClick={() => addColonist('scientist')}
              >
                Add Scientist (15 food, 15 oxygen)
              </button>
              <button 
                className="bg-yellow-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 w-full text-xs sm:text-sm"
                onClick={() => addColonist('engineer')}
              >
                Add Engineer (15 food, 15 oxygen)
              </button>
              <button 
                className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-400 transition-all duration-200 transform hover:scale-105 w-full text-xs sm:text-sm"
                onClick={() => addColonist('medic')}
              >
                Add Medic (15 food, 15 oxygen)
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="bg-gray-800 bg-opacity-75 rounded-lg p-4 sm:p-6 shadow-lg border border-blue-500 backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">Missions</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
              <button 
                className="flex-1 bg-indigo-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-indigo-400 transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm"
                onClick={() => startMission('Exploration')}
              >
                Start Exploration Mission
              </button>
              <button 
                className="flex-1 bg-pink-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-pink-400 transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm"
                onClick={() => startMission('Research')}
              >
                Start Research Mission
              </button>
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-2">Active Missions:</h3>
              {missions.length > 0 ? (
                missions.map((mission, index) => (
                  <div key={index} className="bg-gray-700 rounded p-2 mb-2 text-sm sm:text-base">
                    <p>{mission.type} - {mission.duration} turns left</p>
                  </div>
                ))
              ) : (
                <p className="text-sm sm:text-base">No active missions</p>
              )}
            </div>
          </div>
          
          <div className="bg-gray-800 bg-opacity-75 rounded-lg p-4 sm:p-6 shadow-lg border border-blue-500 backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-300">Disasters</h2>
            {disasters.length > 0 ? (
              disasters.map((disaster, index) => (
                <div key={index} className="bg-red-900 p-2 sm:p-3 rounded mb-2 sm:mb-3 text-sm sm:text-base">
                  <p className="font-bold">{disaster.type} - {disaster.duration} turns left</p>
                  <p>Health: {disaster.effect.health}/turn, Happiness: {disaster.effect.happiness}/turn</p>
                </div>
              ))
            ) : (
              <p className="text-sm sm:text-base">No active disasters</p>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-6 bg-gray-800 bg-opacity-75 p-3 sm:p-4 rounded-lg shadow-lg border border-blue-500 backdrop-filter backdrop-blur-sm flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="w-full sm:w-auto">
            <p className="font-bold text-blue-300 mb-1 sm:mb-2 text-sm sm:text-base">Event Log:</p>
            <p className="text-sm sm:text-base">{message}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button 
              className="px-3 py-1 sm:px-4 sm:py-2 bg-yellow-500 hover:bg-yellow-400 rounded text-black font-bold text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => setShowTutorial(true)}
            >
              Show Tutorial
            </button>
            <button 
              className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 hover:bg-blue-400 rounded text-base sm:text-lg font-bold transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
              onClick={nextTurn}
            >
              Next Turn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExodusGame;
