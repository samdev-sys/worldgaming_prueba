import React, { useState } from 'react';
import { Users, Crown, Plus, Search, Gamepad2, X } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  tag: string;
  logo?: string;
  image: string;
  description: string;
  type?: 'created' | 'joined'; // 'created' = equipo creado por el usuario, 'joined' = equipo al que se unió
  role?: 'captain' | 'player' | 'admin'; // Rol del usuario en el equipo
  captains: {
    gameId: string;
    gameName: string;
    captainName: string;
  }[];
  players: {
    titulares: any[];
    suplentes: any[];
  };
  gameRequirements: any[];
  isActive: boolean;
  createdAt: string;
  totalMatches: number;
  wins: number;
  losses: number;
  rank: string;
  tier: string;
  points: number;
}

interface TeamSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeam: (team: Team) => void;
  currentTeam?: Team | null;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTeam,
  currentTeam
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'created' | 'joined'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('active');

  // Mock data - en producción esto vendría de una API
  const [teams] = useState<Team[]>([
    {
      id: '1',
      name: 'ESTRAL ESPORTS',
      tag: 'ESTRAL',
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      description: 'Equipo profesional de esports con experiencia en múltiples juegos',
      type: 'created',
      role: 'captain',
      captains: [],
      players: { titulares: [], suplentes: [] },
      gameRequirements: [],
      isActive: true,
      createdAt: '2024-01-15',
      totalMatches: 25,
      wins: 18,
      losses: 7,
      rank: 'Diamante',
      tier: 'I',
      points: 1850
    },
    {
      id: '2',
      name: 'GAMING LEGENDS',
      tag: 'GL',
      logo: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=300&fit=crop',
      description: 'Comunidad de jugadores competitivos',
      type: 'joined',
      role: 'player',
      captains: [],
      players: { titulares: [], suplentes: [] },
      gameRequirements: [],
      isActive: true,
      createdAt: '2024-02-10',
      totalMatches: 18,
      wins: 12,
      losses: 6,
      rank: 'Platino',
      tier: 'II',
      points: 1450
    },
    {
      id: '3',
      name: 'ELITE WARRIORS',
      tag: 'EW',
      logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      description: 'Equipo de élite para competencias profesionales',
      type: 'joined',
      role: 'admin',
      captains: [],
      players: { titulares: [], suplentes: [] },
      gameRequirements: [],
      isActive: true,
      createdAt: '2024-01-20',
      totalMatches: 30,
      wins: 22,
      losses: 8,
      rank: 'Diamante',
      tier: 'III',
      points: 2100
    },
    {
      id: '4',
      name: 'STORM RIDERS',
      tag: 'SR',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      description: 'Equipo casual para diversión y aprendizaje',
      type: 'created',
      role: 'captain',
      captains: [],
      players: { titulares: [], suplentes: [] },
      gameRequirements: [],
      isActive: false,
      createdAt: '2024-03-05',
      totalMatches: 8,
      wins: 3,
      losses: 5,
      rank: 'Oro',
      tier: 'I',
      points: 800
    }
  ]);

  if (!isOpen) return null;

  // Filtrar equipos
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || team.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' ? team.isActive : !team.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTeamTypeIcon = (type: 'created' | 'joined') => {
    return type === 'created' ? Crown : Users;
  };


  const getRoleColor = (role: string) => {
    switch (role) {
      case 'captain': return 'text-purple-400';
      case 'admin': return 'text-green-400';
      case 'player': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'captain': return 'Capitán';
      case 'admin': return 'Administrador';
      case 'player': return 'Jugador';
      default: return 'Miembro';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Seleccionar Equipo</h2>
                  <p className="text-white/60 text-sm">Elige el equipo que quieres gestionar</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Filtros y búsqueda */}
          <div className="p-6 border-b border-white/10 bg-gray-800/50">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar equipos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500 transition-all duration-200"
                />
              </div>

              {/* Filtro por tipo */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filterType === 'all'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFilterType('created')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    filterType === 'created'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  Creados
                </button>
                <button
                  onClick={() => setFilterType('joined')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    filterType === 'joined'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Unidos
                </button>
              </div>

              {/* Filtro por estado */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all duration-200"
              >
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="all">Todos</option>
              </select>
            </div>
          </div>

          {/* Lista de equipos */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {filteredTeams.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No se encontraron equipos</h3>
                <p className="text-white/60">Intenta ajustar los filtros o crear un nuevo equipo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeams.map((team) => {
                  const TeamTypeIcon = getTeamTypeIcon(team.type || 'joined');
                  const isCurrentTeam = currentTeam?.id === team.id;
                  
                  return (
                    <div
                      key={team.id}
                      onClick={() => onSelectTeam(team)}
                      className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                        isCurrentTeam
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Logo del equipo */}
                        <div className="relative">
                          {team.logo ? (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center">
                              <Users className="w-8 h-8 text-white/60" />
                            </div>
                          )}
                          
                          {/* Badge de tipo */}
                          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${(team.type || 'joined') === 'created' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                            <TeamTypeIcon className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        {/* Información del equipo */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-white truncate">{team.name}</h3>
                            <span className="text-white/60 text-sm">[{team.tag}]</span>
                            {isCurrentTeam && (
                              <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                                Actual
                              </span>
                            )}
                          </div>
                          
                          <p className="text-white/70 text-sm mb-3 line-clamp-2">{team.description}</p>
                          
                          {/* Stats del equipo */}
                          <div className="flex items-center space-x-4 text-sm text-white/60 mb-3">
                            <div className="flex items-center space-x-1">
                              <Gamepad2 className="w-4 h-4" />
                              <span>{team.gameRequirements.length} juegos</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{team.players.titulares.length + team.players.suplentes.length} jugadores</span>
                            </div>
                          </div>
                          
                          {/* Rol y estado */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs font-medium ${getRoleColor(team.role || 'player')}`}>
                                {getRoleText(team.role || 'player')}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${team.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                            </div>
                            
                            <div className={`text-xs ${team.isActive ? 'text-green-400' : 'text-red-400'}`}>
                              {team.isActive ? 'Activo' : 'Inactivo'}
                            </div>
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
          <div className="p-6 border-t border-white/10 bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/60">
                {filteredTeams.length} equipo{filteredTeams.length !== 1 ? 's' : ''} encontrado{filteredTeams.length !== 1 ? 's' : ''}
              </div>
              <button
                onClick={() => {
                  onClose();
                  // Navegar a crear equipo
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Nuevo Equipo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSelector;
