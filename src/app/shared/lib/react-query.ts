/**
 * Configuración de React Query
 * Reemplaza los servicios CRUD personalizados
 */

import { QueryClient } from '@tanstack/react-query';

// Configuración del cliente de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount: number, error: any) => {
        // No reintentar en errores 4xx
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Reintentar hasta 3 veces en otros errores
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

// Claves de query para diferentes recursos
export const queryKeys = {
  // Usuarios
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userProfile: ['users', 'profile'] as const,
  
  // Equipos
  teams: ['teams'] as const,
  team: (id: string) => ['teams', id] as const,
  myTeams: ['teams', 'my-teams'] as const,
  teamRequests: ['teams', 'requests'] as const,
  
  // Torneos
  tournaments: ['tournaments'] as const,
  tournament: (id: string) => ['tournaments', id] as const,
  myTournaments: ['tournaments', 'my-tournaments'] as const,
  tournamentStandings: (id: string) => ['tournaments', id, 'standings'] as const,
  tournamentBracket: (id: string) => ['tournaments', id, 'bracket'] as const,
  
  // Juegos
  games: ['games'] as const,
  game: (id: string) => ['games', id] as const,
  gameCategories: ['games', 'categories'] as const,
  
  // Búsquedas
  search: (type: string, params: any) => ['search', type, params] as const,
} as const;

// Configuración de React Query DevTools
export const reactQueryDevtoolsConfig = {
  initialIsOpen: false,
  position: 'bottom-right' as const,
};

// Re-exportar apiService para compatibilidad
export { apiService } from '../services/apiService';
