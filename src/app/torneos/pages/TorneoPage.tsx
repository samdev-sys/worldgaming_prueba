import React, { useState, useCallback, useMemo } from 'react';
import { GitBranch, TrendingUp, Trophy, Users, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';
import LoadingScreen from '../../shared/components/ui/LoadingScreen';
import TournamentPagination from '../../shared/components/ui/TournamentPagination';
import TournamentFilters from '../../shared/components/ui/TournamentFilters';
import HighlightCarousel from '../../shared/components/ui/HighlightCarousel';
import {
  TournamentBracket,
  StandingsTable,
  BracketVisualChart,
  TeamStatsSidebar,
  TournamentCardMinimal,
  TournamentStatsCards
} from '../components';
import { useTorneos, Torneo } from '../hooks/useTorneos';
import { useMisTorneos, MiTorneo } from '../hooks/useMisTorneos';
import { useHighlights } from '../hooks/useHighlights';
import { useJuegos } from '../hooks/useJuegos';
import { PAGINATION_CONFIG } from '../../shared/constants/pagination';


const TorneosPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    torneos,
    loading,
    totalItems,
    pageNumber,
    handleSearch,
    handleFilterChange,
    handlePageChange: handlePageChangeTorneos,
    handlePageSizeChange: handlePageSizeChangeTorneos,
    getFilterOptions,
    refreshTorneos,
    searchFilters
  } = useTorneos();

  const {
    torneos: misTorneos,
    loading: loadingMisTorneos,
    refreshMisTorneos,
    handleFilterChange: handleFilterChangeMis,
    handleSearch: handleSearchMisTorneos,
    handlePageChange: handlePageChangeMis,
    handleItemsPerPageChange: handleItemsPerPageChangeMis,
    getFilterOptions: getFilterOptionsMis,
    paginationInfo: paginationInfoMis
  } = useMisTorneos();

  const {
    highlights,
    loading: loadingHighlights,
    error: highlightsError
  } = useHighlights();

  const {
    getJuegoOptions
  } = useJuegos();

  const [activeMainTab, setActiveMainTab] = useState<'todos' | 'mis' | 'participando'>('todos');
  const [sharedPageSize, setSharedPageSize] = useState<number>(8); // Estado compartido para pageSize
  const [showBracketModal, setShowBracketModal] = useState(false);
  const [selectedTournamentForBracket, setSelectedTournamentForBracket] = useState<Torneo | MiTorneo | null>(null);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedTournamentForChart, setSelectedTournamentForChart] = useState<Torneo | MiTorneo | null>(null);
  const [activeTab, setActiveTab] = useState<'standings' | 'bracket'>('standings');
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedTeamForSidebar, setSelectedTeamForSidebar] = useState<string>('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedTournamentForInfo, setSelectedTournamentForInfo] = useState<Torneo | MiTorneo | null>(null);

  // Estados de paginación (ahora manejados por los hooks)

  const handleTeamClick = useCallback((participant: any) => {
    setShowSidebar(true);
    setSelectedTeamForSidebar(participant.name);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setShowSidebar(false);
    setSelectedTeamForSidebar('');
  }, []);

  const handleJoinTournament = useCallback(async (_tournament: Torneo | MiTorneo) => {
    try {
      setShowInfoModal(false);
      // TODO: Implementar llamada a la API para unirse al torneo
      // await apiService.post(`Torneos/${_tournament.id}/join`);
    } catch (error) {
      console.error('Error al unirse al torneo:', error);
    }
  }, []);

  const handleEditTournament = useCallback((tournament: Torneo) => {
    navigate(`/worldGaming/torneos/editar/${tournament.id}`);
  }, [navigate]);

  const handleTournamentClick = useCallback((tournament: Torneo | MiTorneo) => {
    setSelectedTournamentForInfo(tournament);
    setShowInfoModal(true);
  }, []);

  const getFilteredParticipatingTorneos = useMemo(() => {
    return misTorneos.filter(torneo =>
      torneo.estado?.toLowerCase() === 'activo' || torneo.estado?.toLowerCase() === 'en curso'
    );
  }, [misTorneos]);

  // Función para manejar cambio de pageSize compartido
  const handleSharedPageSizeChange = useCallback((newPageSize: number) => {
    setSharedPageSize(newPageSize);
    // Actualizar todos los hooks con el nuevo pageSize
    handlePageSizeChangeTorneos(newPageSize);
    handleItemsPerPageChangeMis(newPageSize);
  }, [handlePageSizeChangeTorneos, handleItemsPerPageChangeMis]);

  const filterOptions = useMemo(() => getFilterOptions(), [getFilterOptions]);

  if (loading && torneos.length === 0) {
    return (
      <LoadingScreen
        title="Cargando Torneos"
        subtitle="Obteniendo lista de torneos disponibles..."
        description="Estamos cargando todos los torneos activos para que puedas participar."
        showDetails={true}
        details={{
          title: "Información de carga",
          items: [
            {
              label: 'Estado',
              value: 'Cargando datos...'
            },
            {
              label: 'Filtros aplicados',
              value: 'Ninguno'
            },
            {
              label: 'Página actual',
              value: pageNumber.toString()
            }
          ]
        }}
        variant="detailed"
      />
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8" style={{ minWidth: '1500px' }}>
      {/* Carrusel de Highlights */}
      {!loadingHighlights && highlights.length > 0 && (
        <div className="mb-8">
          <HighlightCarousel
            items={highlights
              .filter(highlight => highlight.title && highlight.image)
              .map(highlight => ({
                id: highlight.id,
                title: highlight.title,
                description: highlight.description || '',
                image: highlight.image,
                link: highlight.link || '',
                type: highlight.type,
                duration: highlight.duration || 0
              }))}
            autoPlay={true}
            autoPlayInterval={6000}
            showControls={true}
            showIndicators={true}
            className="shadow-2xl"
          />
        </div>
      )}

      {/* Loading del carrusel */}
      {loadingHighlights && (
        <div className="mb-8">
          <div className="w-full h-64 md:h-80 lg:h-96 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white/60">Cargando highlights...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error del carrusel */}
      {highlightsError && (
        <div className="mb-8">
          <div className="w-full h-64 md:h-80 lg:h-96 bg-red-500/10 backdrop-blur-lg rounded-2xl border border-red-500/20 shadow-2xl flex items-center justify-center">
            <div className="text-center">
              <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 font-semibold mb-2">Error al cargar highlights</p>
              <p className="text-white/60 text-sm">{highlightsError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header con título y descripción */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              {activeMainTab === 'todos' ? 'Todos los torneos' :
                activeMainTab === 'mis' ? 'Mis torneos' : 'Torneos en los que participas'}
            </h1>
            <p className="text-white/60 mt-1">
              {activeMainTab === 'todos'
                ? 'Compite con los mejores jugadores del mundo'
                : activeMainTab === 'mis'
                  ? 'Torneos en los que participas o has participado'
                  : 'Torneos en los que estás actualmente participando'
              }
            </p>
          </div>
          {activeMainTab === 'mis' && (
            <button
              onClick={() => navigate('/worldGaming/torneos/crear')}
              className="flex items-center gap-2 px-6 py-3 bg-green-500/10 backdrop-blur-sm border border-green-400/30 text-white rounded-lg hover:bg-green-500/20 transition-all duration-200 font-semibold"
            >
              <span>Crear Torneo</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs de contenido */}
      <div className="mb-8">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveMainTab('todos')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${activeMainTab === 'todos'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Todos los Torneos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveMainTab('mis')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${activeMainTab === 'mis'
              ? 'text-white border-b-2 border-green-500'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <User className="w-4 h-4" />
              <span>Mis Torneos</span>
            </div>
          </button>
          <button
            onClick={() => setActiveMainTab('participando')}
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${activeMainTab === 'participando'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              <span>Participando</span>
            </div>
          </button>
        </div>
      </div>

      {activeMainTab === 'todos' ? (
        <div className="space-y-6">
          <DynamicCardList
            filters={[
              {
                type: 'search' as const,
                key: 'search',
                placeholder: 'Buscar torneos...',
                onChange: (value: string) => handleSearch(value)
              },
              {
                type: 'select' as const,
                key: 'estado',
                placeholder: 'Todos los estados',
                options: filterOptions.estado,
                onChange: (value: string) => handleFilterChange('Estado', value)
              },
              {
                type: 'select' as const,
                key: 'dificultad',
                placeholder: 'Todas las dificultades',
                options: filterOptions.dificultad,
                onChange: (value: string) => handleFilterChange('Dificultad', value)
              },
              {
                type: 'select' as const,
                key: 'juego',
                placeholder: 'Todos los juegos',
                options: getJuegoOptions(),
                onChange: (value: string) => handleFilterChange('JuegoId', value)
              }
            ]}
            pagination={true}
            itemsPerPageOptions={PAGINATION_CONFIG.pageSizeOptions as unknown as number[]}
            data={torneos}
            renderCard={(tournament: Torneo) => (
              <TournamentCardMinimal
                tournament={tournament}
                onTournamentClick={handleTournamentClick}
                onChartClick={(tournament) => {
                  setSelectedTournamentForChart(tournament);
                  setShowChartModal(true);
                }}
                showStatusChip={false}
              />
            )}
            isLoading={loading}
            gridClassName="grid-cols-1 lg:grid-cols-2 gap-6"
            renderFilters={TournamentFilters}
            renderPagination={TournamentPagination}
            initialFilterValues={searchFilters}
            serverPagination={{
              totalRecords: totalItems,
              pageNumber: pageNumber,
              pageSize: sharedPageSize
            }}
            onPaginationChange={(page, size) => {
              if (size && size !== sharedPageSize) {
                // Si cambió el tamaño de página, usar función compartida
                handleSharedPageSizeChange(size);
              } else {
                // Si solo cambió la página, usar handlePageChange
                handlePageChangeTorneos(page);
              }
            }}
            onRefresh={refreshTorneos}
          />

          {/* Cards de Estadísticas al final */}
          <TournamentStatsCards
            torneos={torneos}
            title="Estadísticas de Todos los Torneos"
          />
        </div>
      ) : activeMainTab === 'mis' ? (
        <div className="space-y-6">
          <DynamicCardList
            filters={[
              {
                type: 'search' as const,
                key: 'search',
                placeholder: 'Buscar mis torneos...',
                onChange: (value: string) => {
                  handleSearchMisTorneos(value);
                }
              },
              {
                type: 'select' as const,
                key: 'estado',
                placeholder: 'Todos los estados',
                options: getFilterOptionsMis().estado,
                onChange: (value: string) => {
                  handleFilterChangeMis('Estado', value);
                }
              },
              {
                type: 'select' as const,
                key: 'dificultad',
                placeholder: 'Todas las dificultades',
                options: getFilterOptionsMis().dificultad,
                onChange: (value: string) => {
                  handleFilterChangeMis('Dificultad', value);
                }
              },
              {
                type: 'select' as const,
                key: 'juego',
                placeholder: 'Todos los juegos',
                options: getJuegoOptions(),
                onChange: (value: string) => {
                  handleFilterChangeMis('JuegoId', value);
                }
              }
            ]}
            pagination={true}
            itemsPerPageOptions={PAGINATION_CONFIG.pageSizeOptions as unknown as number[]}
            data={misTorneos}
            renderCard={(tournament: MiTorneo) => (
              <TournamentCardMinimal
                tournament={tournament}
                onTournamentClick={handleTournamentClick}
                onBracketClick={(tournament) => {
                  setSelectedTournamentForBracket(tournament);
                  setShowBracketModal(true);
                }}
                onChartClick={(tournament) => {
                  setSelectedTournamentForChart(tournament);
                  setShowChartModal(true);
                }}
                onEdit={handleEditTournament}
                onToggle={(_tournament, _newStatus) => {
                  refreshMisTorneos();
                }}
              />
            )}
            title=""
            subtitle=""
            newButtonText=""
            newButtonLink=""
            isLoading={loadingMisTorneos}
            gridClassName="grid-cols-1 lg:grid-cols-2 gap-6"
            renderFilters={TournamentFilters}
            renderPagination={TournamentPagination}
            serverPagination={{
              totalRecords: paginationInfoMis.totalRecords,
              pageNumber: paginationInfoMis.pageNumber,
              pageSize: sharedPageSize
            }}
            onPaginationChange={(page, size) => {
              if (size && size !== sharedPageSize) {
                // Si cambió el tamaño de página, usar función compartida
                handleSharedPageSizeChange(size);
              } else {
                // Si solo cambió la página, usar handlePageChange
                handlePageChangeMis(page);
              }
            }}
            onRefresh={refreshMisTorneos}
          />

          {/* Cards de Estadísticas al final */}
          <TournamentStatsCards
            torneos={misTorneos}
            title="Estadísticas de Mis Torneos"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <DynamicCardList
            filters={[
              {
                type: 'search' as const,
                key: 'search',
                placeholder: 'Buscar torneos participando...',
                onChange: (value: string) => {
                  handleSearchMisTorneos(value);
                }
              },
              {
                type: 'select' as const,
                key: 'estado',
                placeholder: 'Todos los estados',
                options: getFilterOptionsMis().estado,
                onChange: (value: string) => {
                  handleFilterChangeMis('Estado', value);
                }
              },
              {
                type: 'select' as const,
                key: 'dificultad',
                placeholder: 'Todas las dificultades',
                options: getFilterOptionsMis().dificultad,
                onChange: (value: string) => {
                  handleFilterChangeMis('Dificultad', value);
                }
              },
              {
                type: 'select' as const,
                key: 'juego',
                placeholder: 'Todos los juegos',
                options: getJuegoOptions(),
                onChange: (value: string) => {
                  handleFilterChangeMis('JuegoId', value);
                }
              }
            ]}
            pagination={true}
            itemsPerPageOptions={PAGINATION_CONFIG.pageSizeOptions as unknown as number[]}
            data={misTorneos}
            renderCard={(tournament: MiTorneo) => (
              <TournamentCardMinimal
                tournament={tournament}
                onTournamentClick={handleTournamentClick}
                onChartClick={(tournament) => {
                  setSelectedTournamentForChart(tournament);
                  setShowChartModal(true);
                }}
              />
            )}
            title=""
            subtitle=""
            newButtonText=""
            newButtonLink=""
            isLoading={loadingMisTorneos}
            gridClassName="grid-cols-1 lg:grid-cols-2 gap-6"
            renderFilters={TournamentFilters}
            renderPagination={TournamentPagination}
            serverPagination={{
              totalRecords: paginationInfoMis.totalRecords,
              pageNumber: paginationInfoMis.pageNumber,
              pageSize: sharedPageSize
            }}
            onPaginationChange={(page, size) => {
              if (size && size !== sharedPageSize) {
                // Si cambió el tamaño de página, usar función compartida
                handleSharedPageSizeChange(size);
              } else {
                // Si solo cambió la página, usar handlePageChange
                handlePageChangeMis(page);
              }
            }}
            onRefresh={refreshMisTorneos}
          />

          {/* Cards de Estadísticas al final */}
          <TournamentStatsCards
            torneos={getFilteredParticipatingTorneos}
            title="Estadísticas de Torneos Participando"
          />
        </div>
      )}
      {showBracketModal && selectedTournamentForBracket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Bracket del Torneo</h2>
                <p className="text-white/80 mt-1">{selectedTournamentForBracket.nombre}</p>
              </div>
              <button
                onClick={() => setShowBracketModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              <TournamentBracket
                tournamentId={selectedTournamentForBracket.id.toString()}
                tournamentName={selectedTournamentForBracket.nombre}
                format="single_elimination"
                participants={[
                  'Estral Esports', 'Timbers Esports', 'Atheris Esports', 'Pixel Esports',
                  'Chivas Esports', 'Infinity Esports', 'Mexico Esports Team'
                ]}
                matches={[
                  {
                    id: '1',
                    round: 1,
                    matchNumber: 1,
                    player1: 'Estral Esports',
                    player2: 'Timbers Esports',
                    player1Score: 16,
                    player2Score: 14,
                    status: 'completed',
                    winner: 'Estral Esports',
                    scheduledTime: '2024-03-15 14:00',
                    duration: '45 min'
                  },
                  {
                    id: '2',
                    round: 1,
                    matchNumber: 2,
                    player1: 'Atheris Esports',
                    player2: 'Pixel Esports',
                    player1Score: 0,
                    player2Score: 0,
                    status: 'pending',
                    winner: '',
                    scheduledTime: '2024-03-15 16:00',
                    duration: '45 min'
                  },
                  {
                    id: '3',
                    round: 2,
                    matchNumber: 1,
                    player1: 'Estral Esports',
                    player2: 'TBD',
                    player1Score: 0,
                    player2Score: 0,
                    status: 'pending',
                    winner: '',
                    scheduledTime: '2024-03-16 14:00',
                    duration: '45 min'
                  }
                ]}
                onMatchUpdate={(_matchId: string, _winner: string, _scores: { player1: number, player2: number }) => {
                  // Aquí se actualizaría el resultado en la base de datos
                }}
              />
            </div>
          </div>
        </div>
      )}
      {showChartModal && selectedTournamentForChart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowChartModal(false)}>
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Gráfico del Torneo</h2>
                <p className="text-white/80 mt-1">{selectedTournamentForChart.nombre}</p>
              </div>
              <button
                onClick={() => setShowChartModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab('standings')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${activeTab === 'standings'
                  ? 'text-white border-b-2 border-blue-500 bg-blue-500/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Tabla de Calificaciones</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bracket')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${activeTab === 'bracket'
                  ? 'text-white border-b-2 border-green-500 bg-green-500/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  <span>Gráfico de Fase Final</span>
                </div>
              </button>
            </div>

            <div className="p-6 overflow-auto h-[calc(90vh-200px)]">
              {activeTab === 'standings' ? (
                <StandingsTable
                  participants={[
                    { id: '1', name: 'Estral Esports', team: 'Estral', seed: 1, icon: '🦅' },
                    { id: '2', name: 'Timbers Esports', team: 'Timbers', seed: 2, icon: '🪓' },
                    { id: '3', name: 'Atheris Esports', team: 'Atheris', seed: 3, icon: '🐍' },
                    { id: '4', name: 'Pixel Esports', team: 'Pixel', seed: 4, icon: '🎮' },
                    { id: '5', name: 'Chivas Esports', team: 'Chivas', seed: 5, icon: '🐐' },
                    { id: '6', name: 'Infinity Esports', team: 'Infinity', seed: 6, icon: '♾️' },
                    { id: '7', name: 'Mexico Esports Team', team: 'MET', seed: 7, icon: '🦅' }
                  ]}
                  standings={[
                    { participant: { id: '1', name: 'Estral Esports', team: 'Estral', seed: 1, icon: '🦅' }, position: 1, points: 14, matchesPlayed: 6, perfectWins: 3, wins: 2, draws: 1, losses: 0, mapDifference: 8, roundDifference: 35 },
                    { participant: { id: '2', name: 'Timbers Esports', team: 'Timbers', seed: 2, icon: '🪓' }, position: 2, points: 10, matchesPlayed: 6, perfectWins: 2, wins: 1, draws: 2, losses: 1, mapDifference: 4, roundDifference: 15 },
                    { participant: { id: '3', name: 'Atheris Esports', team: 'Atheris', seed: 3, icon: '🐍' }, position: 3, points: 7, matchesPlayed: 6, perfectWins: 0, wins: 3, draws: 1, losses: 2, mapDifference: 0, roundDifference: 0 },
                    { participant: { id: '4', name: 'Pixel Esports', team: 'Pixel', seed: 4, icon: '🎮' }, position: 4, points: 6, matchesPlayed: 6, perfectWins: 1, wins: 0, draws: 3, losses: 2, mapDifference: 0, roundDifference: 1 },
                    { participant: { id: '5', name: 'Chivas Esports', team: 'Chivas', seed: 5, icon: '🐐' }, position: 5, points: 6, matchesPlayed: 6, perfectWins: 0, wins: 1, draws: 4, losses: 1, mapDifference: 0, roundDifference: -1 },
                    { participant: { id: '6', name: 'Infinity Esports', team: 'Infinity', seed: 6, icon: '♾️' }, position: 6, points: 4, matchesPlayed: 6, perfectWins: 1, wins: 0, draws: 1, losses: 4, mapDifference: -5, roundDifference: -17 },
                    { participant: { id: '7', name: 'Mexico Esports Team', team: 'MET', seed: 7, icon: '🦅' }, position: 7, points: 2, matchesPlayed: 6, perfectWins: 0, wins: 0, draws: 2, losses: 4, mapDifference: -7, roundDifference: -33 }
                  ]}
                  tournamentName={selectedTournamentForChart.nombre}
                  onClose={() => setShowChartModal(false)}
                  isEmbedded={true}
                  onTeamClick={handleTeamClick}
                />
              ) : (
                <BracketVisualChart
                  participants={[
                    { id: '1', name: 'Estral Esports', team: 'Estral', seed: 1, icon: '🦅' },
                    { id: '2', name: 'Timbers Esports', team: 'Timbers', seed: 2, icon: '🪓' },
                    { id: '3', name: 'Atheris Esports', team: 'Atheris', seed: 3, icon: '🐍' },
                    { id: '4', name: 'Pixel Esports', team: 'Pixel', seed: 4, icon: '🎮' },
                    { id: '5', name: 'Chivas Esports', team: 'Chivas', seed: 5, icon: '🐐' },
                    { id: '6', name: 'Infinity Esports', team: 'Infinity', seed: 6, icon: '♾️' },
                    { id: '7', name: 'Mexico Esports Team', team: 'MET', seed: 7, icon: '🦅' }
                  ]}
                  configuredMatches={[
                    {
                      id: '1',
                      round: 1,
                      matchNumber: 1,
                      player1: 'Estral Esports',
                      player2: 'Timbers Esports',
                      scheduledTime: '2024-03-15 14:00'
                    },
                    {
                      id: '2',
                      round: 1,
                      matchNumber: 2,
                      player1: 'Atheris Esports',
                      player2: 'Pixel Esports',
                      scheduledTime: '2024-03-15 16:00'
                    }
                  ]}
                  tournamentName={selectedTournamentForChart.nombre}
                  format="single_elimination"
                  onSaveConfiguration={(_matches) => {
                  }}
                  onClose={() => setShowChartModal(false)}
                  isEmbedded={true}
                  currentPhase="final"
                  onPhaseChange={(_phase) => {
                  }}
                  isReadOnly={true}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Información Detallada */}
      {showInfoModal && selectedTournamentForInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white">Información del Torneo</h2>
                <p className="text-white/80 mt-1">{selectedTournamentForInfo.nombre}</p>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Información General</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Juego:</span>
                        <span className="text-white">{selectedTournamentForInfo.juegoNombre || 'No especificado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Dificultad:</span>
                        <span className="text-white capitalize">{selectedTournamentForInfo.dificultad || 'Intermedio'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Premios y Costos</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Premio Total:</span>
                        <span className="text-white font-semibold">${selectedTournamentForInfo.premio || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Costo de Entrada:</span>
                        <span className="text-white font-semibold">${selectedTournamentForInfo.costoEntrada || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participantes y Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">Participantes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Registrados:</span>
                      <span className="text-white">{selectedTournamentForInfo.participantes || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Máximo:</span>
                      <span className="text-white">{selectedTournamentForInfo.maxParticipantes || 120}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((selectedTournamentForInfo.participantes || 0) / (selectedTournamentForInfo.maxParticipantes || 120)) * 100}%` }}
                      />
                    </div>
                    <div className="text-center text-xs text-white/60 mt-1">
                      {Math.round(((selectedTournamentForInfo.participantes || 0) / (selectedTournamentForInfo.maxParticipantes || 120)) * 100)}% completo
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Fechas Importantes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Fecha de Inicio:</span>
                      <span className="text-white">
                        {selectedTournamentForInfo.fechaInicio ? new Date(selectedTournamentForInfo.fechaInicio).toLocaleDateString() : 'Por definir'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Fecha de Fin:</span>
                      <span className="text-white">
                        {selectedTournamentForInfo.fechaFin ? new Date(selectedTournamentForInfo.fechaFin).toLocaleDateString() : 'Por definir'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción adicional si existe */}
              {(selectedTournamentForInfo.descripcion || selectedTournamentForInfo.reglas) && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Información Adicional</h3>
                  <div className="space-y-3 text-sm">
                    {selectedTournamentForInfo.descripcion && (
                      <div>
                        <span className="text-white/60 font-medium">Descripción:</span>
                        <p className="text-white/80 mt-1">{selectedTournamentForInfo.descripcion}</p>
                      </div>
                    )}
                    {selectedTournamentForInfo.reglas && (
                      <div>
                        <span className="text-white/60 font-medium">Reglas:</span>
                        <p className="text-white/80 mt-1">{selectedTournamentForInfo.reglas}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Botón de Unirse - Solo mostrar en tab "Todos los Torneos" */}
            {activeMainTab === 'todos' && selectedTournamentForInfo && (
              <div className="p-6 border-t border-white/10">
                {(() => {
                  const availableSpots = (selectedTournamentForInfo.maxParticipantes || 120) - (selectedTournamentForInfo.participantes || 0);
                  const hasAvailableSpots = availableSpots > 0;
                  const isActive = selectedTournamentForInfo.isActive;
                  const canJoin = hasAvailableSpots && isActive;

                  return (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-white/60 text-sm">Cupos disponibles</p>
                          <p className={`text-lg font-bold ${hasAvailableSpots ? 'text-green-400' : 'text-red-400'}`}>
                            {availableSpots}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleJoinTournament(selectedTournamentForInfo)}
                        disabled={!canJoin}
                        className={`
                          px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2
                          ${canJoin
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        <Users className="w-4 h-4" />
                        {canJoin ? 'Unirse al Torneo' : 'No disponible'}
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Barra lateral de estadísticas de equipos */}
      {showSidebar && (
        <TeamStatsSidebar
          isOpen={showSidebar}
          onClose={handleCloseSidebar}
          tournamentName={selectedTournamentForChart?.nombre || 'Torneo'}
          initialTeam={selectedTeamForSidebar}
          showBackButton={false}
        />
      )}

    </div>
  );
};

export default TorneosPage;