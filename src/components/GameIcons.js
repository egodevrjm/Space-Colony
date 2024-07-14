import React from 'react';

const GameIcons = {
  empty: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  oxygen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00BFFF" strokeWidth="2">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  food: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#32CD32" strokeWidth="2">
      <path d="M12 3v18M3 12h18M5 5l14 14M19 5L5 19" />
    </svg>
  ),
  energy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  habitat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#FF69B4" strokeWidth="2">
      <path d="M3 12l9-9 9 9M5 10v10h14V10" />
      <path d="M12 10v10M9 21v-7h6v7" />
    </svg>
  ),
  research: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#9370DB" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-5.2-5.2" />
    </svg>
  ),
  defense: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#FF4500" strokeWidth="2">
      <path d="M12 2L3 7v6a12 12 0 0 0 18 0V7L12 2z" />
    </svg>
  ),
  medical: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#FF6347" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  entertainment: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#1E90FF" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  ),
  rocky: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2">
      <path d="M3 12l3-3 3 3 3-3 3 3 3-3 3 3M3 18l3-3 3 3 3-3 3 3 3-3 3 3" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 24 24" fill="none" stroke="#4169E1" strokeWidth="2">
      <path d="M3 15c2.5-2.5 6.5-2.5 9 0s6.5 2.5 9 0M3 20c2.5-2.5 6.5-2.5 9 0s6.5 2.5 9 0" />
    </svg>
  ),
};

export default GameIcons;