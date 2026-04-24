import { GameForm } from '../types/GameForm';
import { emojiToUnicode, unicodeToEmoji } from '../../shared/utils';

// Interfaz para los datos del juego desde la API
export interface GameApiData {
  id?: number;
  nombre: string;
  descripcion: string;
  categoriaId?: number;
  icon?: string;
  isActive?: boolean;
  logo?: string;
}

/**
 * Mapper para convertir entre los datos de la API y el formulario de juegos
 */
export class GameMapper {
  
  /**
   * Convierte los datos del juego de la API al formato del formulario
   * @param game - Datos del juego desde la API
   * @returns Datos del formulario
   */
  static toFormData(game: GameApiData): GameForm {
    return {
      id: game.id,
      nombre: game.nombre || '',
      descripcion: game.descripcion || '',
      categoriaId: game.categoriaId?.toString() || '',
      icon: game.icon ? unicodeToEmoji(game.icon) : '🎮',
      logo: undefined, // No podemos cargar archivos desde URL
      isActive: game.isActive ?? true,
      palette: {
        // Valores por defecto para la paleta (no vienen del backend)
        primaryColor: '#1a1a2e',
        secondaryColor: '#16213e',
        tertiaryColor: '#0f3460',
        accentColor: '#533483',
        lightColor: '#ffffff'
      }
    };
  }

  /**
   * Convierte los datos del formulario al formato de la API
   * @param formData - Datos del formulario
   * @param logoBase64 - Logo en base64 (opcional)
   * @returns Datos para enviar a la API
   */
  static toApiData(formData: GameForm, logoBase64?: string) {
    const apiData: any = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoriaId: formData.categoriaId ? parseInt(formData.categoriaId) : null,
      icon: formData.icon ? emojiToUnicode(formData.icon) : null,
      isActive: formData.isActive
    };

    // Agregar ID solo si existe (modo edición)
    if (formData.id) {
      apiData.id = formData.id;
    }

    // Agregar logo si existe
    if (logoBase64) {
      apiData.logo = logoBase64;
    }

    return apiData;
  }

  /**
   * Crea datos iniciales del formulario con valores por defecto
   * @returns Formulario con valores iniciales
   */
  static getInitialFormData(): GameForm {
    return {
      nombre: '',
      descripcion: '',
      categoriaId: '',
      icon: '🎮',
      logo: undefined,
      isActive: true,
      palette: {
        primaryColor: '#1a1a2e',
        secondaryColor: '#16213e',
        tertiaryColor: '#0f3460',
        accentColor: '#533483',
        lightColor: '#ffffff'
      }
    };
  }

  /**
   * Valida si los datos del formulario están completos
   * @param formData - Datos del formulario
   * @returns true si está completo, false si faltan campos
   */
  static validateFormData(formData: GameForm): { isValid: boolean; missingFields: string[] } {
    const requiredFields: (keyof GameForm)[] = [
      'nombre', 'descripcion'
    ];

    const missingFields: string[] = [];

    requiredFields.forEach(field => {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        missingFields.push(field);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Convierte emoji a unicode para almacenamiento
   * @param emoji - Emoji como string
   * @returns Unicode del emoji
   */
  static emojiToUnicode(emoji: string): string {
    return emojiToUnicode(emoji);
  }

  /**
   * Convierte unicode a emoji para mostrar
   * @param unicode - Unicode del emoji
   * @returns Emoji como string
   */
  static unicodeToEmoji(unicode: string): string {
    return unicodeToEmoji(unicode);
  }

  /**
   * Valida si un emoji es válido
   * @param emoji - Emoji a validar
   * @returns true si es válido
   */
  static isValidEmoji(emoji: string): boolean {
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiRegex.test(emoji);
  }
}
