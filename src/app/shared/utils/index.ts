/**
 * Utilidades comunes optimizadas usando librerías especializadas
 * Reemplaza las utilidades personalizadas por librerías probadas
 */

import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { nanoid } from 'nanoid';

// ===== UTILIDADES DE FECHA =====
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Fecha inválida';
    return format(dateObj, formatStr, { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) return 'hace un momento';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
};

// ===== UTILIDADES DE TEXTO =====
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateId = (): string => {
  return nanoid();
};

// ===== UTILIDADES DE NÚMEROS =====
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-ES').format(num);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const calculateWinRate = (wins: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
};

// ===== UTILIDADES DE CLASES CSS =====
export const cn = (...inputs: ClassValue[]): string => {
  return clsx(inputs);
};

// ===== UTILIDADES DE VALIDACIÓN =====
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ===== UTILIDADES DE ALMACENAMIENTO =====
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      return defaultValue || null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// ===== UTILIDADES DE URL =====
export const buildUrl = (baseUrl: string, params: Record<string, any>): string => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
};

export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

// ===== UTILIDADES DE ARCHIVOS =====
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const createFileUploadHandler = (
  options: { maxSize?: number; allowedTypes?: string[] },
  onSuccess: (file: File, base64: string) => void,
  onError: (error: string) => void
) => {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options;
      
      if (file.size > maxSize) {
        onError(`El archivo no puede ser mayor a ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        onError(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
        return;
      }
      
      convertFileToBase64(file)
        .then(base64 => onSuccess(file, base64))
        .catch(() => onError('Error al procesar el archivo'));
    }
  };
};

// ===== UTILIDADES DE COLORES =====
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result && result[1] && result[2] && result[3] ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

export const getContrastColor = (hexColor: string): string => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// ===== UTILIDADES DE RENDIMIENTO =====
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===== UTILIDADES DE ICONOS Y EMOJIS =====
export const unicodeToEmoji = (unicode: string): string => {
  if (!unicode) return '🎮';
  
  try {
    // Si ya es un emoji, devolverlo tal como está
    if (unicode.length === 1 && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(unicode)) {
      return unicode;
    }

    // Si es código Unicode, convertir
    if (unicode.includes('U+')) {
      const codes = unicode.replace(/U\+/g, '').split(/\s+/).filter(code => code.length > 0);
      if (!codes.length) return '🎮';

      return codes.map(code => {
        const num = parseInt(code, 16);
        return String.fromCodePoint(num);
      }).join('');
    }

    return unicode;
  } catch (error) {
    return '🎮';
  }
};

export const emojiToUnicode = (emoji: string): string => {
  if (!emoji) return 'U+1F3AE';
  
  try {
    return emoji.split('').map(char => {
      const codePoint = char.codePointAt(0);
      return codePoint ? `U+${codePoint.toString(16).toUpperCase()}` : '';
    }).join(' ');
  } catch (error) {
    return 'U+1F3AE';
  }
};

export const getDisplayIcon = (icon: string): string => {
  return unicodeToEmoji(icon);
};

// ===== UTILIDADES DE DIFICULTAD =====
export const getDifficultyColor = (difficulty: string): string => {
  const lower = difficulty.toLowerCase();
  if (lower === 'principiante' || lower === 'amateur') {
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  }
  if (lower === 'intermedio' || lower === 'semi-pro') {
    return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }
  if (lower === 'experto' || lower === 'profesional') {
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  }
  return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

// ===== UTILIDADES DE FECHAS =====
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end && start > new Date();
};

// Re-exportar desde validation.ts para compatibilidad
export * from './validation';