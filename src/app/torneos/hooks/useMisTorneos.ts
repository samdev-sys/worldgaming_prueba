import { useSearch } from '../../shared/hooks/useSearch';
import { useAuth } from '../../auth/AuthContext';
import { TOURNAMENT_STATUS_OPTIONS, TOURNAMENT_DIFFICULTY_OPTIONS } from '../../shared/constants/tournamentConstants';

export interface MiTorneo {
  id: number;
  nombre: string;
  juegoId: number;
  juegoNombre?: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  maxParticipantes: number;
  maxJugadores: number;
  titulares: number;
  suplentes: number;
  premio: string;
  estado: string;
  costoEntrada: number;
  imagen?: string;
  reglas?: string;
  cantidadEquipos: number;
  dificultad: string;
  isActive: boolean;
  participantes?: number;
  categoria?: string;
  phase?: 'initial' | 'final';
  creadorId?: number;
}

/**
 * Hook ultra-simplificado para mis torneos
 * Solo 20 líneas vs 220+ líneas del hook original
 */
export const useMisTorneos = () => {
  const { user } = useAuth();
  
  const searchResult = useSearch<MiTorneo>(
    'Torneos', 
    {}, 
    user?.id ? { CreadorId: user.id.toString() } : {}
  );

  const getFilterOptions = () => ({
    estado: TOURNAMENT_STATUS_OPTIONS,
    dificultad: TOURNAMENT_DIFFICULTY_OPTIONS
  });

  return {
    ...searchResult,
    getFilterOptions,
    torneos: searchResult.data,
    paginationInfo: searchResult.paginationInfo,
    handlePageChange: searchResult.handlePageChange,
    handleItemsPerPageChange: searchResult.handlePageSizeChange,
    refreshMisTorneos: searchResult.handleRefresh
  };
};
