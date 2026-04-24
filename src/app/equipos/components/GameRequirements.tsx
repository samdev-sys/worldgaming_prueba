import React, { useState } from 'react';
import {
  Gamepad2,
  Star,
  Shield,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import DynamicModal from '../../shared/components/ui/DynamicModal';

interface GameRequirement {
  gameId: string;
  gameName: string;
  titulares: number;
  suplentes: number;
  totalPlayers: number;
}

interface AvailableGame {
  id: string;
  name: string;
  defaultTitulares: number;
  defaultSuplentes: number;
}

interface GameRequirementsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (requirements: GameRequirement[]) => void;
  currentRequirements: GameRequirement[];
  availableGames: AvailableGame[];
}

const GameRequirements: React.FC<GameRequirementsProps> = ({
  isOpen,
  onClose,
  onSave,
  currentRequirements,
  availableGames
}) => {
  const [requirements, setRequirements] = useState<GameRequirement[]>(currentRequirements);
  const [selectedGame, setSelectedGame] = useState<string>('');

  const handleAddRequirement = () => {
    if (!selectedGame) return;

    const game = availableGames.find(g => g.id === selectedGame);
    if (!game) return;

    const newRequirement: GameRequirement = {
      gameId: game.id,
      gameName: game.name,
      titulares: game.defaultTitulares,
      suplentes: game.defaultSuplentes,
      totalPlayers: game.defaultTitulares + game.defaultSuplentes
    };

    setRequirements(prev => [...prev, newRequirement]);
    setSelectedGame('');
  };

  const handleRemoveRequirement = (gameId: string) => {
    setRequirements(prev => prev.filter(req => req.gameId !== gameId));
  };

  const handleSave = () => {
    onSave(requirements);
    onClose();
  };

  const getAvailableGamesForSelection = () => {
    const usedGameIds = requirements.map(req => req.gameId);
    return availableGames.filter(game => !usedGameIds.includes(game.id));
  };

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar Juegos del Equipo"
      subtitle="Agrega los juegos en los que competirá tu equipo"
      icon={Gamepad2}
      iconColor="text-green-400"
      size="md"
    >
      <div className="p-6 space-y-6">
        {/* Agregar nuevo juego */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <Plus className="w-4 h-4 text-green-400" />
            <span>Agregar Juego</span>
          </h3>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="">Seleccionar juego...</option>
              {getAvailableGamesForSelection().map(game => (
                <option key={game.id} value={game.id} className="bg-gray-800">
                  {game.name} ({game.defaultTitulares}T + {game.defaultSuplentes}S)
                </option>
              ))}
            </select>
            
            <button
              onClick={handleAddRequirement}
              disabled={!selectedGame}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </div>
        </div>

        {/* Lista de requisitos configurados */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center space-x-2">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            <span>Juegos Configurados ({requirements.length})</span>
          </h3>
          
          {requirements.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p>No hay juegos configurados</p>
              <p className="text-sm">Agrega un juego para comenzar</p>
            </div>
          ) : (
            requirements.map((req) => (
              <div key={req.gameId} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{req.gameName}</h4>
                      <p className="text-white/60 text-sm">{req.totalPlayers} jugadores total</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemoveRequirement(req.gameId)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                {/* Información de requisitos (solo informativo) */}
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-center text-white/60 text-sm mb-2">
                    Requisitos configurados desde la gestión de juegos
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Titulares */}
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 border border-yellow-500/20">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium text-sm">Titulares</span>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-yellow-400">
                          {req.titulares}
                        </span>
                      </div>
                    </div>

                    {/* Suplentes */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-500/20">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-medium text-sm">Suplentes</span>
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-blue-400">
                          {req.suplentes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm">
            {requirements.length} juegos configurados
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </DynamicModal>
  );
};

export default GameRequirements;
