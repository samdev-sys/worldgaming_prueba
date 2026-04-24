/**
 * Utilidades para manejo de fechas y validaciones
 */

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Formatea una fecha para input datetime-local
 * @param date - Fecha a formatear
 * @returns String en formato YYYY-MM-DDTHH:mm
 */
export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().slice(0, 16);
};

/**
 * Convierte string de input datetime-local a Date
 * @param dateString - String de fecha del input
 * @returns Objeto Date
 */
export const parseInputDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Valida que una fecha sea válida
 * @param date - Fecha a validar
 * @returns true si es válida
 */
export const isValidDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return !isNaN(dateObj.getTime());
};

/**
 * Valida un rango de fechas
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @param options - Opciones de validación
 * @returns Resultado de la validación
 */
export const validateDateRange = (
  startDate: Date | string,
  endDate: Date | string,
  options: {
    minDuration?: number; // en minutos
    maxDuration?: number; // en minutos
    requireFuture?: boolean;
    minStartDate?: Date | string;
  } = {}
): DateValidationResult => {
  const {
    requireFuture = true,
  } = options;

  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();

  // Validar que las fechas sean válidas
  if (!isValidDate(start)) {
    return { isValid: false, error: 'La fecha de inicio no es válida' };
  }

  if (!isValidDate(end)) {
    return { isValid: false, error: 'La fecha de fin no es válida' };
  }

  // Validar que la fecha de inicio sea futura
  if (requireFuture && start <= now) {
    return { isValid: false, error: 'La fecha de inicio debe ser futura' };
  }

  return { isValid: true };
};

/**
 * Calcula la duración entre dos fechas
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @returns Objeto con la duración en diferentes unidades
 */
export const calculateDuration = (startDate: Date | string, endDate: Date | string) => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffMs = end.getTime() - start.getTime();
  
  return {
    milliseconds: diffMs,
    seconds: Math.floor(diffMs / 1000),
    minutes: Math.floor(diffMs / (1000 * 60)),
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    days: Math.floor(diffMs / (1000 * 60 * 60 * 24))
  };
};

/**
 * Formatea la duración en un string legible
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @returns String formateado
 */
export const formatDuration = (startDate: Date | string, endDate: Date | string): string => {
  const duration = calculateDuration(startDate, endDate);
  
  if (duration.days > 0) {
    return `${duration.days} día${duration.days > 1 ? 's' : ''}`;
  } else if (duration.hours > 0) {
    return `${duration.hours} hora${duration.hours > 1 ? 's' : ''}`;
  } else if (duration.minutes > 0) {
    return `${duration.minutes} minuto${duration.minutes > 1 ? 's' : ''}`;
  } else {
    return `${duration.seconds} segundo${duration.seconds > 1 ? 's' : ''}`;
  }
};

/**
 * Obtiene la fecha actual en formato para input
 * @returns String de fecha actual
 */
export const getCurrentDateForInput = (): string => {
  return formatDateForInput(new Date());
};

/**
 * Obtiene una fecha futura en formato para input
 * @param hours - Horas a agregar a la fecha actual
 * @returns String de fecha futura
 */
export const getFutureDateForInput = (hours: number = 1): string => {
  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + hours);
  return formatDateForInput(futureDate);
};

/**
 * Compara dos fechas
 * @param date1 - Primera fecha
 * @param date2 - Segunda fecha
 * @returns -1 si date1 < date2, 0 si son iguales, 1 si date1 > date2
 */
export const compareDates = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
};

/**
 * Verifica si una fecha está en el pasado
 * @param date - Fecha a verificar
 * @returns true si está en el pasado
 */
export const isPastDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Verifica si una fecha está en el futuro
 * @param date - Fecha a verificar
 * @returns true si está en el futuro
 */
export const isFutureDate = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj > new Date();
};

/**
 * Verifica si una fecha es hoy
 * @param date - Fecha a verificar
 * @returns true si es hoy
 */
export const isToday = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
};

/**
 * Formatea una fecha para mostrar al usuario
 * @param date - Fecha a formatear
 * @param locale - Locale para el formato
 * @returns String formateado
 */
export const formatDateForDisplay = (date: Date | string, locale: string = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Obtiene el estado de una fecha respecto a un rango
 * @param date - Fecha a evaluar
 * @param startDate - Fecha de inicio del rango
 * @param endDate - Fecha de fin del rango
 * @returns Estado de la fecha
 */
export const getDateStatus = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): 'before' | 'during' | 'after' => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (d < start) return 'before';
  if (d > end) return 'after';
  return 'during';
};
