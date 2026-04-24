import React from 'react';
import { Users, Calendar, Trophy, ArrowRight, Award, TrendingUp } from 'lucide-react';
import { MiTorneo } from '../hooks/useMisTorneos';

interface MyTournamentCardMinimalProps {
  tournament: MiTorneo;
  onTournamentClick: (tournament: MiTorneo) => void;
}

const MyTournamentCardMinimal: React.FC<MyTournamentCardMinimalProps> = ({
  tournament,
  onTournamentClick
}) => {
  const availableSpots = (tournament.maxParticipantes || 120) - (tournament.participantes || 0);
  
  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'active':
        return 'text-green-400';
      case 'próximo':
      case 'upcoming':
        return 'text-yellow-400';
      case 'completado':
      case 'completed':
        return 'text-blue-400';
      default:
        return 'text-white/60';
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'active':
        return 'En juego';
      case 'próximo':
      case 'upcoming':
        return 'Próximo';
      case 'completado':
      case 'completed':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div 
      className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 group cursor-pointer hover:border-white/20 relative w-full"
      onClick={() => onTournamentClick(tournament)}
    >
      {/* Contenido de la card */}
      <div className="flex items-center p-6 space-x-6">
        {/* Logo/Imagen del torneo */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
            {tournament.imagen ? (
              <img
                src={tournament.imagen}
                alt={tournament.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-white/60 text-xs font-bold text-center px-1">
                <div className="text-[8px] leading-tight">TORNEO</div>
                <div className="text-[10px] leading-tight font-bold">FITCHIN</div>
              </div>
            )}
          </div>
        </div>

        {/* Información del torneo */}
        <div className="flex-1 min-w-0">
          {/* Tab de estado activo/inactivo */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              tournament.isActive 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border-red-500/30'
            }`}>
              {tournament.isActive ? 'ACTIVO' : 'INACTIVO'}
            </span>
          </div>
          
          <h3 className="text-white font-semibold text-xl mb-3 truncate group-hover:text-purple-300 transition-colors">
            {tournament.nombre}
          </h3>
          
          {/* Detalles del torneo */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <Users className="w-4 h-4" />
              <span>{tournament.juegoNombre || 'Juego'}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <Trophy className="w-4 h-4" />
              <span>${tournament.premio || 0} USD</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 text-sm col-span-2">
              <Calendar className="w-4 h-4" />
              <span>
                {tournament.fechaInicio ? new Date(tournament.fechaInicio).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : 'Fecha por definir'} - {tournament.fechaFin ? new Date(tournament.fechaFin).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : 'Sin fecha fin'}
              </span>
            </div>
          </div>

          {/* Información específica del usuario */}
          <div className="flex items-center space-x-4 pt-2 border-t border-white/10">
            {tournament.miRank && (
              <div className="flex items-center space-x-1 text-white/60 text-xs">
                <Award className="w-3 h-3" />
                <span>Rank: #{tournament.miRank}</span>
              </div>
            )}
            {tournament.miScore && (
              <div className="flex items-center space-x-1 text-white/60 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>Score: {tournament.miScore}</span>
              </div>
            )}
            {tournament.fase && (
              <div className="flex items-center space-x-1 text-white/60 text-xs">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>Fase: {tournament.fase}</span>
              </div>
            )}
          </div>
        </div>

        {/* Información de cupos y botón */}
        <div className="flex-shrink-0 text-right">
          <div className="mb-4">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg px-4 py-2 border border-white/10">
              <span className="text-white font-bold text-sm">
                ¡Quedan {availableSpots} cupos!
              </span>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center group-hover:bg-purple-500/20">
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyTournamentCardMinimal;
