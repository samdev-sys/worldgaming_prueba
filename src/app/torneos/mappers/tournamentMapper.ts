import { Torneo } from '../hooks/useTorneos';
import { TournamentForm } from '../hooks/useCrearTorneo';
import { 
  TOURNAMENT_DIFFICULTY, 
  TOURNAMENT_STATUS 
} from '../../shared/constants/tournament';
import { validateDateRange } from '../../shared/utils/dateUtils';
import { BaseMapper, FieldMapping, ValidationConfig } from '../../shared/mappers';
import { ValidationResult } from '@/app/shared/utils/validation';

/**
 * Mapper para convertir entre los datos de la API y el formulario de torneos
 */
export class TournamentMapper extends BaseMapper<Torneo, TournamentForm> {
  
  protected getApiToFormMapping(): FieldMapping[] {
    return [
      { apiField: 'id', formField: 'id' },
      { apiField: 'nombre', formField: 'name', defaultValue: '' },
      { apiField: 'juegoId', formField: 'game', transform: BaseMapper.commonTransforms.numberToString, defaultValue: '' },
      { apiField: 'descripcion', formField: 'description', defaultValue: '' },
      { apiField: 'dificultad', formField: 'difficulty', defaultValue: TOURNAMENT_DIFFICULTY.INTERMEDIO },
      { apiField: 'maxParticipantes', formField: 'maxParticipants', defaultValue: 0 },
      { apiField: 'cantidadEquipos', formField: 'cantidadEquipos', defaultValue: 0 },
      { apiField: 'costoEntrada', formField: 'entryFee', defaultValue: 0 },
      { apiField: 'premio', formField: 'prize', defaultValue: '$0' },
      { apiField: 'fechaInicio', formField: 'startDate', transform: BaseMapper.commonTransforms.dateToInputString, defaultValue: '' },
      { apiField: 'fechaFin', formField: 'endDate', transform: BaseMapper.commonTransforms.dateToInputString, defaultValue: '' },
      { apiField: 'estado', formField: 'status', defaultValue: TOURNAMENT_STATUS.PROXIMO },
      { apiField: 'reglas', formField: 'rules', transform: (value: any) => {
        if (!value) return [];
        if (typeof value === 'string') {
          return value.split(';').map(rule => rule.trim()).filter(rule => rule.length > 0);
        }
        if (Array.isArray(value)) {
          return value;
        }
        return [];
      }, defaultValue: [] },
      { apiField: 'isActive', formField: 'isActive', defaultValue: true },
      { apiField: 'titulares', formField: 'titulares', defaultValue: 0 },
      { apiField: 'suplentes', formField: 'suplentes', defaultValue: 0 }
    ];
  }

  protected getFormToApiMapping(): FieldMapping[] {
    return [
      { formField: 'id', apiField: 'id' },
      { formField: 'name', apiField: 'Nombre' },
      { formField: 'game', apiField: 'JuegoId', transform: BaseMapper.commonTransforms.stringToNumber },
      { formField: 'description', apiField: 'Descripcion' },
      { formField: 'startDate', apiField: 'FechaInicio', transform: BaseMapper.commonTransforms.inputStringToDate },
      { formField: 'endDate', apiField: 'FechaFin', transform: BaseMapper.commonTransforms.inputStringToDate },
      { formField: 'maxParticipants', apiField: 'MaxParticipantes' },
      { formField: 'titulares', apiField: 'Titulares' },
      { formField: 'suplentes', apiField: 'Suplentes' },
      { formField: 'prize', apiField: 'Premio' },
      { formField: 'status', apiField: 'Estado' },
      { formField: 'entryFee', apiField: 'CostoEntrada', transform: (value: number) => parseFloat(value.toString()) },
      { formField: 'rules', apiField: 'Reglas', transform: (rules: string[]) => rules.length > 0 ? rules.join('; ') : null },
      { formField: 'cantidadEquipos', apiField: 'CantidadEquipos' },
      { formField: 'difficulty', apiField: 'Dificultad' },
      { formField: 'isActive', apiField: 'IsActive' }
    ];
  }

