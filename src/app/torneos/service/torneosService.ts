import { apiService } from '../../shared/services/apiService';

export interface Torneo {
  id: number;
  nombre: string;
  descripcion: string;
  juegoId: number;
  maxParticipantes: number;
  costoEntrada: number;
  premio: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'upcoming' | 'active' | 'completed';
  imagen?: string;
  reglas: string[];
  activo: boolean;
  titulares: number;
  suplentes: number;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CrearTorneoRequest {
  nombre: string;
  descripcion: string;
  juegoId: number;
  maxParticipantes: number;
  costoEntrada: number;
  premio: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'upcoming' | 'active' | 'completed';
  imagen?: File;
  reglas: string[];
  activo: boolean;
  titulares: number;
  suplentes: number;
}

export interface ActualizarTorneoRequest extends Partial<CrearTorneoRequest> {
  id: number;
}

export interface TorneosResponse {
  success: boolean;
  data: Torneo[];
  error?: string;
}

export interface TorneoResponse {
  success: boolean;
  data: Torneo;
  error?: string;
}

class TorneosService {
  private baseUrl = '/api/torneos';

  async obtenerTorneos(): Promise<TorneosResponse> {
    try {
      const response = await apiService.get(this.baseUrl);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message || 'Error al obtener torneos'
      };
    }
  }

  async obtenerTorneo(id: number): Promise<TorneoResponse> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Torneo,
        error: error.message || 'Error al obtener torneo'
      };
    }
  }

  async crearTorneo(torneo: CrearTorneoRequest): Promise<TorneoResponse> {
    try {
      const formData = new FormData();
      
      // Agregar campos básicos
      formData.append('nombre', torneo.nombre);
      formData.append('descripcion', torneo.descripcion);
      formData.append('juegoId', torneo.juegoId.toString());
      formData.append('maxParticipantes', torneo.maxParticipantes.toString());
      formData.append('costoEntrada', torneo.costoEntrada.toString());
      formData.append('premio', torneo.premio);
      formData.append('fechaInicio', torneo.fechaInicio);
      formData.append('fechaFin', torneo.fechaFin);
      formData.append('estado', torneo.estado);
      formData.append('activo', torneo.activo.toString());
      formData.append('titulares', torneo.titulares.toString());
      formData.append('suplentes', torneo.suplentes.toString());
      
      // Agregar reglas como JSON
      formData.append('reglas', JSON.stringify(torneo.reglas));
      
      // Agregar imagen si existe
      if (torneo.imagen) {
        formData.append('imagen', torneo.imagen);
      }

      const response = await apiService.post(this.baseUrl, formData);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Torneo,
        error: error.message || 'Error al crear torneo'
      };
    }
  }

  async actualizarTorneo(torneo: ActualizarTorneoRequest): Promise<TorneoResponse> {
    try {
      const formData = new FormData();
      
      // Agregar campos básicos
      if (torneo.nombre) formData.append('nombre', torneo.nombre);
      if (torneo.descripcion) formData.append('descripcion', torneo.descripcion);
      if (torneo.juegoId) formData.append('juegoId', torneo.juegoId.toString());
      if (torneo.maxParticipantes) formData.append('maxParticipantes', torneo.maxParticipantes.toString());
      if (torneo.costoEntrada) formData.append('costoEntrada', torneo.costoEntrada.toString());
      if (torneo.premio) formData.append('premio', torneo.premio);
      if (torneo.fechaInicio) formData.append('fechaInicio', torneo.fechaInicio);
      if (torneo.fechaFin) formData.append('fechaFin', torneo.fechaFin);
      if (torneo.estado) formData.append('estado', torneo.estado);
      if (torneo.activo !== undefined) formData.append('activo', torneo.activo.toString());
      if (torneo.titulares) formData.append('titulares', torneo.titulares.toString());
      if (torneo.suplentes) formData.append('suplentes', torneo.suplentes.toString());
      
      // Agregar reglas como JSON si existen
      if (torneo.reglas) {
        formData.append('reglas', JSON.stringify(torneo.reglas));
      }
      
      // Agregar imagen si existe
      if (torneo.imagen) {
        formData.append('imagen', torneo.imagen);
      }

      const response = await apiService.put(`${this.baseUrl}/${torneo.id}`, formData);

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Torneo,
        error: error.message || 'Error al actualizar torneo'
      };
    }
  }

  async eliminarTorneo(id: number): Promise<{ success: boolean; error?: string }> {
    try {
      await apiService.delete(this.baseUrl, id);
      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Error al eliminar torneo'
      };
    }
  }

  async obtenerTorneosActivos(): Promise<TorneosResponse> {
    try {
      const response = await apiService.get(`${this.baseUrl}/activos`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message || 'Error al obtener torneos activos'
      };
    }
  }

  async obtenerTorneosPorJuego(juegoId: number): Promise<TorneosResponse> {
    try {
      const response = await apiService.get(`${this.baseUrl}/juego/${juegoId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message || 'Error al obtener torneos por juego'
      };
    }
  }
}

export const torneosService = new TorneosService();
