/**
 * Constantes centralizadas para toda la aplicación
 * Evita valores mágicos y facilita mantenimiento
 */

// ===== CONSTANTES DE PAGINACIÓN =====
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 6,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48, 96],
  DEFAULT_PAGE_NUMBER: 1
} as const;

// ===== CONSTANTES DE DEBOUNCE =====
export const DEBOUNCE = {
  SEARCH: 300,
  INPUT: 500,
  API_CALL: 1000
} as const;

// ===== CONSTANTES DE VALIDACIÓN =====
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PHONE: {
    PATTERN: /^\+?[\d\s\-\(\)]+$/
  }
} as const;

// ===== CONSTANTES DE JUEGOS =====
export const GAMES = {
  LEAGUE_OF_LEGENDS: '1',
  VALORANT: '2',
  CS_GO: '3',
  ROCKET_LEAGUE: '4',
  FIFA: '5',
  DOTA_2: '6',
  OVERWATCH: '7'
} as const;

export const GAME_NAMES = {
  [GAMES.LEAGUE_OF_LEGENDS]: 'League of Legends',
  [GAMES.VALORANT]: 'Valorant',
  [GAMES.CS_GO]: 'CS:GO',
  [GAMES.ROCKET_LEAGUE]: 'Rocket League',
  [GAMES.FIFA]: 'FIFA',
  [GAMES.DOTA_2]: 'Dota 2',
  [GAMES.OVERWATCH]: 'Overwatch'
} as const;

// ===== CONSTANTES DE TORNEOS =====
export const TOURNAMENT_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert'
} as const;

export const TOURNAMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const TOURNAMENT_DIFFICULTY_OPTIONS = [
  { value: TOURNAMENT_DIFFICULTY.BEGINNER, label: 'Principiante' },
  { value: TOURNAMENT_DIFFICULTY.INTERMEDIATE, label: 'Intermedio' },
  { value: TOURNAMENT_DIFFICULTY.ADVANCED, label: 'Avanzado' },
  { value: TOURNAMENT_DIFFICULTY.EXPERT, label: 'Experto' }
];

export const TOURNAMENT_STATUS_OPTIONS = [
  { value: TOURNAMENT_STATUS.DRAFT, label: 'Borrador' },
  { value: TOURNAMENT_STATUS.PUBLISHED, label: 'Publicado' },
  { value: TOURNAMENT_STATUS.ACTIVE, label: 'Activo' },
  { value: TOURNAMENT_STATUS.COMPLETED, label: 'Completado' },
  { value: TOURNAMENT_STATUS.CANCELLED, label: 'Cancelado' }
];

// ===== CONSTANTES DE EQUIPOS =====
export const TEAM_ROLES = {
  CAPTAIN: 'captain',
  PLAYER: 'player',
  ADMIN: 'admin'
} as const;

export const TEAM_TYPES = {
  CREATED: 'created',
  JOINED: 'joined'
} as const;

// ===== CONSTANTES DE USUARIOS =====
export const USER_ROLES = {
  ADMIN: 'admin',
  CAPTAIN: 'captain',
  PLAYER: 'player',
  SPECTATOR: 'spectator'
} as const;

// ===== CONSTANTES DE RANGOS =====
export const RANKS = {
  BRONZE: 'Bronce',
  SILVER: 'Plata',
  GOLD: 'Oro',
  PLATINUM: 'Platino',
  DIAMOND: 'Diamante',
  MASTER: 'Maestro',
  GRANDMASTER: 'Gran Maestro',
  CHALLENGER: 'Retador'
} as const;

export const TIERS = ['V', 'IV', 'III', 'II', 'I'] as const;

// ===== CONSTANTES DE NOTIFICACIONES =====
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000
} as const;

// ===== CONSTANTES DE API =====
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'Auth/login',
    REGISTER: 'Auth/register',
    LOGOUT: 'Auth/logout',
    REFRESH: 'Auth/refresh'
  },
  USERS: {
    BASE: 'Users',
    PROFILE: 'Users/profile',
    SEARCH: 'Users/search'
  },
  TEAMS: {
    BASE: 'Equipo',
    SEARCH: 'Equipo/search',
    REQUESTS: 'Equipo/requests'
  },
  TOURNAMENTS: {
    BASE: 'Tournaments',
    SEARCH: 'Tournaments/search',
    JOIN: 'Tournaments/join'
  },
  GAMES: {
    BASE: 'Games',
    CATEGORIES: 'Games/categories',
    SEARCH: 'Games/search'
  }
} as const;

// ===== CONSTANTES DE COLORES =====
export const COLORS = {
  PRIMARY: '#8B5CF6',
  SECONDARY: '#06B6D4',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#3B82F6',
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
} as const;

// ===== CONSTANTES DE LAYOUT =====
export const LAYOUT = {
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 256,
  CONTENT_MAX_WIDTH: 1200,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024
} as const;

// ===== CONSTANTES DE ARCHIVOS =====
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
} as const;

// ===== CONSTANTES DE TIEMPO =====
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000
} as const;

// ===== CONSTANTES DE FORMATO =====
export const FORMAT = {
  DATE: 'DD/MM/YYYY',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
  CURRENCY: 'USD',
  PHONE: '+1 (XXX) XXX-XXXX'
} as const;
