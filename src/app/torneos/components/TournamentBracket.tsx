import React, { useState } from 'react';
import {
  Trophy,
  Settings,
  Download,
  BarChart
} from 'lucide-react';
import MatchConfigurationModal from './MatchConfigurationModal';

interface Match {
  id: string;
  round: number;
  matchNumber: number;
  player1: string;
  player2: string;
  player1Score?: number;
  player2Score?: number;
  winner?: string;
  status: 'pending' | 'in_progress' | 'completed';
  scheduledTime?: string;
  duration?: string;
}

interface TournamentBracketProps {
  tournamentId: string;
  tournamentName: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  participants: string[];
  matches: Match[];
  onMatchUpdate?: (matchId: string, winner: string, scores: { player1: number, player2: number }) => void;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({
  tournamentName,
  format,
  participants,
  matches,
}) => {
  const [showMatchConfiguration, setShowMatchConfiguration] = useState(false);
  const [configuredMatches, setConfiguredMatches] = useState<any[]>([]);

  const handleSaveMatchConfiguration = (newConfiguredMatches: any[]) => {
    // Aquí se procesaría la configuración guardada
    console.log('Configuración de partidas guardada:', newConfiguredMatches);
    setConfiguredMatches(newConfiguredMatches);
    // En una implementación real, se enviaría al servidor
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{tournamentName}</h2>
            <p className="text-white/60 mt-1">Bracket - {format.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{participants.length}</div>
              <div className="text-xs text-white/60">Participantes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{matches.length}</div>
              <div className="text-xs text-white/60">Partidas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-white">{matches.filter(m => m.status === 'completed').length}</div>
              <div className="text-xs text-white/60">Completadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas del torneo */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Estadísticas del Torneo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{participants.length}</div>
            <div className="text-sm text-white/60">Total Participantes</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-500">{matches.filter(m => m.status === 'in_progress').length}</div>
            <div className="text-sm text-white/60">En Progreso</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-green-500">{matches.filter(m => m.status === 'completed').length}</div>
            <div className="text-sm text-white/60">Completadas</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-yellow-500">{matches.filter(m => m.status === 'pending').length}</div>
            <div className="text-sm text-white/60">Pendientes</div>
          </div>
        </div>
      </div>



      {/* Tournament Progress */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Progreso del Torneo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {matches.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-sm text-white/60">Partidas Completadas</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-500">
              {matches.filter(m => m.status === 'in_progress').length}
            </div>
            <div className="text-sm text-white/60">En Progreso</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-yellow-500">
              {matches.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-white/60">Pendientes</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-white/60 mb-2">
            <span>Progreso General</span>
            <span>{Math.round((matches.filter(m => m.status === 'completed').length / matches.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${(matches.filter(m => m.status === 'completed').length / matches.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Información del torneo */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Información del Torneo</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-white/60 mb-1">Formato</div>
            <div className="text-lg font-semibold text-white">{format.replace('_', ' ').toUpperCase()}</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-white/60 mb-1">Estado</div>
            <div className="text-lg font-semibold text-green-400">EN PROGRESO</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-white/60 mb-1">Fecha Inicio</div>
            <div className="text-lg font-semibold text-white">15 Nov 2024</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-white/60 mb-1">Fecha Fin</div>
            <div className="text-lg font-semibold text-white">22 Nov 2024</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
        
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/30 transition-all duration-200">
            <Trophy className="h-4 w-4 mr-2" />
            Declarar Ganador
          </button>
          
          <button 
            onClick={() => setShowMatchConfiguration(true)}
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all duration-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar Partidas
          </button>

          <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-200">
            <BarChart className="h-4 w-4 mr-2" />
            Ver Estadísticas
          </button>

          <button className="px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-all duration-200">
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </button>
        </div>
      </div>

      {/* Modal de Configuración de Partidas */}
      <MatchConfigurationModal
        isOpen={showMatchConfiguration}
        onClose={() => setShowMatchConfiguration(false)}
        participants={participants.map((name, index) => ({
          id: `participant-${index}`,
          name,
          team: `Team ${Math.floor(index / 2) + 1}`,
          seed: index + 1
        }))}
        tournamentName={tournamentName}
        format={format}
        onSaveConfiguration={handleSaveMatchConfiguration}
        existingMatches={matches.map(match => ({
          id: match.id,
          round: match.round,
          matchNumber: match.matchNumber,
          player1: match.player1,
          player2: match.player2,
          scheduledTime: match.scheduledTime,
          venue: `Arena ${match.matchNumber}`,
          notes: `Partida ${match.matchNumber}`
        }))}
      />
    </div>
  );
};

export default TournamentBracket;
