import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Shuffle,
  Save,
  AlertCircle,
  CheckCircle,
  Trophy,
  Target,
  ArrowRight,
  Settings,
  Eye,
  EyeOff,
  BarChart3,
  Edit,
  Check,
  XCircle,
  Clock
} from 'lucide-react';
import BracketVisualChart from './BracketVisualChart';
import StandingsTable from './StandingsTable';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';

interface Participant {
  id: string;
  name: string;
  team?: string;
  seed?: number;
  logo?: string; // URL del logo del equipo
  icon?: string; // Emoji o icono del equipo
}

interface MatchConfig {
  id: string;
  round: number;
  matchNumber: number;
  player1: string;
  player2: string;
  scheduledTime?: string;
  venue?: string;
  notes?: string;
}

interface MatchResult {
  id: string;
  player1Score: number;
  player2Score: number;
  winner: string;
  status: 'pending' | 'completed' | 'cancelled';
  duration?: string;
  notes?: string;
  // Nuevos campos para estadísticas detalladas
  player1Points: number;
  player2Points: number;
  player1MapDifference: number;
  player2MapDifference: number;
  player1RoundDifference: number;
  player2RoundDifference: number;
  perfectWin: boolean; // Victoria perfecta (2-0)
  // Puntos individuales por jugador
  playerStats: {
    [playerName: string]: {
      points: number;
      kills: number;
      assists: number;
      deaths: number;
      kda: number;
      roundsWon: number;
      roundsPlayed: number;
    }
  };
}

interface MatchConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  participants: Participant[];
  tournamentName: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  onSaveConfiguration: (matches: MatchConfig[]) => void;
  existingMatches?: MatchConfig[];
}

