/**
 * Constantes consolidadas para torneos
 */

// Interfaces base para configuraciones
export interface TournamentDifficultyConfig {
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

export interface TournamentStatusConfig {
  value: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

// Constantes de dificultad
export const TOURNAMENT_DIFFICULTY = {
  PRINCIPIANTE: 'Principiante',
  INTERMEDIO: 'Intermedio',
  EXPERTO: 'Experto'
} as const;

export const TOURNAMENT_DIFFICULTY_CONFIG: Record<string, TournamentDifficultyConfig> = {
  [TOURNAMENT_DIFFICULTY.PRINCIPIANTE]: {
    value: TOURNAMENT_DIFFICULTY.PRINCIPIANTE,
    label: 'Principiante',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20'
  },
  [TOURNAMENT_DIFFICULTY.INTERMEDIO]: {
    value: TOURNAMENT_DIFFICULTY.INTERMEDIO,
    label: 'Intermedio',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20'
  },
  [TOURNAMENT_DIFFICULTY.EXPERTO]: {
    value: TOURNAMENT_DIFFICULTY.EXPERTO,
    label: 'Experto',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20'
  }
};

// Constantes de estado
export const TOURNAMENT_STATUS = {
  PROXIMO: 'Próximo',
  ACTIVO: 'Activo',
  COMPLETADO: 'Completado'
} as const;

export const TOURNAMENT_STATUS_CONFIG: Record<string, TournamentStatusConfig> = {
  [TOURNAMENT_STATUS.PROXIMO]: {
    value: TOURNAMENT_STATUS.PROXIMO,
    label: 'Próximo',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  [TOURNAMENT_STATUS.ACTIVO]: {
    value: TOURNAMENT_STATUS.ACTIVO,
    label: 'Activo',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  },
  [TOURNAMENT_STATUS.COMPLETADO]: {
    value: TOURNAMENT_STATUS.COMPLETADO,
    label: 'Completado',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30'
  }
};

// Opciones para formularios
export const TOURNAMENT_DIFFICULTY_OPTIONS = Object.values(TOURNAMENT_DIFFICULTY_CONFIG).map(config => ({
  value: config.value,
  label: config.label
}));

export const TOURNAMENT_STATUS_OPTIONS = [
  { value: 'Próximo', label: 'Próximos torneos' },
  { value: 'Activo', label: 'Torneos en juego' },
  { value: 'Completado', label: 'Torneos terminados' }
];

// Funciones de utilidad
export const getTournamentDifficultyConfig = (difficulty: string): TournamentDifficultyConfig => {
  return TOURNAMENT_DIFFICULTY_CONFIG[difficulty] || TOURNAMENT_DIFFICULTY_CONFIG[TOURNAMENT_DIFFICULTY.INTERMEDIO];
};

export const getTournamentStatusConfig = (status: string): TournamentStatusConfig => {
  return TOURNAMENT_STATUS_CONFIG[status] || TOURNAMENT_STATUS_CONFIG[TOURNAMENT_STATUS.COMPLETADO];
};

export const getTournamentDifficultyColor = (difficulty: string): string => {
  const config = getTournamentDifficultyConfig(difficulty);
  return `${config.bgColor} ${config.color}`;
};

export const getTournamentStatusColor = (status: string): string => {
  const config = getTournamentStatusConfig(status);
  return `${config.bgColor} ${config.color} ${config.borderColor}`;
};

// Tipos derivados
export type TournamentDifficulty = typeof TOURNAMENT_DIFFICULTY[keyof typeof TOURNAMENT_DIFFICULTY];
export type TournamentStatus = typeof TOURNAMENT_STATUS[keyof typeof TOURNAMENT_STATUS];
