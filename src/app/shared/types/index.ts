/**
 * Tipos centralizados para toda la aplicación
 * Evita duplicaciones y mantiene consistencia
 */

// ===== TIPOS BASE =====
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
  isActive?: boolean;
}

// ===== TIPOS DE USUARIO =====
export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'captain' | 'player' | 'spectator';
  experience: number;
  rank: string;
  tier?: string;
  points: number;
  games: string[]; // IDs de juegos
}

// ===== TIPOS DE JUEGO =====
export interface Game extends BaseEntity {
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  icon?: string;
  image?: string;
  minPlayers: number;
  maxPlayers: number;
  rules?: string;
}

export interface GameRequirement {
  gameId: string;
  gameName: string;
  titulares: number;
  suplentes: number;
  totalPlayers: number;
  gameIcon?: string;
}

// ===== TIPOS DE EQUIPO =====
export interface Player {
  id: string;
  name: string;
  role: 'captain' | 'player' | 'admin';
  experience: number;
  avatar?: string;
  games: string[]; // IDs de los juegos que juega
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    winRate: number;
  };
}

export interface Team extends BaseEntity {
  name: string;
  description: string;
  logo?: string;
  image: string;
  tag: string;
  type?: 'created' | 'joined';
  role?: 'captain' | 'player' | 'admin';
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
  totalMatches: number;
  wins: number;
  losses: number;
  rank: string;
  tier: string;
  points: number;
}

// ===== TIPOS DE TORNEO =====
export interface Tournament extends BaseEntity {
  name: string;
  description: string;
  gameId: string;
  gameName?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  status: 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: string;
  endDate?: string;
  rules: string[];
  image?: string;
  organizerId: string;
  organizerName?: string;
}

// ===== TIPOS DE SOLICITUDES =====
export interface TeamRequest extends BaseEntity {
  type: 'sent' | 'received';
  status: 'pending' | 'accepted' | 'rejected';
  team: {
    id: string;
    name: string;
    tag: string;
    logo?: string;
    image: string;
    rank: string;
    tier: string;
    points: number;
  };
  user?: User;
  message?: string;
  gameRequirements?: GameRequirement[];
}

// ===== TIPOS DE CATEGORÍAS =====
export interface Category extends BaseEntity {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  isActive: boolean;
}

// ===== TIPOS DE CONFIGURACIÓN =====
export interface SystemConfig extends BaseEntity {
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  isPublic: boolean;
}

// ===== TIPOS DE PAGINACIÓN =====
export interface PaginationInfo {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  success: boolean;
  message: string;
}

// ===== TIPOS DE BÚSQUEDA =====
export interface SearchFilters {
  search?: string;
  category?: string;
  status?: string;
  game?: string;
  rank?: string;
  [key: string]: any;
}

export interface SearchParams extends SearchFilters {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Tipo para búsquedas dinámicas con parámetros flexibles
export interface DynamicSearchParams {
  [key: string]: any;
  // Campos comunes
  Nombre?: string;
  CategoriaId?: number;
  IsActive?: boolean;
  // Campos adicionales para torneos
  Estado?: string;
  Dificultad?: string;
  FechaInicio?: string;
  FechaFin?: string;
  // Campos adicionales para equipos
  Tag?: string;
  Rank?: string;
  Tier?: string;
}

// ===== TIPOS DE FORMULARIOS =====
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file' | 'checkbox' | 'radio' | 'requirements' | 'phone' | 'category' | 'datetime-local' | 'currency';
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  step?: number;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: string;
    message?: string;
  };
  className?: string;
  colSpan?: number;
}

// ===== TIPOS DE NOTIFICACIONES =====
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// ===== TIPOS DE ESTADÍSTICAS =====
export interface Stats {
  total: number;
  active: number;
  inactive: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

// ===== TIPOS DE COLORES =====
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}
