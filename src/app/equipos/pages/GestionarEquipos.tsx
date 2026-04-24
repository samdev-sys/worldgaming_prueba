import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CustomSelect, CardMinimal, ChipConfig, DetailItem, ActionButton } from '../../shared/components/ui';
import {
  Edit,
  Trash2,
  Users,
  Trophy,
  Gamepad2,
  Star,
  Calendar,
  Target,
  TrendingUp,
  X,
  ArrowRight
} from 'lucide-react';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';
import { getDifficultyColor } from '@/app/shared/utils';
import { equiposService, Team } from '../service/equiposService';
import { queryKeys } from '../../shared/lib/react-query';
import { notificationService } from '../../shared/services/notificationService';

// Las interfaces Team, Player y GameRequirement ahora se importan del servicio

const GestionarEquipos: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filterValues, setFilterValues] = useState({
    search: '',
    status: 'all',
    sortBy: 'name'
  });
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [selectedGame, setSelectedGame] = useState<string>('all');

  const queryClient = useQueryClient();

  // Detectar si se debe mostrar el modal de unirse a equipo
  useEffect(() => {
    if (location.state?.showJoinModal) {
      setShowJoinModal(true);
      // Limpiar el estado para evitar que se muestre en futuras navegaciones
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Obtener equipos del endpoint real
  const { data: equiposResponse, isLoading, error, refetch } = useQuery({
    queryKey: [...queryKeys.teams, filterValues],
    queryFn: async () => {
      const params: any = {};
      
      // Agregar parámetros de búsqueda si existen
      if (filterValues.search) {
        params.search = filterValues.search;
      }
      
      // Agregar filtro de estado si no es 'all'
      if (filterValues.status !== 'all') {
        params.status = filterValues.status === 'active';
      }
      
      return await equiposService.obtenerEquipos(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Extraer equipos de la respuesta
  const teams = equiposResponse?.data || [];

  // Filtrar y ordenar equipos (el filtrado de búsqueda y estado se hace en el servidor)
  const processedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      switch (filterValues.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'matches':
          return (b.totalMatches || 0) - (a.totalMatches || 0);
        case 'wins':
          return (b.wins || 0) - (a.wins || 0);
        default:
          return 0;
      }
    });
  }, [teams, filterValues.sortBy]);

  const deleteTeam = async (teamId: string) => {
    try {
      const result = await equiposService.eliminarEquipo(teamId);
      if (result.success) {
        notificationService.success('Equipo eliminado correctamente', 'Éxito');
        // Invalidar la query para refrescar los datos
        queryClient.invalidateQueries({ queryKey: queryKeys.teams });
      } else {
        notificationService.error(result.error || 'Error al eliminar equipo', 'Error');
      }
    } catch (error: any) {
      notificationService.error(error.message || 'Error al eliminar equipo', 'Error');
    }
  };

  const getWinRate = (wins: number | undefined, total: number | undefined) => {
    const winsValue = wins || 0;
    const totalValue = total || 0;
    return totalValue > 0 ? Math.round((winsValue / totalValue) * 100) : 0;
  };

  const openTeamDetails = (team: Team) => {
    setSelectedTeam(team);
    setShowDetailsModal(true);
    // Al abrir el modal, seleccionar el primer juego automáticamente
    if (team.gameRequirements && team.gameRequirements.length > 0) {
      setSelectedGame(team.gameRequirements[0]?.gameId || 'all');
    } else {
      setSelectedGame('all');
    }
  };

  const closeTeamDetails = () => {
    setShowDetailsModal(false);
    setSelectedTeam(null);
    setActiveTab('general');
    setSelectedGame('all');
  };



  // Función para renderizar la card personalizada usando CardMinimal
  const renderTeamCard = (team: Team) => {
    // Configuración de chips
    const difficulty = team.totalMatches > 20 ? 'PROFESIONAL' : team.totalMatches > 10 ? 'SEMI-PRO' : 'AMATEUR';
    const chips: ChipConfig[] = useMemo(() => [
      {
        label: team.isActive ? 'ACTIVO' : 'INACTIVO',
        className: team.isActive
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-red-500/20 text-red-400 border-red-500/30'
      },
      {
        label: difficulty.toUpperCase(),
        className: getDifficultyColor(difficulty)
      },
      {
        label: `${team.gameRequirements.length} JUEGO${team.gameRequirements.length !== 1 ? 'S' : ''}`,
        className: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      }
    ], [team.isActive, team.totalMatches, team.gameRequirements.length]);

    // Configuración de detalles
    const details: DetailItem[] = useMemo(() => [
      {
        icon: Users,
        text: `${team.players.titulares.length + team.players.suplentes.length} jugadores`
      },
      {
        icon: Trophy,
        text: `${team.totalMatches} partidos`
      },
      {
        icon: Calendar,
        text: `Creado: ${team.createdAt}`,
        colSpan: 2
      }
    ], [team.players.titulares.length, team.players.suplentes.length, team.totalMatches, team.createdAt]);

    // Configuración de botones de acción
    const actionButtons: ActionButton[] = useMemo(() => [
      {
        icon: ArrowRight,
        onClick: () => openTeamDetails(team),
        className: 'w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center group-hover:bg-purple-500/20',
        title: 'Ver Información'
      },
      {
        icon: Edit,
        onClick: () => console.log('Editar equipo:', team.id),
        className: 'w-8 h-8 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 flex items-center justify-center group-hover:bg-blue-500/30',
        title: 'Editar Equipo'
      },
      {
        icon: Trash2,
        onClick: () => deleteTeam(team.id),
        className: 'w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 transition-colors duration-200 flex items-center justify-center group-hover:bg-red-500/30',
        title: 'Eliminar Equipo'
      }
    ], [team]);

    return (
      <CardMinimal
        {...(team.image && { image: team.image })}
        imageAlt={team.name}
        fallbackText={{ line1: 'EQUIPO', line2: 'GAMING' }}
        title={team.name}
        chips={chips}
        details={details}
        infoBadge={{
          text: `${getWinRate(team.wins, team.totalMatches)}% WR`
        }}
        actionButtons={actionButtons}
        onClick={() => openTeamDetails(team)}
      />
    );
  };



  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8" style={{ minWidth: '1500px' }}>
      <style>{`
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>

      {/* Modal de Unirse a Equipo */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Unirse a un Equipo</h2>
                  <p className="text-white/60 text-sm">Explora equipos disponibles y solicita unirte</p>
                </div>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-2 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              {/* Filtros para equipos */}
              <div className="bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-lg mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Buscar equipos..."
                      className="w-full pl-4 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomSelect
                      options={[
                        { value: '', label: 'Todos los juegos' },
                        { value: 'lol', label: 'League of Legends' },
                        { value: 'valorant', label: 'Valorant' },
                        { value: 'csgo', label: 'CS:GO' },
                        { value: 'dota', label: 'Dota 2' }
                      ]}
                      value=""
                      onChange={() => { }}
                      placeholder="Todos los juegos"
                      className="min-w-[150px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de equipos disponibles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {teams.filter(team => team.isActive).map((team) => (
                <div key={team.id} className="bg-gradient-to-br from-white/10 to-white/15 rounded-xl p-4 border border-white/20 hover:border-white/30 transition-all duration-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={team.image}
                      alt={team.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{team.name}</h3>
                      <p className="text-white/60 text-sm">{team.gameRequirements.length} juegos</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">{getWinRate(team.wins, team.totalMatches)}%</div>
                      <div className="text-white/40 text-xs">Win Rate</div>
                    </div>
                  </div>
                  <p className="text-white/80 text-sm mb-3 line-clamp-2">{team.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-white/60">
                      <Users className="w-3 h-3" />
                      <span>{team.players.titulares.length + team.players.suplentes.length} jugadores</span>
                    </div>
                    <button
                      onClick={() => {
                        // Aquí iría la lógica para solicitar unirse al equipo
                        console.log('Solicitar unirse a:', team.name);
                        setShowJoinModal(false);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-sm font-medium"
                    >
                      Solicitar Unirse
                    </button>
                  </div>
                </div>
              ))}
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cerrar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles del Equipo */}
      {showDetailsModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={selectedTeam.image}
                    alt="Team logo"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/20 shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png';
                    }}
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${selectedTeam.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedTeam.name}</h2>
                  <p className="text-white/60 text-sm mb-2">{selectedTeam.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-white/40">ID: {selectedTeam.id}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/40">Creado: {selectedTeam.createdAt}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeTeamDetails}
                className="p-2 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Pestañas */}
            <div className="flex space-x-1 px-6 border-b border-white/10">
              <button
                onClick={() => setActiveTab('general')}
                className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 flex items-center space-x-2 ${activeTab === 'general'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Información General</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('players');
                  // Al cambiar a la pestaña de jugadores, seleccionar el primer juego automáticamente
                  if (selectedTeam && selectedTeam.gameRequirements && selectedTeam.gameRequirements.length > 0) {
                    setSelectedGame(selectedTeam.gameRequirements[0]?.gameId || 'all');
                  } else {
                    setSelectedGame('all');
                  }
                }}
                className={`px-4 py-3 rounded-t-lg font-medium transition-all duration-200 flex items-center space-x-2 ${activeTab === 'players'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Jugadores por Juego</span>
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              {/* Contenido de las pestañas */}
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información General */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white/10 to-white/15 rounded-xl p-6 border border-white/20 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <span>Información General</span>
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${selectedTeam.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-white/60">Estado:</span>
                        </div>
                        <span className={`font-semibold ${selectedTeam.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedTeam.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-white/60">Fecha de Creación:</span>
                        </div>
                        <span className="text-white font-medium">{selectedTeam.createdAt}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Gamepad2 className="w-4 h-4 text-yellow-400" />
                          <span className="text-white/60">Total de Juegos:</span>
                        </div>
                        <span className="text-blue-400 font-semibold text-lg">{selectedTeam.gameRequirements.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="bg-gradient-to-br from-white/10 to-white/15 rounded-xl p-6 border border-white/20 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span>Estadísticas de Torneo</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                        <div className="text-3xl font-bold text-white mb-1">{selectedTeam.totalMatches}</div>
                        <div className="text-white/60 text-sm font-medium">Partidos</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                        <div className="text-3xl font-bold text-green-400 mb-1">{selectedTeam.wins}</div>
                        <div className="text-white/60 text-sm font-medium">Victorias</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                        <div className="text-3xl font-bold text-purple-400 mb-1">{getWinRate(selectedTeam.wins, selectedTeam.totalMatches)}%</div>
                        <div className="text-white/60 text-sm font-medium">Win Rate</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-white/60">Derrotas:</span>
                        <span className="text-red-400 font-semibold">{selectedTeam.losses}</span>
                      </div>
                      {/* Barra de rendimiento */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-white/60 mb-1">
                          <span>Rendimiento</span>
                          <span>{selectedTeam.wins}W - {selectedTeam.losses}L</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getWinRate(selectedTeam.wins, selectedTeam.totalMatches)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Juegos y Capitanes */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-white/10 to-white/15 rounded-xl p-6 border border-white/20 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                      <Gamepad2 className="w-5 h-5 text-yellow-400" />
                      <span>Juegos y Capitanes</span>
                    </h3>
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                      {selectedTeam.gameRequirements.map((game, index) => {
                        const captain = selectedTeam.captains.find(c => c.gameId === game.gameId);
                        return (
                          <div key={index} className="bg-gradient-to-br from-white/8 to-white/12 rounded-lg p-4 border border-white/15 shadow-md">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-white font-bold text-lg">{game.gameName}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold">
                                  {game.titulares}T
                                </span>
                                <span className="text-white/40">+</span>
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                                  {game.suplentes}S
                                </span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Star className="w-4 h-4 text-blue-400" />
                                  <span className="text-white/60 text-sm">Capitán:</span>
                                </div>
                                <div className="text-blue-400 font-semibold">{captain?.captainName || 'No asignado'}</div>
                              </div>
                              <div className="p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Users className="w-4 h-4 text-purple-400" />
                                  <span className="text-white/60 text-sm">Total:</span>
                                </div>
                                <div className="text-purple-400 font-semibold text-lg">{game.totalPlayers}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'players' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Jugadores por Juego</h3>

                  {/* Selector de Juego */}
                  <div className="flex items-center space-x-3">
                    <label className="text-white/60 text-sm font-medium">Juego seleccionado:</label>
                    <CustomSelect
                      options={selectedTeam.gameRequirements.map((game) => ({
                        value: game.gameId,
                        label: game.gameName
                      }))}
                      value={selectedGame}
                      onChange={(value) => setSelectedGame(value)}
                      placeholder="Seleccionar juego..."
                      className="min-w-[150px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {selectedTeam.gameRequirements
                    .filter(game => game.gameId === selectedGame)
                    .length > 0 ? (
                    selectedTeam.gameRequirements
                      .filter(game => game.gameId === selectedGame)
                      .map((game, index) => {
                        const captain = selectedTeam.captains.find(c => c.gameId === game.gameId);
                        return (
                          <div key={index} className="bg-gradient-to-br from-white/10 to-white/15 rounded-lg p-4 border border-white/20 shadow-lg">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-xl font-bold text-white">{game.gameName}</h4>
                              <div className="flex items-center space-x-2">
                                <span className="text-green-400 font-semibold">{game.titulares}T</span>
                                <span className="text-white/40">+</span>
                                <span className="text-blue-400 font-semibold">{game.suplentes}S</span>
                              </div>
                            </div>

                            {/* Capitán */}
                            <div className="mb-4 p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                              <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Capitán:</span>
                                <span className="text-blue-400 font-semibold">{captain?.captainName || 'No asignado'}</span>
                              </div>
                            </div>

                            {/* Titulares */}
                            <div className="mb-4">
                              <h5 className="text-green-400 font-semibold mb-2 flex items-center">
                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                Titulares ({game.titulares})
                              </h5>
                              <div className="space-y-2">
                                {selectedTeam.players.titulares.slice(0, game.titulares).map((player, playerIndex) => (
                                  <div key={playerIndex} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                    <div>
                                      <div className="text-white font-medium">{player.name}</div>
                                      <div className="text-white/60 text-xs">{player.role}</div>
                                    </div>
                                    <div className="text-white/60 text-sm">{player.experience} años exp.</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Suplentes */}
                            <div>
                              <h5 className="text-blue-400 font-semibold mb-2 flex items-center">
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                                Suplentes ({game.suplentes})
                              </h5>
                              <div className="space-y-2">
                                {selectedTeam.players.suplentes.slice(0, game.suplentes).map((player, playerIndex) => (
                                  <div key={playerIndex} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                    <div>
                                      <div className="text-white font-medium">{player.name}</div>
                                      <div className="text-white/60 text-xs">{player.role}</div>
                                    </div>
                                    <div className="text-white/60 text-sm">{player.experience} años exp.</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <div className="text-white/60 text-lg">No se encontró información para este juego</div>
                      <div className="text-white/40 text-sm mt-2">Selecciona otro juego de la lista</div>
                    </div>
                  )}
                </div>
              </div>
              )}

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={closeTeamDetails}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cerrar</span>
                </button>
                <button
                  onClick={() => console.log('Editar equipo:', selectedTeam.id)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar Equipo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Equipos */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-white/60">Cargando equipos...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-400 mb-4">Error al cargar equipos</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <DynamicCardList
          data={processedTeams}
          title="Equipos profesionales"
          subtitle="Lista de equipos profesionales"
          newButtonText="Crear Equipo"
          newButtonLink="/worldGaming/equipos/crear"
          newButtonState={{ from: '/worldGaming/equipos' }}
          renderCard={renderTeamCard}
          isLoading={isLoading}
          onRefresh={() => {
            refetch();
          }}
          filters={[
            {
              type: 'search',
              key: 'search',
              placeholder: 'Buscar equipos...',
              onChange: (value: string) => setFilterValues(prev => ({ ...prev, search: value }))
            },
            {
              type: 'select',
              key: 'status',
              placeholder: 'Todos los estados',
              options: [
                { value: 'all', label: 'Todos los estados' },
                { value: 'active', label: 'Activos' },
                { value: 'inactive', label: 'Inactivos' }
              ],
              onChange: (value: string) => setFilterValues(prev => ({ ...prev, status: value }))
            },
            {
              type: 'select',
              key: 'sortBy',
              placeholder: 'Ordenar por',
              options: [
                { value: 'name', label: 'Ordenar por nombre' },
                { value: 'created', label: 'Ordenar por fecha' },
                { value: 'matches', label: 'Ordenar por partidos' },
                { value: 'wins', label: 'Ordenar por victorias' }
              ],
              onChange: (value: string) => setFilterValues(prev => ({ ...prev, sortBy: value }))
            }
          ]}
          gridClassName="grid-cols-1 lg:grid-cols-2 gap-6"
          className="space-y-6"
        />
      )}
    </div>
  );
};

export default GestionarEquipos;
