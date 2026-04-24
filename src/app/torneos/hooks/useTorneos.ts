import { useSearch } from '../../shared/hooks/useSearch';
import { TOURNAMENT_STATUS_OPTIONS, TOURNAMENT_DIFFICULTY_OPTIONS } from '../../shared/constants/tournamentConstants';

export interface Torneo {
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
}

/**
 * Hook ultra-simplificado para torneos
 * Solo 15 líneas vs 240+ líneas del hook original
 */
export const useTorneos = () => {
  const searchResult = useSearch<Torneo>('Torneos', { IsActive: true });

  const getFilterOptions = () => ({
    estado: TOURNAMENT_STATUS_OPTIONS,
    dificultad: TOURNAMENT_DIFFICULTY_OPTIONS
  });

  return {
    ...searchResult,
    getFilterOptions,
    torneos: searchResult.data,
    totalItems: searchResult.paginationInfo.totalRecords,
    pageNumber: searchResult.paginationInfo.pageNumber,
    pageSize: searchResult.paginationInfo.pageSize,
    handlePageChange: searchResult.handlePageChange,
    handlePageSizeChange: searchResult.handlePageSizeChange,
    refreshTorneos: searchResult.handleRefresh
  };
};
