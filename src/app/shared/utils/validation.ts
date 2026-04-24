/**
 * Utilidades de validación usando Zod
 * Reemplaza el sistema de validación personalizado por Zod
 */

import { z } from 'zod';

// ===== ESQUEMAS DE VALIDACIÓN COMUNES =====

// Esquema para usuario
export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es demasiado largo'),
  email: z.string().email('Debe ser un email válido'),
  role: z.enum(['admin', 'captain', 'player', 'spectator']),
  experience: z.number().min(0, 'La experiencia no puede ser negativa').max(50, 'Experiencia inválida'),
  rank: z.string().min(1, 'El rango es requerido'),
  tier: z.string().optional(),
  points: z.number().min(0, 'Los puntos no pueden ser negativos')
});

// Esquema para equipo
export const teamSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre del equipo es requerido').max(100, 'Nombre demasiado largo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(500, 'Descripción demasiado larga'),
  tag: z.string().min(2, 'El tag debe tener al menos 2 caracteres').max(10, 'Tag demasiado largo'),
  type: z.enum(['created', 'joined']).optional(),
  role: z.enum(['captain', 'player', 'admin']).optional(),
  isActive: z.boolean().optional(),
  totalMatches: z.number().min(0, 'No puede ser negativo'),
  wins: z.number().min(0, 'No puede ser negativo'),
  losses: z.number().min(0, 'No puede ser negativo'),
  rank: z.string().min(1, 'El rango es requerido'),
  tier: z.string().min(1, 'El tier es requerido'),
  points: z.number().min(0, 'Los puntos no pueden ser negativos')
});

// Esquema para torneo
export const tournamentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre del torneo es requerido').max(100, 'Nombre demasiado largo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(500, 'Descripción demasiado larga'),
  gameId: z.string().min(1, 'El juego es requerido'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  status: z.enum(['draft', 'published', 'active', 'completed', 'cancelled']),
  entryFee: z.number().min(0, 'La tarifa no puede ser negativa'),
  prizePool: z.number().min(0, 'El premio no puede ser negativo'),
  maxParticipants: z.number().min(2, 'Mínimo 2 participantes').max(1000, 'Máximo 1000 participantes'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().optional(),
  rules: z.array(z.string()).min(1, 'Debe tener al menos una regla')
});

// Esquema para juego
export const gameSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre del juego es requerido').max(100, 'Nombre demasiado largo'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(500, 'Descripción demasiado larga'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  minPlayers: z.number().min(1, 'Mínimo 1 jugador').max(20, 'Máximo 20 jugadores'),
  maxPlayers: z.number().min(1, 'Mínimo 1 jugador').max(20, 'Máximo 20 jugadores'),
  rules: z.string().optional(),
  isActive: z.boolean().optional()
});

// ===== ESQUEMAS DE FORMULARIOS =====

// Esquema para login
export const loginSchema = z.object({
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

// Esquema para registro
export const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Nombre demasiado largo'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Debe contener al menos una letra minúscula, una mayúscula y un número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

// Esquema para solicitud de equipo
export const teamRequestSchema = z.object({
  teamId: z.string().min(1, 'El equipo es requerido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(500, 'Mensaje demasiado largo')
});

// ===== FUNCIONES DE VALIDACIÓN =====

/**
 * Valida un objeto usando un esquema de Zod
 */
export const validateWithSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Error de validación desconocido'] };
  }
};

/**
 * Valida un campo específico
 */
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fieldName: string
): { isValid: boolean; error?: string } => {
  try {
    schema.parse(data);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.issues.find(err => err.path.includes(fieldName));
      return { isValid: false, error: fieldError?.message || 'Error de validación' };
    }
    return { isValid: false, error: 'Error de validación' };
  }
};

/**
 * Valida un email
 */
export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

/**
 * Valida una contraseña
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Debe tener al menos 8 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Valida un teléfono
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Valida una URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Valida un archivo
 */
export const validateFile = (file: File, options: {
  maxSize?: number; // en MB
  allowedTypes?: string[];
}): { isValid: boolean; error?: string } => {
  const { maxSize = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options;
  
  if (file.size > maxSize * 1024 * 1024) {
    return { isValid: false, error: `El archivo no puede ser mayor a ${maxSize}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}` };
  }
  
  return { isValid: true };
};

// ===== TIPOS EXPORTADOS =====
export type User = z.infer<typeof userSchema>;
export type Team = z.infer<typeof teamSchema>;
export type Tournament = z.infer<typeof tournamentSchema>;
export type Game = z.infer<typeof gameSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type TeamRequest = z.infer<typeof teamRequestSchema>;

// ===== EXPORTACIONES PARA COMPATIBILIDAD =====
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateForm = (data: any, schema: z.ZodSchema): ValidationResult => {
  try {
    schema.parse(data);
    return { isValid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      return { isValid: false, errors };
    }
    return { isValid: false, errors: ['Error de validación desconocido'] };
  }
};

export const CommonValidationRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => value.includes('@') || 'Debe ser un email válido'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    custom: (value: string) => {
      const hasLower = /[a-z]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      
      if (!hasLower) return 'Debe contener al menos una letra minúscula';
      if (!hasUpper) return 'Debe contener al menos una letra mayúscula';
      if (!hasNumber) return 'Debe contener al menos un número';
      return true;
    }
  }
};
