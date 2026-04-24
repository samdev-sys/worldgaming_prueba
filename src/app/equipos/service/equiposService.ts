import { apiService } from '../../shared/services/apiService';
import { API_ENDPOINTS } from '../../shared/constants';

// Interfaces para datos del API
export interface TeamApiResponse {
  id: number;
  nombre: string;
  descripcion: string;
  logo: string | null;
  imagen: string | null;
  tag: string | null;
  creadorId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interfaces para datos transformados (formato interno)
export interface Player {
  id: string;
  name: string;
  role: string;
  experience: number;
}

export interface GameRequirement {
  gameId: string;
  gameName: string;
  titulares: number;
  suplentes: number;
  totalPlayers: number;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  logo?: string;
  image: string;
  tag?: string;
  creadorId?: number;
  captains: {
    gameId: string;
    gameName: string;
    captainName: string;
  }[];
  players: {
    titulares: Player[];
    suplentes: Player[];
  };
  gameRequirements: GameRequirement[];
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  totalMatches: number;
  wins: number;
  losses: number;
}

export interface EquiposResponse {
  success: boolean;
  data: Team[];
  error?: string;
  totalRecords?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface EquipoResponse {
  success: boolean;
  data: Team;
  error?: string;
}

// Función para mapear datos del API al formato interno
function mapTeamFromApi(teamApi: TeamApiResponse): Team {
  const team: Team = {
    id: teamApi.id.toString(),
    name: teamApi.nombre,
    description: teamApi.descripcion || '',
    image: teamApi.imagen || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    creadorId: teamApi.creadorId,
    captains: [], // Se cargará desde otro endpoint si es necesario
    players: {
      titulares: [],
      suplentes: []
    }, // Se cargará desde otro endpoint si es necesario
    gameRequirements: [], // Se cargará desde otro endpoint si es necesario
    isActive: teamApi.isActive,
    createdAt: teamApi.createdAt,
    updatedAt: teamApi.updatedAt,
    totalMatches: 0, // Valor por defecto, se puede cargar desde otro endpoint
    wins: 0, // Valor por defecto
    losses: 0 // Valor por defecto
  };

  // Agregar propiedades opcionales solo si tienen valor
  if (teamApi.logo) {
    team.logo = teamApi.logo;
  }
  if (teamApi.tag) {
    team.tag = teamApi.tag;
  }

  return team;
}

class EquiposService {
  private baseUrl = `/${API_ENDPOINTS.TEAMS.BASE}`;

  async obtenerEquipos(params?: {
    pageNumber?: number;
    pageSize?: number;
    search?: string;
    status?: boolean | string;
  }): Promise<EquiposResponse> {
    try {
      const response = await apiService.get(this.baseUrl, params);

      // Debug: verificar la estructura de la respuesta
      if (import.meta.env.MODE === 'development') {
        console.log('🔍 Respuesta del API (equipos):', response);
      }

      // El apiService ya normaliza la respuesta y extrae listFind
      // response.data debería ser el array de equipos después de la normalización
      let teamsApi: TeamApiResponse[] = [];

      if (Array.isArray(response.data)) {
        teamsApi = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Si la respuesta no fue normalizada correctamente, intentar extraer listFind manualmente
        if ('listFind' in response.data && Array.isArray(response.data.listFind)) {
          teamsApi = response.data.listFind;
        } else if ('data' in response.data && response.data.data && 'listFind' in response.data.data) {
          teamsApi = Array.isArray(response.data.data.listFind) ? response.data.data.listFind : [];
        }
      }

      // Mapear los equipos del API al formato interno
      const teams = teamsApi.map(mapTeamFromApi);

      // Extraer propiedades de paginación de forma segura
      const totalRecords = 'totalRecords' in response ? response.totalRecords :
        (response.data && 'totalRecords' in response.data ? response.data.totalRecords : undefined);
      const pageNumber = 'pageNumber' in response ? response.pageNumber :
        (response.data && 'pageNumber' in response.data ? response.data.pageNumber : undefined);
      const pageSize = 'pageSize' in response ? response.pageSize :
        (response.data && 'pageSize' in response.data ? response.data.pageSize : undefined);

      if (import.meta.env.MODE === 'development') {
        console.log('✅ Equipos mapeados:', teams);
      }

      return {
        success: response.success ?? true,
        data: teams,
        totalRecords: totalRecords,
        pageNumber: pageNumber,
        pageSize: pageSize
      };
    } catch (error: any) {
      console.error('❌ Error al obtener equipos:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Error al obtener equipos'
      };
    }
  }

  async obtenerEquipo(id: string): Promise<EquipoResponse> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}`);

      // Mapear el equipo del API al formato interno
      const teamApi: TeamApiResponse = response.data;
      const team = mapTeamFromApi(teamApi);

      return {
        success: response.success ?? true,
        data: team
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Team,
        error: error.message || 'Error al obtener equipo'
      };
    }
  }

  async buscarEquipos(searchParams: {
    search?: string;
    gameId?: string;
    status?: string;
  }): Promise<EquiposResponse> {
    try {
      const response = await apiService.get(`/${API_ENDPOINTS.TEAMS.SEARCH}`, searchParams);
      return {
        success: response.success ?? true,
        data: Array.isArray(response.data) ? response.data : []
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message || 'Error al buscar equipos'
      };
    }
  }

  async eliminarEquipo(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      await apiService.delete(this.baseUrl, id);
      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al eliminar equipo'
      };
    }
  }
}

export const equiposService = new EquiposService();

