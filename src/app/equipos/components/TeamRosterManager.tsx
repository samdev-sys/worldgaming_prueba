import React, { useState } from 'react';
import {
  Users,
  Star,
  Shield,
  Plus,
  Minus,
  Gamepad2,
  UserPlus,
  Check,
  Search
} from 'lucide-react';
import DynamicModal from '../../shared/components/ui/DynamicModal';

interface Player {
  id: string;
  name: string;
  email: string;
  role: string;
  experience: number;
  isAvailable: boolean;
}

interface GameRequirement {
  gameId: string;
  gameName: string;
  titulares: number;
  suplentes: number;
  totalPlayers: number;
}

interface TeamRoster {
  gameId: string;
  gameName: string;
  titulares: Player[];
  suplentes: Player[];
}

interface TeamRosterManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roster: TeamRoster[]) => void;
  gameRequirements: GameRequirement[];
  availablePlayers: Player[];
  currentRoster: TeamRoster[];
}

const TeamRosterManager: React.FC<TeamRosterManagerProps> = ({
  isOpen,
  onClose,
  onSave,
  gameRequirements,
  availablePlayers,
  currentRoster
}) => {
  const [roster, setRoster] = useState<TeamRoster[]>(currentRoster);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [selectedPlayerType, setSelectedPlayerType] = useState<'titulares' | 'suplentes'>('titulares');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  // Inicializar roster si está vacío
  React.useEffect(() => {
    if (roster.length === 0 && gameRequirements.length > 0) {
      const initialRoster = gameRequirements.map(game => ({
        gameId: game.gameId,
        gameName: game.gameName,
        titulares: [],
        suplentes: []
      }));
      setRoster(initialRoster);
    }
  }, [gameRequirements, roster.length]);

  const handleAddPlayers = (gameId: string, type: 'titulares' | 'suplentes') => {
    const game = gameRequirements.find(g => g.gameId === gameId);
    if (!game) return;

    setSelectedGame(gameId);
    setSelectedPlayerType(type);
    setSelectedPlayerIds([]);
    setShowPlayerSelector(true);
  };

  const handlePlayerSelection = (players: Player[]) => {
    if (!selectedGame) return;

    setRoster(prev => prev.map(gameRoster => {
      if (gameRoster.gameId === selectedGame) {
        return {
          ...gameRoster,
          [selectedPlayerType]: [...gameRoster[selectedPlayerType], ...players]
        };
      }
      return gameRoster;
    }));

    setShowPlayerSelector(false);
  };

  const handleRemovePlayer = (gameId: string, type: 'titulares' | 'suplentes', playerId: string) => {
    setRoster(prev => prev.map(gameRoster => {
      if (gameRoster.gameId === gameId) {
        return {
          ...gameRoster,
          [type]: gameRoster[type].filter(player => player.id !== playerId)
        };
      }
      return gameRoster;
    }));
  };

  const handleSave = () => {
    onSave(roster);
    onClose();
  };

  const getAvailablePlayersForGame = (gameId: string) => {
    const gameRoster = roster.find(r => r.gameId === gameId);
    if (!gameRoster) return availablePlayers;

    const usedPlayerIds = [...gameRoster.titulares, ...gameRoster.suplentes].map(p => p.id);
    return availablePlayers.filter(player => !usedPlayerIds.includes(player.id));
  };

  const getMaxPlayersForSelection = () => {
    if (!selectedGame) return 0;
    const game = gameRequirements.find(g => g.gameId === selectedGame);
    if (!game) return 0;
    return selectedPlayerType === 'titulares' ? game.titulares : game.suplentes;
  };

  const getCurrentRosterForSelection = () => {
    if (!selectedGame) return [];
    const gameRoster = roster.find(r => r.gameId === selectedGame);
    if (!gameRoster) return [];
    return [...gameRoster.titulares, ...gameRoster.suplentes];
  };

  if (!isOpen) return null;

  return (
    <>
      <DynamicModal
        isOpen={isOpen}
        onClose={onClose}
        title="Gestionar Roster del Equipo"
        subtitle={`${gameRequirements.length} juegos configurados`}
        icon={Users}
        iconColor="text-blue-400"
        size="xl"
      >
        <div className="p-6 space-y-6">
          {roster.map((gameRoster) => {
            const gameRequirement = gameRequirements.find(g => g.gameId === gameRoster.gameId);
            if (!gameRequirement) return null;

            const titularesComplete = gameRoster.titulares.length >= gameRequirement.titulares;
            const suplentesComplete = gameRoster.suplentes.length >= gameRequirement.suplentes;
            const isComplete = titularesComplete && suplentesComplete;

            return (
              <div key={gameRoster.gameId} className="bg-white/5 rounded-xl p-6 border border-white/10">
                {/* Header del juego */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{gameRoster.gameName}</h3>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-white/60">
                          {(gameRoster.titulares.length + gameRoster.suplentes.length)} de {gameRequirement.totalPlayers} jugadores
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isComplete 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {isComplete ? 'Completo' : 'Incompleto'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{gameRoster.titulares.length}/{gameRequirement.titulares}</div>
                      <div className="text-white/60">Titulares</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{gameRoster.suplentes.length}/{gameRequirement.suplentes}</div>
                      <div className="text-white/60">Suplentes</div>
                    </div>
                  </div>
                </div>

                {/* Contenido del roster */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Titulares */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-yellow-400 font-semibold flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Titulares</span>
                      </h4>
                      <button
                        onClick={() => handleAddPlayers(gameRoster.gameId, 'titulares')}
                        disabled={titularesComplete}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
                          !titularesComplete
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-white/10 text-white/40 cursor-not-allowed'
                        }`}
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Agregar</span>
                      </button>
                    </div>
                    
                    {gameRoster.titulares.length === 0 ? (
                      <div className="text-center py-4 text-white/40 bg-white/5 rounded-lg">
                        <p className="text-sm">No hay titulares asignados</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {gameRoster.titulares.map((player, index) => (
                          <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {player.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-white font-medium text-sm">{player.name}</div>
                                <div className="text-white/60 text-xs">{player.role} • {player.experience} años exp.</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-yellow-400 text-xs font-medium">#{index + 1}</span>
                              <button
                                onClick={() => handleRemovePlayer(gameRoster.gameId, 'titulares', player.id)}
                                className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {!titularesComplete && (
                      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-400 text-sm text-center">
                          Faltan {gameRequirement.titulares - gameRoster.titulares.length} titulares
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Suplentes */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-blue-400 font-semibold flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Suplentes</span>
                      </h4>
                      <button
                        onClick={() => handleAddPlayers(gameRoster.gameId, 'suplentes')}
                        disabled={suplentesComplete}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1 ${
                          !suplentesComplete
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            : 'bg-white/10 text-white/40 cursor-not-allowed'
                        }`}
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>Agregar</span>
                      </button>
                    </div>
                    
                    {gameRoster.suplentes.length === 0 ? (
                      <div className="text-center py-4 text-white/40 bg-white/5 rounded-lg">
                        <p className="text-sm">No hay suplentes asignados</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {gameRoster.suplentes.map((player, index) => (
                          <div key={player.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {player.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="text-white font-medium text-sm">{player.name}</div>
                                <div className="text-white/60 text-xs">{player.role} • {player.experience} años exp.</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-400 text-xs font-medium">#{index + 1}</span>
                              <button
                                onClick={() => handleRemovePlayer(gameRoster.gameId, 'suplentes', player.id)}
                                className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {!suplentesComplete && (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-blue-400 text-sm text-center">
                          Faltan {gameRequirement.suplentes - gameRoster.suplentes.length} suplentes
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              {roster.filter(gameRoster => {
                const gameRequirement = gameRequirements.find(g => g.gameId === gameRoster.gameId);
                if (!gameRequirement) return false;
                return (gameRoster.titulares.length + gameRoster.suplentes.length) === gameRequirement.totalPlayers;
              }).length} de {gameRequirements.length} equipos completos
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
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Roster</span>
              </button>
            </div>
          </div>
        </div>
      </DynamicModal>

      {/* Modal de selección de jugadores */}
      {showPlayerSelector && (
        <PlayerSelectorModal
          isOpen={showPlayerSelector}
          onClose={() => setShowPlayerSelector(false)}
          onSelect={handlePlayerSelection}
          availablePlayers={getAvailablePlayersForGame(selectedGame)}
          selectedPlayers={getCurrentRosterForSelection()}
          maxPlayers={getMaxPlayersForSelection()}
          gameName={gameRequirements.find(g => g.gameId === selectedGame)?.gameName || ''}
          playerType={selectedPlayerType}
        />
      )}
    </>
  );
};

// Componente interno para selección de jugadores
interface PlayerSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (players: Player[]) => void;
  availablePlayers: Player[];
  selectedPlayers: Player[];
  maxPlayers: number;
  gameName: string;
  playerType: 'titulares' | 'suplentes';
}

const PlayerSelectorModal: React.FC<PlayerSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  availablePlayers,
  selectedPlayers,
  maxPlayers,
  gameName,
  playerType
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const filteredPlayers = availablePlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayerToggle = (playerId: string) => {
    setSelectedPlayerIds(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        if (prev.length < maxPlayers) {
          return [...prev, playerId];
        }
        return prev;
      }
    });
  };

  const handleConfirm = () => {
    const selectedPlayers = availablePlayers.filter(player => 
      selectedPlayerIds.includes(player.id)
    );
    onSelect(selectedPlayers);
    setSelectedPlayerIds([]);
    onClose();
  };

  const getPlayerTypeColor = () => playerType === 'titulares' ? 'text-yellow-400' : 'text-blue-400';
  const getPlayerTypeIcon = () => playerType === 'titulares' ? Star : Shield;

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Seleccionar ${playerType === 'titulares' ? 'Titulares' : 'Suplentes'} para ${gameName}`}
      subtitle={`${availablePlayers.length} jugadores disponibles • Máximo ${maxPlayers}`}
      icon={getPlayerTypeIcon()}
      iconColor={getPlayerTypeColor()}
      size="lg"
    >
      <div className="p-6">
        {/* Búsqueda */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Buscar jugadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Contador */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-white/60 text-sm">
            {selectedPlayerIds.length} de {maxPlayers} seleccionados
          </div>
          {selectedPlayerIds.length > 0 && (
            <button
              onClick={() => setSelectedPlayerIds([])}
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              Limpiar selección
            </button>
          )}
        </div>

        {/* Lista de jugadores */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <p>No se encontraron jugadores</p>
            </div>
          ) : (
            filteredPlayers.map((player) => {
              const isSelected = selectedPlayerIds.includes(player.id);
              const isDisabled = selectedPlayerIds.length >= maxPlayers && !isSelected;
              
              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : isDisabled
                      ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                      : 'border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onClick={() => !isDisabled && handlePlayerToggle(player.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                          : 'bg-gradient-to-r from-gray-600 to-gray-700'
                      }`}>
                        <span className="text-white font-bold text-xs">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{player.name}</div>
                        <div className="text-white/60 text-xs">{player.role} • {player.experience} años exp.</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedPlayerIds.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedPlayerIds.length > 0
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Agregar {selectedPlayerIds.length} jugador{selectedPlayerIds.length !== 1 ? 'es' : ''}</span>
          </button>
        </div>
      </div>
    </DynamicModal>
  );
};

export default TeamRosterManager;