  protected getValidationConfig(): ValidationConfig[] {
    return [
      {
        field: 'name',
        rules: {
          required: true,
          minLength: 2,
          maxLength: 100,
          pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_#]+$/,
          custom: (value: string) => !value.includes('<') || 'No se permiten caracteres HTML'
        }
      },
      {
        field: 'game',
        rules: BaseMapper.commonValidationRules.required
      },
      {
        field: 'description',
        rules: { ...BaseMapper.commonValidationRules.validDescription }
      },
      {
        field: 'startDate',
        rules: BaseMapper.commonValidationRules.required
      },
      {
        field: 'endDate',
        rules: BaseMapper.commonValidationRules.required
      },
      {
        field: 'maxParticipants',
        rules: { ...BaseMapper.commonValidationRules.required, custom: (value: number) => value > 0 || 'Debe ser mayor a 0' }
      },
      {
        field: 'cantidadEquipos',
        rules: { ...BaseMapper.commonValidationRules.required, custom: (value: number) => value > 0 || 'Debe ser mayor a 0' }
      },
      {
        field: 'entryFee',
        rules: { ...BaseMapper.commonValidationRules.required, custom: (value: number) => value >= 0 || 'No puede ser negativo' }
      },
      {
        field: 'titulares',
        rules: { ...BaseMapper.commonValidationRules.required, custom: (value: number) => value > 0 || 'Debe ser mayor a 0' }
      },
      {
        field: 'suplentes',
        rules: { ...BaseMapper.commonValidationRules.required, custom: (value: number) => value >= 0 || 'No puede ser negativo' }
      }
    ];
  }

  protected getInitialFormData(): TournamentForm {
    return {
      name: '',
      game: '',
      description: '',
      difficulty: TOURNAMENT_DIFFICULTY.INTERMEDIO,
      maxParticipants: 40,
      cantidadEquipos: 8,
      entryFee: 0,
      prize: '0',
      startDate: '',
      endDate: '',
      status: TOURNAMENT_STATUS.PROXIMO,
      rules: [],
      isActive: true,
      titulares: 5,
      suplentes: 2
    };
  }

  /**
   * Valida los datos del formulario con validaciones adicionales específicas de torneos
   * @param formData - Datos del formulario
   * @returns Resultado de la validación
   */
  public override validateFormData(formData: TournamentForm): ValidationResult {
    const result = super.validateFormData(formData);

    // Validación adicional de fechas específica para torneos
    if (formData.startDate && formData.endDate) {
      const dateValidation = validateDateRange(formData.startDate, formData.endDate);
      
      if (!dateValidation.isValid) {
        result.errors.push(dateValidation.error || 'Error en las fechas');
      }
    }

    return result;
  }

  /**
   * Convierte los datos del formulario al formato de la API con datos adicionales
   * @param formData - Datos del formulario
   * @param additionalData - Datos adicionales (como imágenes en base64)
   * @returns Datos para enviar a la API
   */
  public override toApiData(formData: TournamentForm, additionalData?: Record<string, any>) {
    const baseData = super.toApiData(formData, additionalData);
    
    // Agregar campos específicos de torneos
    return {
      ...baseData,
      MaxJugadores: formData.titulares + formData.suplentes,
      Imagen: additionalData?.['imageBase64'] || null
    };
  }

  /**
   * Calcula el número máximo de participantes basado en equipos y titulares
   * @param equipos - Número de equipos
   * @param titulares - Número de titulares por equipo
   * @returns Número máximo de participantes
   */
  public calculateMaxParticipants(equipos: number, titulares: number): number {
    return equipos * titulares;
  }

  /**
   * Convierte reglas de array a string separado por punto y coma
   * @param rules - Array de reglas
   * @returns String con reglas separadas por punto y coma
   */
  static rulesArrayToString(rules: string[]): string {
    return rules.join('; ');
  }

  /**
   * Convierte reglas de string a array
   * @param rulesString - String con reglas separadas por punto y coma
   * @returns Array de reglas
   */
  static rulesStringToArray(rulesString: string): string[] {
    if (!rulesString) return [];
    return rulesString.split(';').map(rule => rule.trim()).filter(rule => rule.length > 0);
  }
}
