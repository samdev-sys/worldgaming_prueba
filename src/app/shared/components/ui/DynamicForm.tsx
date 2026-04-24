import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { LucideIcon, Plus, Trash2, Check } from 'lucide-react';
import PhoneInput from './PhoneInput';
import PasswordRules from './PasswordRules';
import CustomSelect from './CustomSelect';
import CategoryPicker from './CategoryPicker';
import { IFieldConfig } from '../../interface/IFieldConfig';

// Usar la interfaz consolidada
export type FormField = IFieldConfig;

export interface DynamicFormProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onChange?: (values: Record<string, any>) => void;
  title?: string;
  subtitle?: string;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
  showCancelButton?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  requirementsData?: Record<string, string[]>;
  onRequirementsChange?: (fieldName: string, requirements: string[]) => void;
  renderSubmitButton?: ({ submitText, loading }: { submitText: string; loading: boolean }) => React.ReactNode;
}

// Componente memoizado para evitar re-renders innecesarios de campos individuales
const FieldWrapper = memo<{
  field: FormField;
  gridClass: string;
  fieldValue: any;
  renderField: (field: FormField) => React.ReactNode;
}>(({ field, gridClass, fieldValue, renderField }) => {
  return (
    <div className={`space-y-2 ${gridClass}`}>
      {field.type !== 'checkbox' && field.type !== 'radio' && field.type !== 'requirements' && (
        <label htmlFor={`field-${field.name}`} className="block text-white/90 text-sm font-semibold">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {renderField(field)}
      {field.type === 'password' && field.showPasswordRules && (
        <PasswordRules password={fieldValue} />
      )}
      {field.validation?.message && (
        <p className="text-red-400 text-xs">{field.validation.message}</p>
      )}
    </div>
  );
});

FieldWrapper.displayName = 'FieldWrapper';

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  initialValues = {},
  onSubmit = () => {},
  onChange,
  title,
  subtitle,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  onCancel,
  loading = false,
  className = '',
  showCancelButton = true,
  icon: Icon,
  iconColor = 'text-blue-400',
  requirementsData = {},
  onRequirementsChange,
  renderSubmitButton
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [newRequirements, setNewRequirements] = useState<Record<string, string>>({});

  // Memoizar initialValues para evitar recreaciones innecesarias
  const memoizedInitialValues = useMemo(() => initialValues, [
    JSON.stringify(initialValues)
  ]);

  // Actualizar valores cuando cambien los initialValues
  useEffect(() => {
    setValues(prevValues => {
      // Solo actualizar si realmente hay cambios
      const hasChanges = Object.keys(memoizedInitialValues).some(
        key => prevValues[key] !== memoizedInitialValues[key]
      );
      
      if (hasChanges) {
        return { ...memoizedInitialValues };
      }
      
      return prevValues;
    });
  }, [memoizedInitialValues]);

  // Usar ref para evitar bucles infinitos
  const prevValuesRef = useRef<Record<string, any>>({});
  const onChangeRef = useRef(onChange);
  
  // Mantener la referencia de onChange actualizada
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  
  // Llamar a onChange solo cuando los valores realmente cambien
  useEffect(() => {
    if (onChangeRef.current && JSON.stringify(prevValuesRef.current) !== JSON.stringify(values)) {
      prevValuesRef.current = values;
      onChangeRef.current(values);
    }
  }, [values]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  }, [onSubmit, values]);

  const handleInputChange = useCallback((name: string, value: any) => {
    setValues(prevValues => {
      return { ...prevValues, [name]: value };
    });
  }, []);

  const handleAddRequirement = useCallback((fieldName: string) => {
    const newReq = newRequirements[fieldName]?.trim();
    if (newReq && onRequirementsChange) {
      const currentRequirements = requirementsData[fieldName] || [];
      
      // Dividir por comas y limpiar cada elemento
      const newRequirementsList = newReq
        .split(',')
        .map(req => req.trim())
        .filter(req => req.length > 0);
      
      // Agregar todos los requisitos divididos
      onRequirementsChange(fieldName, [...currentRequirements, ...newRequirementsList]);
      setNewRequirements(prev => ({ ...prev, [fieldName]: '' }));
    }
  }, [newRequirements, onRequirementsChange, requirementsData]);

  const handleRemoveRequirement = useCallback((fieldName: string, index: number) => {
    if (onRequirementsChange) {
      const currentRequirements = requirementsData[fieldName] || [];
      onRequirementsChange(fieldName, currentRequirements.filter((_, i) => i !== index));
    }
  }, [onRequirementsChange, requirementsData]);

  const renderField = useCallback((field: FormField) => {
    const value = values[field.name] || '';
    const fieldId = `field-${field.name}`;

    const baseInputClasses = "w-full px-4 py-3 bg-white/8 border-2 border-white/15 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-green-500/60 focus:bg-white/12 transition-all duration-300 font-medium backdrop-blur-sm";
    const fieldClasses = field.className ? `${baseInputClasses} ${field.className}` : baseInputClasses;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            minLength={field.minLength}
            maxLength={field.maxLength}
            className={`${fieldClasses} resize-none`}
            rows={4}
          />
        );

      case 'select':
        return (
          <div className="relative z-[99999999]">
            <CustomSelect
              options={field.options || []}
              value={value || ''}
              onChange={(selectedValue) => handleInputChange(field.name, selectedValue)}
              placeholder={field.placeholder || 'Seleccionar...'}
              className="w-full"
              variant="form"
            />
          </div>
        );

      case 'category':
        return (
          <div className="relative z-[99999999]">
            <CategoryPicker
              categories={field.categoryConfig?.categories || []}
              {...(value && { selectedCategoryId: parseInt(value) })}
              onCategorySelect={(category) => handleInputChange(field.name, category ? category.id.toString() : '')}
              placeholder={field.placeholder || 'Seleccionar categoría...'}
              loading={field.categoryConfig?.loading || false}
              variant="form"
            />
          </div>
        );

      case 'file':
        return (
          <div className="relative">
            <input
              id={fieldId}
              type="file"
              name={field.name}
              onChange={(e) => handleInputChange(field.name, e.target.files?.[0] || null)}
              required={field.required}
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor={fieldId}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
            >
              {value && typeof value === 'object' && 'name' in value ? value.name : (field.placeholder || 'Seleccionar archivo')}
            </label>
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                id={fieldId}
                type="checkbox"
                name={field.name}
                checked={value}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                required={field.required}
                className="sr-only"
              />
              <label
                htmlFor={fieldId}
                className={`relative flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200 cursor-pointer ${
                  value
                    ? 'bg-green-400 border-green-600 shadow-lg shadow-green-500/30'
                    : 'bg-white/10 border-white/30 hover:border-white/50 hover:bg-white/15'
                }`}
              >
                {value && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </label>
            </div>
            <label htmlFor={fieldId} className="text-white/90 text-sm font-medium cursor-pointer select-none">
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    id={`${fieldId}-${option.value}`}
                    type="radio"
                    name={field.name}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`${fieldId}-${option.value}`}
                    className={`relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                      value === option.value
                        ? 'bg-green-400 border-green-600 shadow-lg shadow-green-500/30'
                        : 'bg-white/10 border-white/30 hover:border-white/50 hover:bg-white/15'
                    }`}
                  >
                    {value === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </label>
                </div>
                <label htmlFor={`${fieldId}-${option.value}`} className="text-white/90 text-sm font-medium cursor-pointer select-none">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'phone':
        return (
          <PhoneInput
            value={value || ''}
            onChange={(phoneValue) => handleInputChange(field.name, phoneValue)}
            placeholder={field.placeholder || ''}
            required={field.required || false}
            className={field.className || ''}
          />
        );

      case 'datetime-local':
        return (
          <input
            id={fieldId}
            type="datetime-local"
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
            className={fieldClasses}
          />
        );

      case 'requirements':
        const requirements = requirementsData[field.name] || [];
        const config = field.requirementsConfig || {};
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">
                {config.title || field.label} {field.required && <span className="text-red-400">*</span>}
              </h4>
              {config.subtitle && (
                <p className="text-white/60 text-sm mb-4">{config.subtitle}</p>
              )}
            </div>

            {/* Lista de requisitos */}
            <div className={`space-y-2 mb-4 ${config.maxHeight || 'max-h-40'} overflow-y-auto`}>
              {requirements.map((requisito, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                  <span className="text-white flex-1">{requisito}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(field.name, index)}
                    className="ml-3 p-1 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Agregar nuevo requisito */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={newRequirements[field.name] || ''}
                onChange={(e) => setNewRequirements(prev => ({ ...prev, [field.name]: e.target.value }))}
                placeholder={config.placeholder || "Ej: Ganar 1 torneo (puedes separar por comas)"}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-200"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement(field.name)}
              />
              <button
                type="button"
                onClick={() => handleAddRequirement(field.name)}
                disabled={!newRequirements[field.name]?.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {requirements.length === 0 && (
              <p className="text-gray-400 text-sm mt-2">No hay requisitos agregados. Agrega al menos uno.</p>
            )}
          </div>
        );

      default:
        // Manejar campos con máscaras de formateo (como dinero)
        if (field.formatValue || field.prefix || field.suffix) {
          const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = e.target.value;
            let formattedValue = rawValue;
            
            // Aplicar formato si existe la función
            if (field.formatValue) {
              formattedValue = field.formatValue(rawValue);
            }
            
            // Aplicar prefijo y sufijo
            let displayValue = formattedValue;
            if (field.prefix) {
              displayValue = field.prefix + displayValue;
            }
            if (field.suffix) {
              displayValue = displayValue + field.suffix;
            }
            
            // Guardar el valor sin formato para el estado interno
            const valueToStore = field.parseValue ? field.parseValue(rawValue) : rawValue;
            handleInputChange(field.name, valueToStore);
          };
          
          // Preparar el valor para mostrar
          let displayValue = value !== null && value !== undefined ? String(value) : '';
          if (field.formatValue && (value !== null && value !== undefined)) {
            displayValue = field.formatValue(value);
          }
          if (field.prefix && displayValue) {
            displayValue = field.prefix + displayValue;
          }
          if (field.suffix && displayValue) {
            displayValue = displayValue + field.suffix;
          }
          
          return (
            <input
              id={fieldId}
              type="text"
              name={field.name}
              value={displayValue}
              onChange={handleCurrencyChange}
              placeholder={field.placeholder}
              required={field.required}
              minLength={field.minLength}
              maxLength={field.maxLength}
              className={fieldClasses}
            />
          );
        }
        
        // Campo de entrada estándar
        return (
          <input
            id={fieldId}
            type={field.type}
            name={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            step={field.step}
            pattern={field.validation?.pattern}
            minLength={field.minLength}
            maxLength={field.maxLength}
            className={fieldClasses}
          />
        );
    }
  }, [values, newRequirements, handleInputChange, handleAddRequirement, handleRemoveRequirement, requirementsData]);

  // Memoizar la lista de campos para evitar re-renders innecesarios
  const memoizedFields = useMemo(() => {
    return fields.map((field) => {
      const colSpan = field.colSpan || 1;
      const gridClass = colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1';
      const fieldValue = values[field.name] || '';
      
      return (
        <FieldWrapper
          key={field.name}
          field={field}
          gridClass={gridClass}
          fieldValue={fieldValue}
          renderField={renderField}
        />
      );
    });
  }, [fields, values, renderField]);

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        {(title || subtitle || Icon) && (
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              {Icon && (
                <div className={`p-2 rounded-xl ${iconColor.replace('text-', 'bg-')}/20`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
              )}
              {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
            </div>
            {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
          </div>
        )}

        {/* Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memoizedFields}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-white/10">
          {showCancelButton && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              {cancelText}
            </button>
          )}
          {renderSubmitButton ? (
            <div className="w-full">
              {renderSubmitButton({ submitText, loading })}
            </div>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Guardando...' : submitText}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DynamicForm; 