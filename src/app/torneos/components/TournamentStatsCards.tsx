import React from 'react';
import { Trophy, Users, Star, Zap } from 'lucide-react';
import { Torneo } from '../hooks/useTorneos';
import { MiTorneo } from '../hooks/useMisTorneos';

interface TournamentStatsCardsProps {
  torneos: Torneo[] | MiTorneo[];
  title?: string;
}

const TournamentStatsCards: React.FC<TournamentStatsCardsProps> = ({ 
  torneos, 
  title = "Estadísticas" 
}) => {
  // Calcular estadísticas
  const totalTorneos = torneos.length;
  const totalParticipantes = torneos.reduce((sum, torneo) => sum + (torneo.participantes || 0), 0);
  const premioTotal = torneos.reduce((sum, torneo) => {
    const premio = typeof torneo.premio === 'string' ? parseFloat(torneo.premio) : torneo.premio || 0;
    return sum + premio;
  }, 0);
  const torneosActivos = torneos.filter(torneo => torneo.isActive).length;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Torneos */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-200">
          <Trophy className="w-8 h-8 text-white mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{totalTorneos}</div>
          <div className="text-white/60 text-sm">Total Torneos</div>
        </div>

        {/* Total Participantes */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-200">
          <Users className="w-8 h-8 text-white mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{totalParticipantes}</div>
          <div className="text-white/60 text-sm">Participantes</div>
        </div>

        {/* Premio Total */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-200">
          <Star className="w-8 h-8 text-white mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">${premioTotal.toLocaleString()}</div>
          <div className="text-white/60 text-sm">Premio Total</div>
        </div>

        {/* Torneos Activos */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-200">
          <Zap className="w-8 h-8 text-white mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{torneosActivos}</div>
          <div className="text-white/60 text-sm">Activos</div>
        </div>
      </div>
    </div>
  );
};

export default TournamentStatsCards;
