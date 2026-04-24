import React, { useState } from 'react';
import {
  Trophy,
  Clock,
  CheckCircle,
  Eye,
  X,
  Shuffle
} from 'lucide-react';

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

interface BracketVisualChartProps {
  participants: Participant[];
  configuredMatches: MatchConfig[];
  tournamentName: string;
  format: string;
  onSaveConfiguration: (matches: MatchConfig[]) => void;
  onClose: () => void;
  isEmbedded?: boolean;
  currentPhase?: 'initial' | 'final';
  onPhaseChange?: (phase: 'initial' | 'final') => void;
  isReadOnly?: boolean;
}

const BracketVisualChart: React.FC<BracketVisualChartProps> = ({
  participants,
  configuredMatches,
  tournamentName,
  onClose,
  isEmbedded = false,
  isReadOnly = false
}) => {
  const [matches, setMatches] = useState<MatchConfig[]>(configuredMatches);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<'player1' | 'player2' | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);

  // Calcular estructura del bracket
  const calculateBracketStructure = () => {
    const participantCount = participants.length;
    let structure = {
      quarters: 0,
      semis: 0,
      final: 1,
      thirdPlace: 1
    };

    if (participantCount <= 4) {
      structure.semis = 2;
      structure.quarters = 0;
    } else if (participantCount <= 8) {
      structure.quarters = 4;
      structure.semis = 2;
    } else if (participantCount <= 16) {
      structure.quarters = 8;
      structure.semis = 4;
    } else {
      // Para más de 16 participantes, calcular dinámicamente
      structure.quarters = Math.ceil(participantCount / 2);
      structure.semis = Math.ceil(structure.quarters / 2);
    }

    return structure;
  };

  const bracketStructure = calculateBracketStructure();

  // Generar bracket automáticamente
  const generateBracket = async () => {
    setIsGenerating(true);

    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const shuffledParticipants = [...participants];
    // Mezclar aleatoriamente
    for (let i = shuffledParticipants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledParticipants[i], shuffledParticipants[j]] = [shuffledParticipants[j], shuffledParticipants[i]];
    }

    const newMatches: MatchConfig[] = [];
    let matchNumber = 1;

    // Generar partidas de octavos de final
    if (bracketStructure.quarters > 0) {
      for (let i = 0; i < bracketStructure.quarters; i++) {
        if (i * 2 + 1 < shuffledParticipants.length) {
          newMatches.push({
            id: `match-${matchNumber}`,
            round: 1,
            matchNumber: matchNumber,
            player1: shuffledParticipants[i * 2].name,
            player2: shuffledParticipants[i * 2 + 1]?.name || 'TBD',
            scheduledTime: new Date(Date.now() + (matchNumber * 2 * 60 * 60 * 1000)).toISOString(),
            venue: `Arena ${Math.ceil(matchNumber / 2)}`,
            notes: `Octavos de Final - Partida ${matchNumber}`
          });
          matchNumber++;
        }
      }
    }

    // Generar partidas de cuartos de final
    for (let i = 0; i < bracketStructure.semis * 2; i++) {
      newMatches.push({
        id: `match-${matchNumber}`,
        round: 2,
        matchNumber: matchNumber,
        player1: `Ganador OF ${i * 2 + 1}`,
        player2: `Ganador OF ${i * 2 + 2}`,
        scheduledTime: new Date(Date.now() + (matchNumber * 2 * 60 * 60 * 1000)).toISOString(),
        venue: `Arena Cuartos ${i + 1}`,
        notes: `Cuartos de Final - Partida ${matchNumber}`
      });
      matchNumber++;
    }

    // Generar partidas de semifinales
    for (let i = 0; i < bracketStructure.semis; i++) {
      newMatches.push({
        id: `match-${matchNumber}`,
        round: 3,
        matchNumber: matchNumber,
        player1: `Ganador QF ${i * 2 + 1}`,
        player2: `Ganador QF ${i * 2 + 2}`,
        scheduledTime: new Date(Date.now() + (matchNumber * 2 * 60 * 60 * 1000)).toISOString(),
        venue: `Arena Semifinal ${i + 1}`,
        notes: `Semifinal - Partida ${matchNumber}`
      });
      matchNumber++;
    }

    // Generar final
    newMatches.push({
      id: `match-${matchNumber}`,
      round: 4,
      matchNumber: matchNumber,
      player1: 'Ganador SF 1',
      player2: 'Ganador SF 2',
      scheduledTime: new Date(Date.now() + (matchNumber * 2 * 60 * 60 * 1000)).toISOString(),
      venue: 'Arena Final',
      notes: 'Gran Final'
    });

    setMatches(newMatches);
    setIsGenerating(false);
  };

  // Actualizar participante en una partida
  const updateMatchPlayer = (matchId: string, player: 'player1' | 'player2', value: string) => {
    setMatches(prev => prev.map(match =>
      match.id === matchId ? { ...match, [player]: value } : match
    ));
  };

  // Seleccionar participante de la lista
  const selectParticipant = (participantName: string) => {
    if (selectedMatch && editingPlayer) {
      updateMatchPlayer(selectedMatch, editingPlayer, participantName);
      setEditingPlayer(null);
      setSelectedMatch(null);
    }
  };

  // Renderizar partida individual
  const renderMatch = (match: MatchConfig, round: number, index: number) => {
    const getRoundName = (round: number) => {
      switch (round) {
        case 1: return 'CUARTOS';
        case 2: return 'SEMIS';
        case 3: return 'FINAL';
        default: return `RONDA ${round}`;
      }
    };

    const getMatchStatus = () => {
      if (match.player1 && match.player2 && match.player1 !== 'TBD' && match.player2 !== 'TBD') {
        return 'configured';
      } else if (match.player1 || match.player2) {
        return 'partial';
      }
      return 'empty';
    };

    const status = getMatchStatus();

    return (
      <div key={match.id} className="relative mb-8">
        {/* Líneas de conexión horizontales */}
        {round > 1 && (
          <div className="absolute top-1/2 -left-4 w-4 h-px bg-white/30"></div>
        )}

        {/* Líneas de conexión verticales */}
        {round === 1 && index % 2 === 0 && (
          <div className="absolute top-1/2 -right-4 w-px h-16 bg-white/30 transform translate-y-8"></div>
        )}
        {round === 1 && index % 2 === 1 && (
          <div className="absolute top-1/2 -right-4 w-px h-16 bg-white/30 transform -translate-y-8"></div>
        )}

        <div className={`p-4 bg-white/5 border border-white/10 rounded-lg min-w-[220px] shadow-lg ${status === 'configured' ? 'border-green-500/30 bg-green-500/10' :
          status === 'partial' ? 'border-yellow-500/30 bg-yellow-500/10' :
            'border-gray-500/30 bg-gray-500/10'
          }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/80">
              {getRoundName(round)} - Partida {match.matchNumber}
            </span>
            <div className="flex items-center gap-2">
              {status === 'configured' && <CheckCircle className="h-4 w-4 text-green-500" />}
              {!isReadOnly && (
                <button
                  onClick={() => removeMatch(match.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors duration-200"
                  title="Eliminar encuentro"
                >
                  <X className="h-3 w-3 text-red-400" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {/* Player 1 */}
            <div
              className={`flex items-center justify-between p-2 rounded text-sm transition-all duration-200 ${match.player1 && match.player1 !== 'TBD' ? 'bg-white/5' : 'bg-white/5 border border-dashed border-white/20'
                } ${!isReadOnly ? 'cursor-pointer' : 'cursor-default'
                } ${selectedMatch === match.id && editingPlayer === 'player1' ? 'bg-orange-500/20 border-orange-500/30' :
                  !isReadOnly ? 'hover:bg-white/10' : ''
                }`}
              onClick={!isReadOnly ? () => {
                setSelectedMatch(match.id);
                setEditingPlayer('player1');
              } : undefined}
            >
              <span className={`font-medium ${match.player1 && match.player1 !== 'TBD' ? 'text-white' : 'text-white/40'}`}>
                {match.player1 || 'Sin asignar'}
              </span>
              <span className="text-white/60">-</span>
            </div>

            {/* Player 2 */}
            <div
              className={`flex items-center justify-between p-2 rounded text-sm transition-all duration-200 ${match.player2 && match.player2 !== 'TBD' ? 'bg-white/5' : 'bg-white/5 border border-dashed border-white/20'
                } ${!isReadOnly ? 'cursor-pointer' : 'cursor-default'
                } ${selectedMatch === match.id && editingPlayer === 'player2' ? 'bg-orange-500/20 border-orange-500/30' :
                  !isReadOnly ? 'hover:bg-white/10' : ''
                }`}
              onClick={!isReadOnly ? () => {
                setSelectedMatch(match.id);
                setEditingPlayer('player2');
              } : undefined}
            >
              <span className={`font-medium ${match.player2 && match.player2 !== 'TBD' ? 'text-white' : 'text-white/40'}`}>
                {match.player2 || 'Sin asignar'}
              </span>
              <span className="text-white/60">-</span>
            </div>
          </div>

          {/* Información adicional */}
          {match.scheduledTime && (
            <div className="mt-3 text-xs text-white/60">
              <Clock className="h-3 w-3 inline mr-1" />
              {new Date(match.scheduledTime).toLocaleDateString('es-ES')}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar ronda completa
  const renderRound = (round: number, matches: MatchConfig[]) => {
    const getRoundName = (round: number) => {
      switch (round) {
        case 1: return 'OCTAVOS DE FINAL';
        case 2: return 'CUARTOS DE FINAL';
        case 3: return 'SEMIFINALES';
        case 4: return 'FINAL';
        default: return `RONDA ${round}`;
      }
    };

    const getRoundLimit = (round: number) => {
      switch (round) {
        case 1: return 8;
        case 2: return 4;
        case 3: return 2;
        case 4: return 1;
        default: return 0;
      }
    };

    const currentMatches = matches.length;
    const maxMatches = getRoundLimit(round);
    const canAdd = canAddMatchToRound(round);

    return (
      <div key={round} className="flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-white">{getRoundName(round)}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">
              {currentMatches}/{maxMatches} encuentros
            </span>
            {!isReadOnly && canAdd && (
              <button
                onClick={() => addNewMatch(round)}
                className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-all duration-200 flex items-center gap-1"
              >
                <span>+</span>
                <span>Añadir</span>
              </button>
            )}
            {!isReadOnly && !canAdd && (
              <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium">
                Límite alcanzado
              </span>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {matches.map((match, index) => renderMatch(match, round, index))}
        </div>
      </div>
    );
  };

  // Agrupar partidas por ronda
  const matchesByRound = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, MatchConfig[]>);

  const configuredCount = matches.filter(m =>
    m.player1 && m.player2 && m.player1 !== 'TBD' && m.player2 !== 'TBD'
  ).length;

  // Validar límites de encuentros por ronda
  const getMaxMatchesForRound = (round: number) => {
    switch (round) {
      case 1: return 8; // Octavos
      case 2: return 4; // Cuartos
      case 3: return 2; // Semifinales
      case 4: return 1; // Final
      default: return 0;
    }
  };

  const canAddMatchToRound = (round: number) => {
    const currentMatches = matchesByRound[round]?.length || 0;
    const maxMatches = getMaxMatchesForRound(round);
    return currentMatches < maxMatches;
  };

  // Añadir nuevo encuentro
  const addNewMatch = (round: number) => {
    if (!canAddMatchToRound(round)) {
      alert(`No se pueden añadir más encuentros en esta ronda. Máximo: ${getMaxMatchesForRound(round)}`);
      return;
    }

    const newMatchNumber = (matchesByRound[round]?.length || 0) + 1;
    const newMatch: MatchConfig = {
      id: `match-${Date.now()}-${round}-${newMatchNumber}`,
      round: round,
      matchNumber: newMatchNumber,
      player1: '',
      player2: '',
      scheduledTime: new Date(Date.now() + (newMatchNumber * 2 * 60 * 60 * 1000)).toISOString(),
      venue: `Arena ${round}-${newMatchNumber}`,
      notes: `Nuevo encuentro - Ronda ${round}`
    };

    setMatches(prev => [...prev, newMatch]);
  };

  // Eliminar encuentro
  const removeMatch = (matchId: string) => {
    setMatchToDelete(matchId);
    setShowDeleteConfirmation(true);
  };

  // Confirmar eliminación
  const confirmDelete = () => {
    if (matchToDelete) {
      setMatches(prev => prev.filter(match => match.id !== matchToDelete));
      setMatchToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  // Cancelar eliminación
  const cancelDelete = () => {
    setMatchToDelete(null);
    setShowDeleteConfirmation(false);
  };
  const totalMatches = matches.length;

  const content = (
    <div className={`${isEmbedded ? 'w-full h-full' : 'bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden relative'}`}>
      {/* Header - Solo mostrar si no está embebido */}
      {!isEmbedded && (
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-orange-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Gráfico Visual del Bracket</h2>
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
      )}

      <div className={`${isEmbedded ? 'p-4 h-full' : 'p-6 overflow-y-auto overflow-x-auto max-h-[calc(95vh-120px)]'}`}>
        {/* Panel de selección de participantes */}
        {selectedMatch && editingPlayer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative z-[10000]">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Seleccionar Participante</h3>
                <button
                  onClick={() => {
                    setEditingPlayer(null);
                    setSelectedMatch(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {participants.map((participant) => (
                    <button
                      key={participant.id}
                      onClick={() => selectParticipant(participant.name)}
                      className="w-full p-3 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
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
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
            <div className="bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative z-[10000]">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <X className="h-6 w-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Confirmar Eliminación</h3>
                    <p className="text-white/60 text-sm">Esta acción no se puede deshacer</p>
                  </div>
                </div>
                <p className="text-white/80 mb-6">
                  ¿Estás seguro de que quieres eliminar este encuentro? Esta acción eliminará permanentemente el encuentro y no se puede deshacer.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controles - Solo mostrar si no es solo lectura */}
        {!isReadOnly && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={generateBracket}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-200 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b border-orange-400"></div>
                ) : (
                  <Shuffle className="h-4 w-4" />
                )}
                {isGenerating ? 'Generando...' : 'Generar Bracket'}
              </button>

              <div className="flex items-center gap-2 text-sm text-white/60">
                <span>Progreso:</span>
                <span className="text-white">{configuredCount}/{totalMatches}</span>
                <span>({Math.round((configuredCount / totalMatches) * 100)}%)</span>
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones o Mensaje de Solo Lectura */}
        {isReadOnly ? (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">Gráfico del Bracket - {tournamentName}</span>
            </div>
            <p className="text-sm text-white/80">
              Estás viendo el árbol de eliminación del torneo con {participants.length} participantes. 
              Este gráfico muestra todas las rondas del torneo: octavos de final, cuartos, semifinales y final. 
              Los partidos configurados aparecen en las primeras rondas.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-yellow-400/80">
              <span>ℹ️</span>
              <span>Desplázate horizontalmente para ver todas las rondas del bracket</span>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Instrucciones</span>
            </div>
            <p className="text-sm text-white/80">
              Haz clic en cualquier participante "Sin asignar" para seleccionar un jugador de la lista.
              Los participantes configurados se mostrarán en verde.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-blue-400/80">
              <span>💡</span>
              <span>Desplázate horizontalmente para ver todas las rondas del bracket</span>
            </div>
          </div>
        )}

        {/* Bracket Visual */}
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-lg">
          <style>{`
             .bracket-scroll::-webkit-scrollbar {
               height: 8px;
             }
             .bracket-scroll::-webkit-scrollbar-track {
               background: rgba(255, 255, 255, 0.1);
               border-radius: 4px;
             }
             .bracket-scroll::-webkit-scrollbar-thumb {
               background: rgba(255, 255, 255, 0.3);
               border-radius: 4px;
             }
             .bracket-scroll::-webkit-scrollbar-thumb:hover {
               background: rgba(255, 255, 255, 0.5);
             }
           `}</style>
          <div className="overflow-x-auto bracket-scroll h-[600px]">
            <div className="flex justify-start items-start gap-12 min-w-max px-4 pb-4 h-full">
              {/* Octavos de Final */}
              {bracketStructure.quarters > 0 && (
                <div className="flex flex-col items-center">
                  {renderRound(1, matchesByRound[1] || [])}
                </div>
              )}

              {/* Cuartos de Final */}
              <div className="flex flex-col items-center">
                {renderRound(2, matchesByRound[2] || [])}
              </div>

              {/* Líneas de conexión verticales para cuartos */}
              {bracketStructure.quarters > 0 && (
                <div className="flex flex-col justify-center h-full space-y-8">
                  {Array.from({ length: bracketStructure.quarters / 2 }, (_, i) => (
                    <div key={i} className="w-px h-32 bg-white/30 mx-auto"></div>
                  ))}
                </div>
              )}

              {/* Semifinales */}
              <div className="flex flex-col items-center">
                {renderRound(3, matchesByRound[3] || [])}
              </div>

              {/* Líneas de conexión verticales para semifinales */}
              <div className="flex flex-col justify-center h-full space-y-8">
                {Array.from({ length: bracketStructure.semis / 2 }, (_, i) => (
                  <div key={i} className="w-px h-32 bg-white/30 mx-auto"></div>
                ))}
              </div>

              {/* Final */}
              <div className="flex flex-col items-center">
                {renderRound(4, matchesByRound[4] || [])}
              </div>

              {/* Tercer Lugar */}
              <div className="flex flex-col items-center">
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <h4 className="text-sm font-semibold text-white mb-2">3° Y 4° PUESTO</h4>
                  <div className="text-xs text-white/60">
                    Perdedor SF 1 vs Perdedor SF 2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{participants.length}</div>
            <div className="text-sm text-white/60">Participantes</div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{bracketStructure.quarters}</div>
            <div className="text-sm text-white/60">Cuartos de Final</div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">{bracketStructure.semis}</div>
            <div className="text-sm text-white/60">Semifinales</div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">1</div>
            <div className="text-sm text-white/60">Final</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Si está embebido, retornar solo el contenido
  if (isEmbedded) {
    return content;
  }

  // Si no está embebido, retornar como modal
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9998]">
      {content}
    </div>
  );
};

export default BracketVisualChart;
