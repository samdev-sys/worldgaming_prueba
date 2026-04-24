import React, { memo, useMemo } from 'react';
import { Users, Trophy, ArrowRight, GitBranch, TrendingUp, Edit, Calendar } from 'lucide-react';
import { Torneo } from '../hooks/useTorneos';
import TournamentToggle from './TournamentToggle';
import { getDifficultyColor } from '../../shared/utils';
import { CardMinimal, ChipConfig, DetailItem, ActionButton } from '../../shared/components/ui';

interface TournamentCardMinimalProps {
  tournament: Torneo;
  onTournamentClick: (tournament: Torneo) => void;
  onBracketClick?: (tournament: Torneo) => void;
  onChartClick?: (tournament: Torneo) => void;
  onEdit?: (tournament: Torneo) => void;
  onToggle?: (tournament: Torneo, newStatus: boolean) => void;
  showStatusChip?: boolean; // Nueva prop para controlar si se muestra el chip de estado
}

const TournamentCardMinimal: React.FC<TournamentCardMinimalProps> = memo(({
  tournament,
  onTournamentClick,
  onBracketClick,
  onChartClick,
  onEdit,
  onToggle,
  showStatusChip = true
}) => {
  const availableSpots = (tournament.maxParticipantes || 120) - (tournament.participantes || 0);
  
  // Configuración de chips
  const chips: ChipConfig[] = useMemo(() => {
    const chipList: ChipConfig[] = [
      {
        label: tournament.dificultad?.toUpperCase() || 'N/A',
        className: getDifficultyColor(tournament.dificultad)
      },
      {
        label: tournament.estado?.toLowerCase() === 'próximo' || tournament.estado?.toLowerCase() === 'upcoming'
          ? 'PRÓXIMO'
          : tournament.estado?.toLowerCase() === 'activo' || tournament.estado?.toLowerCase() === 'active' || tournament.estado?.toLowerCase() === 'en curso'
          ? 'EN JUEGO'
          : tournament.estado?.toLowerCase() === 'completado' || tournament.estado?.toLowerCase() === 'completed'
          ? 'TERMINADO'
          : tournament.estado || 'SIN ESTADO',
        className: tournament.estado?.toLowerCase() === 'próximo' || tournament.estado?.toLowerCase() === 'upcoming'
          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
          : tournament.estado?.toLowerCase() === 'activo' || tournament.estado?.toLowerCase() === 'active' || tournament.estado?.toLowerCase() === 'en curso'
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : tournament.estado?.toLowerCase() === 'completado' || tournament.estado?.toLowerCase() === 'completed'
          ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      }
    ];

    if (showStatusChip) {
      chipList.push({
        label: tournament.isActive ? 'ACTIVO' : 'INACTIVO',
        className: tournament.isActive
          ? 'bg-green-500/20 text-green-400 border-green-500/30'
          : 'bg-red-500/20 text-red-400 border-red-500/30'
      });
    }

    return chipList;
  }, [tournament.dificultad, tournament.estado, tournament.isActive, showStatusChip]);

  // Configuración de detalles
  const details: DetailItem[] = useMemo(() => [
    {
      icon: Users,
      text: tournament.juegoNombre || 'Juego'
    },
    {
      icon: Trophy,
      text: `$${tournament.premio || 0} USD`
    },
    {
      icon: Calendar,
      text: tournament.fechaInicio
        ? `${new Date(tournament.fechaInicio).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })} - ${tournament.fechaFin ? new Date(tournament.fechaFin).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) : 'Sin fecha fin'}`
        : 'Fecha por definir',
      colSpan: 2
    }
  ], [tournament.juegoNombre, tournament.premio, tournament.fechaInicio, tournament.fechaFin]);

  // Configuración de botones de acción
  const actionButtons: ActionButton[] = useMemo(() => {
    const buttons: ActionButton[] = [
      {
        icon: ArrowRight,
        onClick: () => onTournamentClick(tournament),
        className: 'w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center justify-center group-hover:bg-purple-500/20',
        title: 'Ver Información'
      }
    ];

    if (onEdit) {
      buttons.push({
        icon: Edit,
        onClick: () => onEdit(tournament),
        className: 'w-8 h-8 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors duration-200 flex items-center justify-center group-hover:bg-blue-500/30',
        title: 'Editar Torneo'
      });
    }

    if (onChartClick) {
      buttons.push({
        icon: TrendingUp,
        onClick: () => onChartClick(tournament),
        className: 'w-8 h-8 rounded-full bg-orange-500/20 hover:bg-orange-500/30 transition-colors duration-200 flex items-center justify-center group-hover:bg-orange-500/30',
        title: 'Ver Gráfico'
      });
    }

    if (onBracketClick) {
      buttons.push({
        icon: GitBranch,
        onClick: () => onBracketClick(tournament),
        className: 'w-8 h-8 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors duration-200 flex items-center justify-center group-hover:bg-green-500/30',
        title: 'Ver Bracket'
      });
    }

    return buttons;
  }, [tournament, onTournamentClick, onEdit, onChartClick, onBracketClick]);

  return (
    <div className="relative">
      <CardMinimal
        image={tournament.imagen || ''}
        imageAlt={tournament.nombre}
        fallbackText={{ line1: 'TORNEO', line2: 'FITCHIN' }}
        title={tournament.nombre}
        chips={chips}
        details={details}
        infoBadge={{
          text: `¡Quedan ${availableSpots} cupos!`
        }}
        actionButtons={actionButtons}
        onClick={() => onTournamentClick(tournament)}
      />
      {/* Toggle personalizado para torneos - se renderiza fuera del CardMinimal */}
      {onToggle && (
        <div 
          className="absolute top-6 right-6 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <TournamentToggle
            tournamentId={tournament.id}
            tournamentName={tournament.nombre}
            isActive={tournament.isActive || false}
            onToggle={(newStatus) => onToggle(tournament, newStatus)}
            className=""
          />
        </div>
      )}
    </div>
  );
}); 

TournamentCardMinimal.displayName = 'TournamentCardMinimal';

export default TournamentCardMinimal;
