import React, { useState, useEffect } from 'react';
import GameIcons from './GameIcons';
import 'tailwindcss/tailwind.css';

import ColonyStatus from './ColonyStatus';
import ColonyMap from './ColonyMap';
import ResourceDetails from './ResourceDetails';
import Tutorial from './Tutorial';
import Research from './Research';
import Build from './Build';
import RecruitColonists from './RecruitColonists';
import Missions from './Missions';
import Disasters from './Disasters';
import EventLog from './EventLog';

const GRID_SIZE = 10;
const BUILDING_TYPES = [
  { type: 'oxygen', cost: 20 },
  { type: 'food', cost: 20 },
  { type: 'energy', cost: 20 },
  { type: 'habitat', cost: 30 },
  { type: 'research', cost: 50 },
  { type: 'defense', cost: 40 },
  { type: 'medical', cost: 50 },
  { type: 'entertainment', cost: 60 }
];
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
    if (selectedBuilding) {
      const building = BUILDING_TYPES.find(b => b.type === selectedBuilding);
      const cost = techs.rapidConstruction ? building.cost * 0.75 : building.cost;
      if (resources.materials >= cost) {
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
    <div className="min-h-screen bg-cover bg-center text-white p-6 flex flex-col overflow-auto relative" style={{ backgroundImage: "url('/space-background.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-center text-blue-300 tracking-wider">
          Exodus: The Last Colony
        </h1>

        {showTutorial && (
          <Tutorial
            tutorialSteps={tutorialSteps}
            tutorialStep={tutorialStep}
            setTutorialStep={setTutorialStep}
            setShowTutorial={setShowTutorial}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <ColonyStatus
            PHASES={PHASES}
            currentPhase={currentPhase}
            turn={turn}
            colonists={colonists}
            resources={resources}
            happiness={happiness}
            health={health}
            showResourceDetails={showResourceDetails}
            setShowResourceDetails={setShowResourceDetails}
            calculateResourceProduction={calculateResourceProduction}
            calculateResourceConsumption={calculateResourceConsumption}
          />

          <ColonyMap grid={grid} placeBuilding={placeBuilding} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Research
            TECHS={TECHS}
            techs={techs}
            researchTech={researchTech}
            showTechInfo={showTechInfo}
            setShowTechInfo={setShowTechInfo}
          />
          <Build
            BUILDING_TYPES={BUILDING_TYPES}
            selectedBuilding={selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
          />
          <RecruitColonists addColonist={addColonist} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Missions missions={missions} startMission={startMission} />
          <Disasters disasters={disasters} />
        </div>

        <EventLog message={message} nextTurn={nextTurn} />
      </div>
    </div>
  );
};

export default ExodusGame;
