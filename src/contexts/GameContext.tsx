import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextType {
  cityName: string;
  setCityName: (name: string) => void;
  // Add other game state properties and methods here
}

const GameContext = createContext<GameContextType | null>(null);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return context;
};

interface GameContextProviderProps {
  children: ReactNode;
}

export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {
  const [cityName, setCityName] = useState('New City');

  return (
    <GameContext.Provider value={{ cityName, setCityName }}>
      {children}
    </GameContext.Provider>
  );
};