const MatchConfigurationModal: React.FC<MatchConfigurationModalProps> = ({
  isOpen,
  onClose,
  participants,
  tournamentName,
  format,
  onSaveConfiguration,
  existingMatches = []
}) => {
  const [matches, setMatches] = useState<MatchConfig[]>([]);
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [configurationMethod, setConfigurationMethod] = useState<'manual' | 'random' | 'seeded'>('manual');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'config' | 'results' | 'visual'>('config');
  const [currentPhase, setCurrentPhase] = useState<'initial' | 'final'>('initial');
  const [standingsData, setStandingsData] = useState<any[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [editingResult, setEditingResult] = useState<string | null>(null);
  const [showDetailedStats, setShowDetailedStats] = useState<string | null>(null);
  const [showPlayerStats, setShowPlayerStats] = useState<string | null>(null);
  const [editingPlayerStats, setEditingPlayerStats] = useState<{ matchId: string, playerName: string } | null>(null);
  const [activePlayerTeamTab, setActivePlayerTeamTab] = useState<string>('');

  // Inicializar participantes disponibles
  useEffect(() => {
    if (isOpen) {
      setAvailableParticipants([...participants]);
      setSelectedParticipants([]);
      if (existingMatches.length > 0) {
        setMatches(existingMatches);
        // Marcar participantes ya asignados
        const assignedParticipants = new Set();
        existingMatches.forEach(match => {
          assignedParticipants.add(match.player1);
          assignedParticipants.add(match.player2);
        });
        setAvailableParticipants(participants.filter(p => !assignedParticipants.has(p.name)));
      } else {
        setMatches([]);
      }
      // Generar datos iniciales de clasificación
      setStandingsData(generateMockStandings());
    }
  }, [isOpen, participants, existingMatches]);

  // Actualizar datos de clasificación cuando se cambie a la fase inicial
  useEffect(() => {
    if (activeTab === 'visual' && currentPhase === 'initial') {
      setStandingsData(generateMockStandings());
    }
  }, [activeTab, currentPhase, participants]);

  // Función para obtener o crear resultado de partida
  const getOrCreateMatchResult = (matchId: string): MatchResult => {
    const existingResult = matchResults.find(r => r.id === matchId);
    if (existingResult) {
      return existingResult;
    }
    return {
      id: matchId,
      player1Score: 0,
      player2Score: 0,
      winner: '',
      status: 'pending',
      player1Points: 0,
      player2Points: 0,
      player1MapDifference: 0,
      player2MapDifference: 0,
      player1RoundDifference: 0,
      player2RoundDifference: 0,
      perfectWin: false,
      playerStats: {}
    };
  };

  // Función para actualizar resultado de partida
  const updateMatchResult = (matchId: string, result: Partial<MatchResult>) => {
    setMatchResults(prev => {
      const existingIndex = prev.findIndex(r => r.id === matchId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const currentResult = updated[existingIndex];

        // Si se están actualizando los scores, calcular automáticamente las estadísticas
        if (result.player1Score !== undefined || result.player2Score !== undefined) {
          const newPlayer1Score = result.player1Score ?? currentResult.player1Score;
          const newPlayer2Score = result.player2Score ?? currentResult.player2Score;
          const stats = calculateMatchStats(newPlayer1Score, newPlayer2Score);

          updated[existingIndex] = {
            ...currentResult,
            ...result,
            ...stats
          };
        } else {
          updated[existingIndex] = { ...currentResult, ...result };
        }

        return updated;
      } else {
        return [...prev, { ...getOrCreateMatchResult(matchId), ...result }];
      }
    });
  };

  // Función para determinar el ganador automáticamente
  const determineWinner = (player1Score: number, player2Score: number): string => {
    if (player1Score > player2Score) return 'player1';
    if (player2Score > player1Score) return 'player2';
    return '';
  };

  // Función para calcular estadísticas detalladas del partido
  const calculateMatchStats = (player1Score: number, player2Score: number) => {
    const winner = determineWinner(player1Score, player2Score);
    const mapDifference = Math.abs(player1Score - player2Score);
    const perfectWin = (player1Score === 2 && player2Score === 0) || (player1Score === 0 && player2Score === 2);

    // Calcular puntos según el sistema R6S
    let player1Points = 0;
    let player2Points = 0;

    if (winner === 'player1') {
      player1Points = perfectWin ? 3 : 2; // Victoria perfecta = 3 puntos, victoria normal = 2 puntos
      player2Points = 0;
    } else if (winner === 'player2') {
      player2Points = perfectWin ? 3 : 2;
      player1Points = 0;
    } else {
      // Empate
      player1Points = 1;
      player2Points = 1;
    }

    return {
      winner,
      player1Points,
      player2Points,
      player1MapDifference: player1Score - player2Score,
      player2MapDifference: player2Score - player1Score,
      player1RoundDifference: 0, // Se puede calcular si se tienen datos de rondas
      player2RoundDifference: 0,
      perfectWin
    };
  };

  // Función para obtener o crear estadísticas de jugador
  const getOrCreatePlayerStats = (matchId: string, playerName: string) => {
    const result = getOrCreateMatchResult(matchId);
    if (!result.playerStats[playerName]) {
      result.playerStats[playerName] = {
        points: 0,
        kills: 0,
        assists: 0,
        deaths: 0,
        kda: 0,
        roundsWon: 0,
        roundsPlayed: 0
      };
    }
    return result.playerStats[playerName];
  };

  // Función para actualizar estadísticas de jugador
  const updatePlayerStats = (matchId: string, playerName: string, stats: Partial<MatchResult['playerStats'][string]>) => {
    setMatchResults(prev => {
      const existingIndex = prev.findIndex(r => r.id === matchId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const currentResult = updated[existingIndex];

        // Asegurar que playerStats existe
        if (!currentResult.playerStats) {
          currentResult.playerStats = {};
        }

        // Obtener estadísticas actuales del jugador
        const currentStats = currentResult.playerStats[playerName] || {
          points: 0,
          kills: 0,
          assists: 0,
          deaths: 0,
          kda: 0,
          roundsWon: 0,
          roundsPlayed: 0
        };

        // Actualizar estadísticas
        const newStats = { ...currentStats, ...stats };

        // Calcular KDA automáticamente
        if (stats.kills !== undefined || stats.assists !== undefined || stats.deaths !== undefined) {
          const kills = stats.kills ?? currentStats.kills;
          const assists = stats.assists ?? currentStats.assists;
          const deaths = stats.deaths ?? currentStats.deaths;
          newStats.kda = deaths > 0 ? ((kills + assists) / deaths) : (kills + assists);
        }

        updated[existingIndex] = {
          ...currentResult,
          playerStats: {
            ...currentResult.playerStats,
            [playerName]: newStats
          }
        };

        return updated;
      } else {
        // Crear nuevo resultado si no existe
        const newResult = getOrCreateMatchResult(matchId);
        newResult.playerStats[playerName] = {
          points: 0,
          kills: 0,
          assists: 0,
          deaths: 0,
          kda: 0,
          roundsWon: 0,
          roundsPlayed: 0,
          ...stats
        };
        return [...prev, newResult];
      }
    });
  };

  // Función para obtener jugadores del equipo (mock - en un caso real vendría de la base de datos)
  const getTeamPlayers = (teamName: string) => {
    // Simular jugadores del equipo - en un caso real esto vendría de la base de datos
    const mockPlayers = {
      'Estral Esports': ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'],
      'Timbers Esports': ['PlayerA', 'PlayerB', 'PlayerC', 'PlayerD', 'PlayerE'],
      'Team Liquid': ['Liquid1', 'Liquid2', 'Liquid3', 'Liquid4', 'Liquid5'],
      'FaZe Clan': ['FaZe1', 'FaZe2', 'FaZe3', 'FaZe4', 'FaZe5'],
      'G2 Esports': ['G2_1', 'G2_2', 'G2_3', 'G2_4', 'G2_5'],
      'Natus Vincere': ['NaVi1', 'NaVi2', 'NaVi3', 'NaVi4', 'NaVi5']
    };

    return mockPlayers[teamName as keyof typeof mockPlayers] || ['Jugador1', 'Jugador2', 'Jugador3', 'Jugador4', 'Jugador5'];
  };

  // Función para renderizar card de partida con DynamicCardList
  const renderMatchCard = (match: MatchConfig) => {
    const result = getOrCreateMatchResult(match.id);
    const isEditing = editingResult === match.id;

    return (
      <div className={`border border-white/10 rounded-lg p-4 ${result.status === 'completed' ? 'bg-green-500/10 border-green-500/30' :
          result.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30' :
            'bg-red-500/10 border-red-500/30'
        }`}>
        {/* Header de la partida */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-white">
              Partida #{match.matchNumber} - Ronda {match.round}
            </h4>
            <p className="text-sm text-white/60">
              {match.scheduledTime ? new Date(match.scheduledTime).toLocaleString() : 'Sin fecha programada'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Botones de acción en la esquina superior derecha */}
            {isEditing ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    updateMatchResult(match.id, { status: 'completed' });
                    setEditingResult(null);
                  }}
                  className="p-1.5 bg-green-500/20 border border-green-500/30 text-green-400 rounded hover:bg-green-500/30 transition-all duration-200"
                  title="Completar partida"
                >
                  <Check className="h-3 w-3" />
                </button>
                <button
                  onClick={() => {
                    updateMatchResult(match.id, { status: 'pending' });
                    setEditingResult(null);
                  }}
                  className="p-1.5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded hover:bg-yellow-500/30 transition-all duration-200"
                  title="Poner en pendiente"
                >
                  <Clock className="h-3 w-3" />
                </button>
                <button
                  onClick={() => {
                    updateMatchResult(match.id, { status: 'cancelled' });
                    setEditingResult(null);
                  }}
                  className="p-1.5 bg-red-500/20 border border-red-500/30 text-red-400 rounded hover:bg-red-500/30 transition-all duration-200"
                  title="Cancelar partida"
                >
                  <XCircle className="h-3 w-3" />
                </button>
                <button
                  onClick={() => setEditingResult(null)}
                  className="p-1.5 bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-all duration-200"
                  title="Cancelar edición"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingResult(match.id)}
                className="p-1.5 hover:bg-white/10 rounded transition-colors duration-200"
                title="Editar resultado"
              >
                <Edit className="h-4 w-4 text-white/60" />
              </button>
            )}
          </div>
        </div>

        {/* Contenido de la partida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Jugador 1 */}
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-2">{match.player1}</div>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="2"
                value={result.player1Score}
                onChange={(e) => {
                  const newScore = parseInt(e.target.value) || 0;
                  updateMatchResult(match.id, {
                    player1Score: newScore
                  });
                }}
                className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-center text-lg font-bold"
              />
            ) : (
              <div className="text-3xl font-bold text-white">{result.player1Score}</div>
            )}

            {/* Mostrar puntos del jugador 1 */}
            {result.status === 'completed' && (
              <div className="text-sm text-green-400 font-medium mt-1">
                {result.player1Points} pts
              </div>
            )}
          </div>

          {/* VS - Centro con ganador y perdedor */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white/60 mb-2">VS</div>

            {/* Mostrar ganador y perdedor cuando la partida está completada */}
            {result.status === 'completed' && result.winner && (
              <div className="space-y-2">
                <div className="text-sm text-green-400 font-medium">
                  Ganador: {result.winner === 'player1' ? match.player1 : match.player2}
                </div>
                <div className="text-sm text-red-400 font-medium">
                  Perdedor: {result.winner === 'player1' ? match.player2 : match.player1}
                </div>
                {result.perfectWin && (
                  <div className="text-xs text-orange-400 font-medium">
                    Victoria Perfecta
                  </div>
                )}
              </div>
            )}

            {/* Mostrar empate si no hay ganador pero la partida está completada */}
            {result.status === 'completed' && !result.winner && result.player1Score === result.player2Score && (
              <div className="text-sm text-yellow-400 font-medium">
                Empate
              </div>
            )}

            {/* Botones para ver estadísticas */}
            {result.status === 'completed' && (
              <div className="space-y-2 mt-3">
                <button
                  onClick={() => setShowDetailedStats(showDetailedStats === match.id ? null : match.id)}
                  className="w-full px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-all duration-200"
                >
                  {showDetailedStats === match.id ? 'Ocultar' : 'Ver'} Estadísticas del Partido
                </button>
                <button
                  onClick={() => {
                    if (showPlayerStats === match.id) {
                      setShowPlayerStats(null);
                      setActivePlayerTeamTab('');
                    } else {
                      setShowPlayerStats(match.id);
                      setActivePlayerTeamTab(`${match.id}-${match.player1}`);
                    }
                  }}
                  className="w-full px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded text-xs hover:bg-purple-500/30 transition-all duration-200"
                >
                  {showPlayerStats === match.id ? 'Ocultar' : 'Ver'} Estadísticas de Jugadores
                </button>
              </div>
            )}
          </div>

          {/* Jugador 2 */}
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-2">{match.player2}</div>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="2"
                value={result.player2Score}
                onChange={(e) => {
                  const newScore = parseInt(e.target.value) || 0;
                  updateMatchResult(match.id, {
                    player2Score: newScore
                  });
                }}
                className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-center text-lg font-bold"
              />
            ) : (
              <div className="text-3xl font-bold text-white">{result.player2Score}</div>
            )}

            {/* Mostrar puntos del jugador 2 */}
            {result.status === 'completed' && (
              <div className="text-sm text-green-400 font-medium mt-1">
                {result.player2Points} pts
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas detalladas */}
        {showDetailedStats === match.id && result.status === 'completed' && (
          <div className="mt-4 p-4 bg-gray-800/80 rounded-lg border border-white/10">
            <h5 className="text-sm font-semibold text-white mb-3">Estadísticas Detalladas</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xs text-white/60 mb-1">Puntos {match.player1}</div>
                <div className="text-lg font-bold text-green-400">{result.player1Points}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-white/60 mb-1">Puntos {match.player2}</div>
                <div className="text-lg font-bold text-green-400">{result.player2Points}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-white/60 mb-1">Diferencia de Mapas</div>
                <div className="text-lg font-bold text-blue-400">{result.player1MapDifference}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-white/60 mb-1">Victoria Perfecta</div>
                <div className="text-lg font-bold text-orange-400">{result.perfectWin ? 'Sí' : 'No'}</div>
              </div>
            </div>

            {/* Selector de ganador automático */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <h6 className="text-sm font-semibold text-white mb-2">Seleccionar Ganador</h6>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Score {match.player1}</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    value={result.player1Score}
                    onChange={(e) => {
                      const newScore = parseInt(e.target.value) || 0;
                      updateMatchResult(match.id, { player1Score: newScore });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-white/60 text-sm">VS</span>
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Score {match.player2}</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    value={result.player2Score}
                    onChange={(e) => {
                      const newScore = parseInt(e.target.value) || 0;
                      updateMatchResult(match.id, { player2Score: newScore });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                  />
                </div>
              </div>

              {/* Resultado automático */}
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-xs text-white/60 mb-2">Resultado Automático:</div>
                <div className="space-y-1">
                  {result.winner ? (
                    <>
                      <div className="text-sm text-green-400 font-medium">
                        Ganador: {result.winner === 'player1' ? match.player1 : match.player2}
                      </div>
                      <div className="text-sm text-red-400 font-medium">
                        Perdedor: {result.winner === 'player1' ? match.player2 : match.player1}
                      </div>
                      {result.perfectWin && (
                        <div className="text-xs text-orange-400 font-medium">
                          Victoria Perfecta (2-0)
                        </div>
                      )}
                    </>
                  ) : result.player1Score === result.player2Score && result.player1Score > 0 ? (
                    <div className="text-sm text-yellow-400 font-medium">
                      Empate
                    </div>
                  ) : (
                    <div className="text-sm text-white/60">
                      Ingresa los scores para determinar el ganador
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Editor de puntos manual */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <h6 className="text-sm font-semibold text-white mb-2">Editar Puntos Manualmente</h6>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/60 mb-1">Puntos {match.player1}</label>
                  <input
                    type="number"
                    min="0"
                    value={result.player1Points}
                    onChange={(e) => {
                      const newPoints = parseInt(e.target.value) || 0;
                      updateMatchResult(match.id, { player1Points: newPoints });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1">Puntos {match.player2}</label>
                  <input
                    type="number"
                    min="0"
                    value={result.player2Points}
                    onChange={(e) => {
                      const newPoints = parseInt(e.target.value) || 0;
                      updateMatchResult(match.id, { player2Points: newPoints });
                    }}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas de Jugadores */}
        {showPlayerStats === match.id && result.status === 'completed' && (
          <div className="mt-4 p-4 bg-gray-800/80 rounded-lg border border-white/10">
            <h5 className="text-sm font-semibold text-white mb-3">Estadísticas de Jugadores</h5>

            {/* Tabs por equipo */}
            <div className="flex border-b border-white/10 mb-4">
              <button
                onClick={() => setActivePlayerTeamTab(`${match.id}-${match.player1}`)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 ${activePlayerTeamTab === `${match.id}-${match.player1}`
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                {match.player1}
              </button>
              <button
                onClick={() => setActivePlayerTeamTab(`${match.id}-${match.player2}`)}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-all duration-200 ${activePlayerTeamTab === `${match.id}-${match.player2}`
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                {match.player2}
              </button>
            </div>

            {/* Contenido del tab activo */}
            {(activePlayerTeamTab === `${match.id}-${match.player1}` || activePlayerTeamTab === '') && (
              <div className="space-y-2">
                {getTeamPlayers(match.player1).map((playerName) => {
                  const playerStats = getOrCreatePlayerStats(match.id, playerName);
                  const isEditing = editingPlayerStats?.matchId === match.id && editingPlayerStats?.playerName === playerName;

                  return (
                    <div key={playerName} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{playerName}</span>
                        <button
                          onClick={() => setEditingPlayerStats(isEditing ? null : { matchId: match.id, playerName })}
                          className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                        >
                          <Edit className="h-3 w-3 text-white/60" />
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Puntos</label>
                            <input
                              type="number"
                              min="0"
                              value={playerStats.points}
                              onChange={(e) => {
                                const newPoints = parseInt(e.target.value) || 0;
                                updatePlayerStats(match.id, playerName, { points: newPoints });
                              }}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Kills</label>
                            <input
                              type="number"
                              min="0"
                              value={playerStats.kills}
                              onChange={(e) => {
                                const newKills = parseInt(e.target.value) || 0;
                                updatePlayerStats(match.id, playerName, { kills: newKills });
                              }}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Asistencias</label>
                            <input
                              type="number"
                              min="0"
                              value={playerStats.assists}
                              onChange={(e) => {
                                const newAssists = parseInt(e.target.value) || 0;
                                updatePlayerStats(match.id, playerName, { assists: newAssists });
                              }}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Muertes</label>
                            <input
                              type="number"
                              min="0"
                              value={playerStats.deaths}
                              onChange={(e) => {
                                const newDeaths = parseInt(e.target.value) || 0;
                                updatePlayerStats(match.id, playerName, { deaths: newDeaths });
                              }}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-white/60">Puntos</div>
                            <div className="text-green-400 font-bold">{playerStats.points}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/60">Kills</div>
                            <div className="text-blue-400 font-bold">{playerStats.kills}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/60">Asistencias</div>
                            <div className="text-yellow-400 font-bold">{playerStats.assists}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/60">KDA</div>
                            <div className="text-purple-400 font-bold">{playerStats.kda.toFixed(2)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activePlayerTeamTab === `${match.id}-${match.player2}` && (
              <div className="space-y-2">
                {getTeamPlayers(match.player2).map((playerName) => {
                  const playerStats = getOrCreatePlayerStats(match.id, playerName);
                  const isEditing = editingPlayerStats?.matchId === match.id && editingPlayerStats?.playerName === playerName;

                  return (
                    <div key={playerName} className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{playerName}</span>
                        <button
                          onClick={() => setEditingPlayerStats(isEditing ? null : { matchId: match.id, playerName })}
                          className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                        >
                          <Edit className="h-3 w-3 text-white/60" />
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Puntos</label>
                            <input
                              type="number"
                              min="0"
                              value={playerStats.points}
                              onChange={(e) => {
                                const newPoints = parseInt(e.target.value) || 0;
                                updatePlayerStats(match.id, playerName, { points: newPoints });
                              }}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Kills</label>
                            <input
                              type="number"
                              min="0"
                              value={playerStats.kills}
                              onChange={(e) => {
                                const newKills = parseInt(e.target.value) || 0;
                                updatePlayerStats(match.id, playerName, { kills: newKills });
                              }}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Asistencias</label>
                            <input
                              type="number"
                              min="0"
                              value={playerStats.assists}
                              onChange={(e) => {
                                const newAssists = parseInt(e.target.value) || 0;
                                updatePlayerStats(match.id, playerName, { assists: newAssists });
                              }}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-white/60 mb-1">Muertes</label>
                            <input
                              type="number"
                              min="0"
                              value={playerStats.deaths}
                              onChange={(e) => {
                                const newDeaths = parseInt(e.target.value) || 0;
                                updatePlayerStats(match.id, playerName, { deaths: newDeaths });
                              }}
                              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-white/60">Puntos</div>
                            <div className="text-green-400 font-bold">{playerStats.points}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/60">Kills</div>
                            <div className="text-blue-400 font-bold">{playerStats.kills}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/60">Asistencias</div>
                            <div className="text-yellow-400 font-bold">{playerStats.assists}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-white/60">KDA</div>
                            <div className="text-purple-400 font-bold">{playerStats.kda.toFixed(2)}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Información adicional */}
        {result.notes && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-white/60 mb-1">Notas:</div>
            <div className="text-sm text-white">{result.notes}</div>
          </div>
        )}
      </div>
    );
  };

  // Calcular número de partidas necesarias
  const calculateRequiredMatches = () => {
    const participantCount = participants.length;
    if (format === 'single_elimination') {
      return participantCount - 1;
    } else if (format === 'double_elimination') {
      return (participantCount - 1) * 2;
    } else if (format === 'round_robin') {
      return (participantCount * (participantCount - 1)) / 2;
    }
    return participantCount - 1; // Default
  };

  const requiredMatches = calculateRequiredMatches();

  // Generar datos mock para la tabla de calificación
  const generateMockStandings = () => {
    const standings = participants.map((participant, index) => {
      const matchesPlayed = Math.floor(Math.random() * 8) + 6; // 6-13 partidas
      const wins = Math.floor(Math.random() * (matchesPlayed - 2)) + 2; // Al menos 2 victorias
      const losses = Math.floor(Math.random() * (matchesPlayed - wins - 1)) + 1; // Al menos 1 derrota
      const draws = matchesPlayed - wins - losses;
      const points = (wins * 3) + draws;
      const goalsFor = Math.floor(Math.random() * 25) + 15; // 15-39 goles
      const goalsAgainst = Math.floor(Math.random() * 20) + 10; // 10-29 goles
      const goalDifference = goalsFor - goalsAgainst;

      return {
        participant,
        position: index + 1,
        points,
        matchesPlayed,
        wins,
        losses,
        draws,
        goalsFor,
        goalsAgainst,
        goalDifference
      };
    });

    // Ordenar por puntos (descendente), luego por diferencia de goles, luego por goles a favor
    return standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    }).map((standing, index) => ({
      ...standing,
      position: index + 1
    }));
  };

  // Validar configuración
  const validateConfiguration = () => {
    const errors: string[] = [];

    if (matches.length < requiredMatches) {
      errors.push(`Se requieren al menos ${requiredMatches} partidas para este formato`);
    }

    const assignedParticipants = new Set();
    matches.forEach(match => {
      if (match.player1 && match.player2) {
        if (assignedParticipants.has(match.player1)) {
          errors.push(`${match.player1} está asignado en múltiples partidas`);
        }
        if (assignedParticipants.has(match.player2)) {
          errors.push(`${match.player2} está asignado en múltiples partidas`);
        }
        assignedParticipants.add(match.player1);
        assignedParticipants.add(match.player2);
      }
    });

    const unassignedCount = participants.length - assignedParticipants.size;
    if (unassignedCount > 0) {
      errors.push(`${unassignedCount} participantes no han sido asignados`);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Generar configuración automática
  const generateAutomaticConfiguration = async () => {
    setIsGenerating(true);

    // Simular delay para mostrar loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    const shuffledParticipants = [...participants];

    if (configurationMethod === 'seeded') {
      // Ordenar por seed
      shuffledParticipants.sort((a, b) => (a.seed || 999) - (b.seed || 999));
    } else if (configurationMethod === 'random') {
      // Mezclar aleatoriamente
      for (let i = shuffledParticipants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledParticipants[i], shuffledParticipants[j]] = [shuffledParticipants[j], shuffledParticipants[i]];
      }
    }

    const newMatches: MatchConfig[] = [];
    let matchNumber = 1;

    // Generar partidas en pares
    for (let i = 0; i < shuffledParticipants.length - 1; i += 2) {
      if (i + 1 < shuffledParticipants.length) {
        newMatches.push({
          id: `match-${matchNumber}`,
          round: 1,
          matchNumber: matchNumber,
          player1: shuffledParticipants[i].name,
          player2: shuffledParticipants[i + 1].name,
          scheduledTime: new Date(Date.now() + (matchNumber * 2 * 60 * 60 * 1000)).toISOString(),
          venue: `Arena ${Math.ceil(matchNumber / 2)}`,
          notes: `Partida automática ${matchNumber}`
        });
        matchNumber++;
      }
    }

    // Si hay un participante impar, crear un "bye" o partida especial
    if (shuffledParticipants.length % 2 !== 0) {
      newMatches.push({
        id: `match-${matchNumber}`,
        round: 1,
        matchNumber: matchNumber,
        player1: shuffledParticipants[shuffledParticipants.length - 1].name,
        player2: 'BYE',
        scheduledTime: new Date(Date.now() + (matchNumber * 2 * 60 * 60 * 1000)).toISOString(),
        venue: 'Arena Especial',
        notes: 'Participante avanza automáticamente'
      });
    }

    setMatches(newMatches);
    setAvailableParticipants([]);
    setIsGenerating(false);
  };

  // Agregar partida manual
  const addManualMatch = () => {
    const newMatch: MatchConfig = {
      id: `match-${matches.length + 1}`,
      round: 1,
      matchNumber: matches.length + 1,
      player1: '',
      player2: '',
      scheduledTime: new Date(Date.now() + ((matches.length + 1) * 2 * 60 * 60 * 1000)).toISOString(),
      venue: `Arena ${Math.ceil((matches.length + 1) / 2)}`,
      notes: ''
    };
    setMatches([...matches, newMatch]);
  };

  // Actualizar partida
  const updateMatch = (matchId: string, field: keyof MatchConfig, value: string) => {
    setMatches(prev => prev.map(match =>
      match.id === matchId ? { ...match, [field]: value } : match
    ));
  };

  // Eliminar partida
  const removeMatch = (matchId: string) => {
    setMatches(prev => prev.filter(match => match.id !== matchId));
  };

  // Seleccionar participante
  const selectParticipant = (participant: Participant) => {
    setSelectedParticipants(prev => {
      if (prev.find(p => p.id === participant.id)) {
        return prev.filter(p => p.id !== participant.id);
      } else {
        return [...prev, participant];
      }
    });
  };

  // Asignar participantes seleccionados a la partida actual
  const assignSelectedToMatch = (matchId: string, position: 'player1' | 'player2') => {
    if (selectedParticipants.length > 0) {
      const participant = selectedParticipants[0];
      updateMatch(matchId, position, participant.name);
      setSelectedParticipants([]);
    }
  };

  // Guardar configuración
  const handleSave = () => {
    if (validateConfiguration()) {
      // Guardar tanto la configuración de partidas como los resultados
      const configurationWithResults = {
        matches: matches,
        results: matchResults
      };
      onSaveConfiguration(matches);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 z-[99999]">
      <div className="bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-[85vw] h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-orange-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Configuración de Partidas</h2>
              <p className="text-white/60 text-sm">{tournamentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${activeTab === 'config'
              ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <Settings className="h-4 w-4" />
            Configuración Inicial
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${activeTab === 'results'
              ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <Trophy className="h-4 w-4" />
            Resultados de Partidas
          </button>
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${activeTab === 'visual'
              ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
              : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
          >
            <BarChart3 className="h-4 w-4" />
            Gráfico Visual - Fases Eliminatorias
          </button>
        </div>

        {activeTab === 'config' && (
          <div className="flex min-h-[500px] max-h-[calc(80vh-220px)]">
            {/* Panel izquierdo - Participantes y configuración */}
            <div className="w-1/3 border-r border-white/10 p-4 overflow-y-auto max-h-full">
              {/* Método de configuración */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-3">Método de Configuración</h3>
                <div className="space-y-2">
                  {[
                    { key: 'manual', label: 'Manual', icon: Users },
                    { key: 'random', label: 'Aleatorio', icon: Shuffle }
                  ].map((method) => (
                    <button
                      key={method.key}
                      onClick={() => setConfigurationMethod(method.key as any)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${configurationMethod === method.key
                        ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                    >
                      <method.icon className="h-4 w-4" />
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Participantes disponibles */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">PARTICIPANTES</h3>
                  <span className="text-sm text-white/60">{availableParticipants.length} disponibles</span>
                </div>

                <div className="space-y-2 max-h-42 overflow-y-auto">
                  {availableParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`p-2 rounded-lg border cursor-pointer transition-all duration-200 ${selectedParticipants.find(p => p.id === participant.id)
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      onClick={() => selectParticipant(participant)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{participant.name}</span>
                        {participant.seed && (
                          <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-1 rounded">
                            Seed {participant.seed}
                          </span>
                        )}
                      </div>
                      {participant.team && (
                        <span className="text-xs text-white/60">{participant.team}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="space-y-3">
                {configurationMethod !== 'manual' && (
                  <button
                    onClick={generateAutomaticConfiguration}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-200 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-orange-400"></div>
                    ) : (
                      <Shuffle className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Generando...' : 'Generar Configuración'}
                  </button>
                )}

                <button
                  onClick={addManualMatch}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200"
                >
                  <Users className="h-4 w-4" />
                  Agregar Partida Manual
                </button>

                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-200"
                >
                  {showAdvancedOptions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  Opciones Avanzadas
                </button>
              </div>

              {/* Estadísticas */}
              <div className="mt-3 p-3 bg-white/5 rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-2">ESTADÍSTICAS</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Total Participantes:</span>
                    <span className="text-white">{participants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Partidas Configuradas:</span>
                    <span className="text-white">{matches.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Partidas Requeridas:</span>
                    <span className="text-white">{requiredMatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Formato:</span>
                    <span className="text-white">{format.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel derecho - Lista de partidas */}
            <div className="flex-1 p-4 overflow-y-auto max-h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Partidas Configuradas</h3>
                <div className="flex items-center gap-2">
                  {validationErrors.length > 0 ? (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {validationErrors.length} errores
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      Configuración válida
                    </div>
                  )}
                </div>
              </div>

              {/* Errores de validación */}
              {validationErrors.length > 0 && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="text-red-400 font-semibold mb-2">Errores de Validación:</h4>
                  <ul className="text-red-300 text-sm space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Lista de partidas */}
              <div className="space-y-2">
                {matches.map((match, index) => (
                  <div key={match.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">Partida {match.matchNumber}</h4>
                      <button
                        onClick={() => removeMatch(match.id)}
                        className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Jugador 1 */}
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Jugador 1</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={match.player1}
                            onChange={(e) => updateMatch(match.id, 'player1', e.target.value)}
                            placeholder="Seleccionar jugador"
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                          <button
                            onClick={() => assignSelectedToMatch(match.id, 'player1')}
                            disabled={selectedParticipants.length === 0}
                            className="px-3 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded hover:bg-orange-500/30 transition-all duration-200 disabled:opacity-50"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Jugador 2 */}
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Jugador 2</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={match.player2}
                            onChange={(e) => updateMatch(match.id, 'player2', e.target.value)}
                            placeholder="Seleccionar jugador"
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                          <button
                            onClick={() => assignSelectedToMatch(match.id, 'player2')}
                            disabled={selectedParticipants.length === 0}
                            className="px-3 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded hover:bg-orange-500/30 transition-all duration-200 disabled:opacity-50"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Opciones avanzadas */}
                    {showAdvancedOptions && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-1">Fecha y Hora</label>
                          <input
                            type="datetime-local"
                            value={match.scheduledTime ? match.scheduledTime.slice(0, 16) : ''}
                            onChange={(e) => updateMatch(match.id, 'scheduledTime', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-1">Venue/Arena</label>
                          <input
                            type="text"
                            value={match.venue || ''}
                            onChange={(e) => updateMatch(match.id, 'venue', e.target.value)}
                            placeholder="Arena 1"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-1">Notas</label>
                          <input
                            type="text"
                            value={match.notes || ''}
                            onChange={(e) => updateMatch(match.id, 'notes', e.target.value)}
                            placeholder="Notas adicionales"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {matches.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay partidas configuradas</p>
                    <p className="text-sm">Usa los controles del panel izquierdo para agregar partidas</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="min-h-[500px] max-h-[calc(80vh-220px)] overflow-y-auto p-4">
            {/* Header del tab de resultados */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Resultados de Partidas</h3>
              <p className="text-white/60 text-sm">
                Gestiona los resultados de las partidas configuradas. Los resultados se reflejarán automáticamente en la tabla de clasificación.
              </p>
            </div>

            {/* Estadísticas de resultados */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{matches.length}</div>
                <div className="text-sm text-white/60">Total Partidas</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {matchResults.filter(r => r.status === 'completed').length}
                </div>
                <div className="text-sm text-white/60">Completadas</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {matchResults.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-white/60">Pendientes</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">
                  {matchResults.filter(r => r.status === 'cancelled').length}
                </div>
                <div className="text-sm text-white/60">Canceladas</div>
              </div>
            </div>

            {/* Lista de partidas con resultados usando DynamicCardList */}
            <div className="space-y-4">
              {matches.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay partidas configuradas</p>
                  <p className="text-sm">Configura partidas en el tab "Configuración Inicial" primero</p>
                </div>
              ) : (
                <DynamicCardList
                  data={matches}
                  renderCard={renderMatchCard}
                  emptyMessage="No hay partidas configuradas"
                  emptyIcon={Trophy}
                  className="space-y-4"
                />
              )}
            </div>
          </div>
        )}

        {activeTab === 'visual' && (
          <div className="min-h-[500px] max-h-[calc(80vh-220px)] overflow-y-auto">
            {/* Selector de fase */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>Fase actual:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${currentPhase === 'initial'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                    {currentPhase === 'initial' ? 'FASE INICIAL' : 'FASE FINAL'}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPhase('initial')}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border transition-all duration-200 ${currentPhase === 'initial'
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Tabla de Clasificación</div>
                    <div className="text-xs opacity-75">Ver posiciones y estadísticas</div>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentPhase('final')}
                  className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border transition-all duration-200 ${currentPhase === 'final'
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  <Trophy className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Gráfico de Bracket</div>
                    <div className="text-xs opacity-75">Configurar partidas de eliminación</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Contenido según la fase seleccionada */}
            <div className="p-4">

              {currentPhase === 'initial' ? (
                <div>
                  {/* Información del torneo */}
                  <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Información del Torneo</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Formato:</span>
                        <div className="text-white font-medium">{format.replace('_', ' ').toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Estado:</span>
                        <div className="text-white font-medium">{currentPhase === 'initial' ? 'FASE INICIAL' : 'FASE FINAL'}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Partidas Configuradas:</span>
                        <div className="text-white font-medium">{matches.length}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Partidas Requeridas:</span>
                        <div className="text-white font-medium">{requiredMatches}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Tabla de Clasificación</h4>
                    <p className="text-white/60 text-sm mb-4">
                      Visualiza las posiciones actuales de los participantes basadas en sus resultados.
                    </p>
                  </div>

                  <StandingsTable
                    participants={participants}
                    standings={standingsData}
                    tournamentName={tournamentName}
                    onClose={() => { }}
                    isEmbedded={true}
                  />
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Gráfico de Bracket</h4>
                    <p className="text-white/60 text-sm">
                      Configura y visualiza el bracket de eliminación para la fase final del torneo.
                    </p>
                  </div>
                  <BracketVisualChart
                    participants={participants}
                    configuredMatches={matches}
                    tournamentName={tournamentName}
                    format={format}
                    onSaveConfiguration={(newMatches) => {
                      setMatches(newMatches);
                    }}
                    onClose={() => { }}
                    isEmbedded={true}
                    currentPhase={currentPhase}
                    onPhaseChange={setCurrentPhase}
                    isReadOnly={false}
                  />
                </div>
              )}
            </div>
          </div>
        )}



        {/* Footer */}
        <div className="flex items-center justify-between p-2 border-t border-white/10 bg-gray-900/95">
          <div className="text-xs text-white/60">
            {matches.length} de {requiredMatches} partidas configuradas
            {activeTab === 'results' && (
              <span className="ml-4">
                • {matchResults.filter(r => r.status === 'completed').length} resultados registrados
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded text-sm hover:bg-white/20 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={validationErrors.length > 0}
              className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded text-sm hover:bg-orange-500/30 transition-all duration-200 disabled:opacity-50 flex items-center gap-1"
            >
              <Save className="h-3 w-3" />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchConfigurationModal;
