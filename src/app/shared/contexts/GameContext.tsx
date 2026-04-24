import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextType {
  selectedGame: string;
  setSelectedGame: (gameId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [selectedGame, setSelectedGame] = useState('gta-vi');

  return (
    <GameContext.Provider value={{
      selectedGame,
      setSelectedGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 