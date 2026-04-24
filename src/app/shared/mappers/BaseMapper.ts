import { ValidationResult, CommonValidationRules } from '../utils';

/**
 * Interfaz base para datos de API
 */
export interface BaseApiData {
  id?: number;
  nombre?: string;
  descripcion?: string;
  isActive?: boolean;
}

/**
 * Interfaz base para datos de formulario
 */
export interface BaseFormData {
  id?: number;
  name?: string;
  description?: string;
  isActive?: boolean;
}

/**
 * Configuración para mapeo de campos
 */
export interface FieldMapping {
  apiField: string;
  formField: string;
  transform?: (value: any) => any;
  defaultValue?: any;
}

/**
 * Configuración para validación de campos
 */
export interface ValidationConfig {
  field: string;
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

/**
 * Mapper base abstracto que proporciona funcionalidad común
 */
export abstract class BaseMapper<TApiData extends BaseApiData, TFormData extends BaseFormData> {
  
  /**
   * Mapeo de campos de API a formulario
   */
  protected abstract getApiToFormMapping(): FieldMapping[];
  
  /**
   * Mapeo de campos de formulario a API
   */
  protected abstract getFormToApiMapping(): FieldMapping[];
  
  /**
   * Configuración de validación
   */
  protected abstract getValidationConfig(): ValidationConfig[];
  
  /**
   * Obtiene los datos iniciales del formulario
   */
  protected abstract getInitialFormData(): TFormData;

  /**
   * Convierte datos de la API al formato del formulario
   * @param apiData - Datos de la API
   * @returns Datos del formulario
   */
  public toFormData(apiData: TApiData): TFormData {
    const mapping = this.getApiToFormMapping();
    const formData = {} as TFormData;

    mapping.forEach(({ apiField, formField, transform, defaultValue }) => {
      let value = this.getNestedValue(apiData, apiField);
      
      if (value === undefined || value === null) {
        value = defaultValue;
      }
      
      if (transform) {
        value = transform(value);
      }
      
      this.setNestedValue(formData, formField, value);
    });

    return formData;
  }

  /**
   * Convierte datos del formulario al formato de la API
   * @param formData - Datos del formulario
   * @param additionalData - Datos adicionales (como imágenes en base64)
   * @returns Datos para la API
   */
  public toApiData(formData: TFormData, additionalData?: Record<string, any>): TApiData {
    const mapping = this.getFormToApiMapping();
    const apiData = {} as TApiData;

    mapping.forEach(({ formField, apiField, transform }) => {
      let value = this.getNestedValue(formData, formField);
      
      if (transform) {
        value = transform(value);
      }
      
      this.setNestedValue(apiData, apiField, value);
    });

    // Agregar datos adicionales
    if (additionalData) {
      Object.assign(apiData, additionalData);
    }

    return apiData;
  }

  /**
   * Obtiene los datos iniciales del formulario
   * @returns Datos iniciales
   */
  public getInitialData(): TFormData {
    return this.getInitialFormData();
  }

  /**
   * Valida los datos del formulario
   * @param formData - Datos a validar
   * @returns Resultado de la validación
   */
  public validateFormData(formData: TFormData): ValidationResult {
    const validationConfig = this.getValidationConfig();
    const errors: string[] = [];

    validationConfig.forEach(({ field, rules }) => {
      const value = this.getNestedValue(formData, field);

      // Validar requerido
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`El campo ${field} es requerido`);
        return;
      }

      // Si el campo está vacío y no es requerido, no validar más
      if (!value && !rules.required) return;

      // Validar minLength
      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        errors.push(`El campo ${field} debe tener al menos ${rules.minLength} caracteres`);
      }

      // Validar maxLength
      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        errors.push(`El campo ${field} no puede tener más de ${rules.maxLength} caracteres`);
      }

      // Validar pattern
      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        errors.push(`El campo ${field} no cumple con el formato requerido`);
      }

      // Validar custom
      if (rules.custom) {
        const customResult = rules.custom(value);
        if (customResult !== true) {
          errors.push(typeof customResult === 'string' ? customResult : `El campo ${field} no es válido`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtiene un valor anidado de un objeto usando notación de punto
   * @param obj - Objeto fuente
   * @param path - Ruta al valor
   * @returns Valor encontrado
   */
  protected getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Establece un valor anidado en un objeto usando notación de punto
   * @param obj - Objeto destino
   * @param path - Ruta al valor
   * @param value - Valor a establecer
   */
  protected setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }

  /**
   * Transformaciones comunes que pueden ser reutilizadas
   */
  protected static commonTransforms = {
    /**
     * Convierte string a número
     */
    stringToNumber: (value: string): number => parseInt(value, 10),
    
    /**
     * Convierte número a string
     */
    numberToString: (value: number): string => value.toString(),
    
    /**
     * Convierte array a string separado por punto y coma
     */
    arrayToString: (value: string[]): string => value.join('; '),
    
    /**
     * Convierte string separado por punto y coma a array
     */
    stringToArray: (value: string): string[] => {
      if (!value) return [];
      return value.split(';').map(item => item.trim()).filter(item => item.length > 0);
    },
    
    /**
     * Convierte fecha a string para input datetime-local
     */
    dateToInputString: (value: Date | string): string => {
      const date = typeof value === 'string' ? new Date(value) : value;
      return date.toISOString().slice(0, 16);
    },
    
    /**
     * Convierte string de input datetime-local a Date
     */
    inputStringToDate: (value: string): Date => new Date(value),
    
    /**
     * Convierte boolean a string
     */
    booleanToString: (value: boolean): string => value.toString(),
    
    /**
     * Convierte string a boolean
     */
    stringToBoolean: (value: string): boolean => value === 'true',
    
    /**
     * Aplica valor por defecto si es null/undefined
     */
    withDefault: (defaultValue: any) => (value: any) => value ?? defaultValue,
    
    /**
     * Sanitiza string removiendo HTML
     */
    sanitizeString: (value: string): string => {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    }
  };

  /**
   * Reglas de validación comunes que pueden ser reutilizadas
   */
  protected static commonValidationRules = {
    required: CommonValidationRules.required,
    email: CommonValidationRules.email,
    password: CommonValidationRules.password,
    
    /**
     * Regla para nombre válido
     */
    validName: {
      required: true,
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      custom: (value: string) => !value.includes('<') || 'No se permiten caracteres HTML'
    },
    
    /**
     * Regla para descripción válida
     */
    validDescription: {
      required: true,
      minLength: 10,
      maxLength: 500,
      custom: (value: string) => !value.includes('<') || 'No se permiten caracteres HTML'
    }
  };
}
