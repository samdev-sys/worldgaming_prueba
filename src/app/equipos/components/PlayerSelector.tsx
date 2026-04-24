import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Star,
  Shield,
  Users,
  Check,
  Gamepad2
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

interface PlayerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (players: Player[]) => void;
  availablePlayers: Player[];
  selectedPlayers: Player[];
  playerType: 'titulares' | 'suplentes';
  selectedGame: GameRequirement | null;
}

const PlayerSelector: React.FC<PlayerSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  availablePlayers,
  selectedPlayers,
  playerType,
  selectedGame
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'experience' | 'role'>('name');
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  if (!isOpen || !selectedGame) return null;

  // Obtener límites del juego seleccionado
  const maxPlayers = playerType === 'titulares' ? selectedGame.titulares : selectedGame.suplentes;

  // Filtrar jugadores disponibles (excluir los ya seleccionados en el otro tipo)
  const availableForSelection = availablePlayers.filter(
    player => !selectedPlayers.some(selected => selected.id === player.id)
  );

  // Filtrar por búsqueda y rol
  const filteredPlayers = availableForSelection.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || player.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Ordenar jugadores
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'experience':
        return b.experience - a.experience;
      case 'role':
        return a.role.localeCompare(b.role);
      default:
        return 0;
    }
  });

  const roles = ['all', ...Array.from(new Set(availablePlayers.map(p => p.role)))];

  const getPlayerTypeColor = () => {
    return playerType === 'titulares' ? 'text-yellow-400' : 'text-blue-400';
  };

  const getPlayerTypeIcon = () => {
    return playerType === 'titulares' ? Star : Shield;
  };

  const PlayerTypeIcon = getPlayerTypeIcon();

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

  const handleConfirmSelection = () => {
    const selectedPlayers = availablePlayers.filter(player => 
      selectedPlayerIds.includes(player.id)
    );
    onSelect(selectedPlayers);
    setSelectedPlayerIds([]);
    onClose();
  };

  const handleCancel = () => {
    setSelectedPlayerIds([]);
    onClose();
  };

  return (
    <DynamicModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`Seleccionar Jugadores ${playerType === 'titulares' ? 'Titulares' : 'Suplentes'}`}
      subtitle={`${selectedGame.gameName} • ${availableForSelection.length} jugadores disponibles • Máximo ${maxPlayers}`}
      icon={PlayerTypeIcon}
      iconColor={getPlayerTypeColor()}
      size="lg"
    >
      {/* Información del juego seleccionado */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{selectedGame.gameName}</h3>
            <p className="text-white/60 text-sm">
              {selectedGame.titulares} titulares • {selectedGame.suplentes} suplentes • {selectedGame.totalPlayers} total
            </p>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="p-6 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Buscar jugadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filtro por rol */}
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {roles.map(role => (
                <option key={role} value={role} className="bg-gray-800">
                  {role === 'all' ? 'Todos los roles' : role}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenar por */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'experience' | 'role')}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="name" className="bg-gray-800">Ordenar por nombre</option>
              <option value="experience" className="bg-gray-800">Ordenar por experiencia</option>
              <option value="role" className="bg-gray-800">Ordenar por rol</option>
            </select>
          </div>
        </div>

        {/* Contador de seleccionados */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-white/60 text-sm">
            {selectedPlayerIds.length} de {maxPlayers} jugadores seleccionados
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
      </div>

      {/* Lista de Jugadores */}
      <div className="p-6 overflow-y-auto max-h-[400px]">
        {sortedPlayers.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Users className="w-12 h-12 mx-auto mb-3 text-white/20" />
            <p>No se encontraron jugadores</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedPlayers.map((player) => {
              const isSelected = selectedPlayerIds.includes(player.id);
              const isDisabled = selectedPlayerIds.length >= maxPlayers && !isSelected;
              
              return (
                <div
                  key={player.id}
                  className={`bg-white/5 rounded-xl p-4 border transition-all duration-200 cursor-pointer group ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : isDisabled
                      ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                      : 'border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onClick={() => !isDisabled && handlePlayerToggle(player.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                              : 'bg-gradient-to-r from-gray-600 to-gray-700'
                          }`}>
                            <span className="text-white font-bold text-sm">
                              {player.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{player.name}</h3>
                          <p className="text-white/60 text-sm">{player.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          player.role === 'Captain' 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {player.role}
                        </span>
                        <span className="text-white/60">
                          {player.experience} años exp.
                        </span>
                      </div>
                    </div>
                    
                    <div className={`ml-4 transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : playerType === 'titulares' 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {isSelected ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm">
            {sortedPlayers.length} jugadores mostrados de {availableForSelection.length} disponibles
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmSelection}
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
      </div>
    </DynamicModal>
  );
};

export default PlayerSelector;
