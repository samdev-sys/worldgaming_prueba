import React from 'react';
import {
  Trophy,
  Medal,
  Award,
  Users
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  team?: string;
  seed?: number;
  logo?: string; // URL del logo del equipo
  icon?: string; // Emoji o icono del equipo
}

interface Standing {
  participant: Participant;
  position: number;
  points: number;
  matchesPlayed: number;
  perfectWins: number; // Victorias Perfectas
  wins: number; // Victorias
  draws: number; // Empates
  losses: number; // Derrotas
  mapDifference: number; // Diferencia de Mapas
  roundDifference: number; // Diferencia de Rondas
}

interface StandingsTableProps {
  participants: Participant[];
  standings: Standing[];
  tournamentName: string;
  onClose: () => void;
  isEmbedded?: boolean;
  onTeamClick?: (participant: Participant) => void; // Nuevo prop para manejar clics en equipos
}

const StandingsTable: React.FC<StandingsTableProps> = ({
  participants,
  standings,
  tournamentName,
  onClose,
  isEmbedded = false,
  onTeamClick
}) => {
  
  console.log('=== DEBUG: StandingsTable props ===');
  console.log('onTeamClick:', onTeamClick);
  console.log('onTeamClick type:', typeof onTeamClick);
  console.log('onTeamClick exists:', !!onTeamClick);
  console.log('isEmbedded:', isEmbedded);
  console.log('tournamentName:', tournamentName);
  console.log('participants length:', participants.length);
  console.log('standings length:', standings.length);
  
  const handleTeamClick = (participant: Participant) => {
    console.log('=== DEBUG: handleTeamClick called ===');
    console.log('Participant:', participant);
    console.log('onTeamClick exists:', !!onTeamClick);

    // Si se proporciona onTeamClick, usarlo
    if (onTeamClick) {
      console.log('Calling onTeamClick...');
      onTeamClick(participant);
    } else {
      // Comportamiento por defecto (mantener la funcionalidad anterior)
      console.log('No onTeamClick provided, using default behavior');
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-white/60">{position}º</span>;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gray-500/10 border-gray-500/30';
      case 3:
        return 'bg-amber-500/10 border-amber-500/30';
      default:
        return 'bg-white/5 border-white/10';
    }
  };

  const content = (
    <div className={`${isEmbedded ? 'w-full h-full' : 'bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden relative'}`}>
      {/* Header - Solo mostrar si no está embebido */}
      {!isEmbedded && (
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-orange-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Tabla de Calificación</h2>
              <p className="text-white/60 text-sm">{tournamentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <span className="text-white text-xl">×</span>
          </button>
        </div>
      )}

      <div className={`${isEmbedded ? 'p-4 h-full' : 'p-6 overflow-y-auto max-h-[calc(95vh-120px)]'}`}>
        {/* Mensaje informativo */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Tabla de Calificaciones - {tournamentName}</span>
          </div>
          <p className="text-sm text-white/80">
            Estás viendo la clasificación actual del torneo con {participants.length} participantes. 
            La tabla muestra puntos, partidos jugados, victorias perfectas, victorias, empates, derrotas, 
            diferencia de mapas y diferencia de rondas. Los equipos están ordenados por puntos totales.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-blue-400/80">
            <span>ℹ️</span>
            <span>Haz clic en cualquier equipo para ver estadísticas detalladas</span>
          </div>
        </div>

        {/* Header estilo Rainbow Six */}
        <div className="mb-6">
          {/* Título principal */}
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold text-white mb-2">TABLA DE POSICIONES</h1>
          </div>
        </div>

        {/* Tabla de posiciones estilo Rainbow Six */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 border-b border-white/10">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white/80">EQUIPO</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">JJ</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">VP</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">VC</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">EM</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">PE</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">DM</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-white/80">DR</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((standing, index) => (
                  <tr
                    key={standing.participant.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-all duration-200 ${getPositionColor(standing.position)} cursor-pointer`}
                    onClick={() => handleTeamClick(standing.participant)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getPositionIcon(standing.position)}
                        </div>
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                          {standing.participant.logo ? (
                            <img
                              src={standing.participant.logo}
                              alt={`Logo de ${standing.participant.name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : standing.participant.icon ? (
                            <span className="text-lg">{standing.participant.icon}</span>
                          ) : (
                            <Users className="h-4 w-4 text-white/60" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">{standing.participant.name}</div>
                          {standing.participant.team && (
                            <div className="text-xs text-white/60">{standing.participant.team}</div>
                          )}
                        </div>
                        <div className="text-green-400 font-bold text-lg">
                          {standing.points}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-white">{standing.matchesPlayed}</td>
                    <td className="px-4 py-3 text-center text-green-400">{standing.perfectWins}</td>
                    <td className="px-4 py-3 text-center text-blue-400">{standing.wins}</td>
                    <td className="px-4 py-3 text-center text-yellow-400">{standing.draws}</td>
                    <td className="px-4 py-3 text-center text-red-400">{standing.losses}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm ${standing.mapDifference > 0 ? 'text-green-400' : standing.mapDifference < 0 ? 'text-red-400' : 'text-white/60'}`}>
                        {standing.mapDifference > 0 ? `+${standing.mapDifference}` : standing.mapDifference}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm ${standing.roundDifference > 0 ? 'text-green-400' : standing.roundDifference < 0 ? 'text-red-400' : 'text-white/60'}`}>
                        {standing.roundDifference > 0 ? `+${standing.roundDifference}` : standing.roundDifference}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leyenda estilo Rainbow Six */}
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <h4 className="text-sm font-semibold text-white mb-3">LEYENDA</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">PTS</span>
                <span className="text-white">= PUNTOS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">JJ</span>
                <span className="text-white">= PARTIDAS JUGADAS</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">VP</span>
                <span className="text-white">= VICTORIAS PERFECTAS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">VC</span>
                <span className="text-white">= NÚMERO DE VICTORIAS</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">EM</span>
                <span className="text-white">= NÚMERO DE EMPATES</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">PE</span>
                <span className="text-white">= NÚMERO DE DERROTAS</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">DM</span>
                <span className="text-white">= DIFERENCIA DE MAPAS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-semibold">DR</span>
                <span className="text-white">= DIFERENCIA DE RONDAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  console.log('=== DEBUG: Before return ===');
  console.log('isEmbedded:', isEmbedded);
  console.log('onTeamClick in return check:', onTeamClick);
  
  if (isEmbedded) {
    console.log('=== DEBUG: Returning embedded content ===');
    return content;
  }
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        {content}
      </div>
    </>
  );
};

export default StandingsTable;
