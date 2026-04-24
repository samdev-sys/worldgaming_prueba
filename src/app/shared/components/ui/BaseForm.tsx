import React, { useState, useCallback, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { FormField } from '../../types';

interface BaseFormProps {
  title?: string;
  subtitle?: string;
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  showCancelButton?: boolean;
  renderSubmitButton?: (props: { submitText: string; loading: boolean }) => React.ReactNode;
}

/**
 * Componente base para formularios
 * Proporciona funcionalidad común para todos los formularios
 */
const BaseForm: React.FC<BaseFormProps> = ({
  title,
  subtitle,
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false,
  icon: Icon,
  iconColor = 'text-blue-400',
  className = '',
  showCancelButton = true,
  renderSubmitButton
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar valores cuando cambien los initialValues
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // Validar campo individual
  const validateField = useCallback((field: FormField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} es requerido`;
    }

    if (field.minLength && value && value.length < field.minLength) {
      return `${field.label} debe tener al menos ${field.minLength} caracteres`;
    }

    if (field.maxLength && value && value.length > field.maxLength) {
      return `${field.label} no puede tener más de ${field.maxLength} caracteres`;
    }

    if (field.min && value && Number(value) < field.min) {
      return `${field.label} debe ser mayor o igual a ${field.min}`;
    }

    if (field.max && value && Number(value) > field.max) {
      return `${field.label} debe ser menor o igual a ${field.max}`;
    }

    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || `${field.label} tiene un formato inválido`;
      }
    }

    return '';
  }, []);

  // Validar todos los campos
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [fields, values, validateField]);

  // Manejar cambio de input
  const handleInputChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Error al enviar formulario:', error);
      }
    }
  }, [values, validateForm, onSubmit]);

  // Renderizar botón de envío personalizado o por defecto
  const renderSubmitButtonContent = () => {
    if (renderSubmitButton) {
      return renderSubmitButton({ submitText, loading });
    }

    return (
      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
          loading ? 'animate-pulse' : ''
        }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Guardando...</span>
          </>
        ) : (
          <span>{submitText}</span>
        )}
      </button>
    );
  };

  return (
    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl ${className}`}>
      {/* Header */}
      {(title || subtitle || Icon) && (
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            {Icon && (
              <div className={`p-3 bg-white/10 rounded-xl`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
            )}
            <div>
              {title && <h2 className="text-2xl font-bold text-white">{title}</h2>}
              {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {fields.map(field => (
            <div key={field.name} className={`${field.colSpan === 2 ? 'col-span-2' : ''}`}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>

              {/* Renderizar campo según tipo */}
              {renderField(field, values[field.name], handleInputChange, errors[field.name])}

              {/* Mostrar error */}
              {errors[field.name] && (
                <p className="text-red-400 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
          {showCancelButton && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-gray-700"
            >
              {cancelText}
            </button>
          )}
          {renderSubmitButtonContent()}
        </div>
      </form>
    </div>
  );
};

/**
 * Renderizar campo individual según su tipo
 */
const renderField = (
  field: FormField,
  value: any,
  onChange: (name: string, value: any) => void,
  error?: string
) => {
  const baseClassName = `w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
    error ? 'border-red-500' : ''
  }`;

  switch (field.type) {
    case 'text':
    case 'email':
    case 'password':
      return (
        <input
          type={field.type}
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          minLength={field.minLength}
          maxLength={field.maxLength}
          className={baseClassName}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(field.name, Number(e.target.value))}
          placeholder={field.placeholder}
          required={field.required}
          min={field.min}
          max={field.max}
          step={field.step}
          className={baseClassName}
        />
      );

    case 'textarea':
      return (
        <textarea
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          minLength={field.minLength}
          maxLength={field.maxLength}
          rows={4}
          className={baseClassName}
        />
      );

    case 'select':
      return (
        <select
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
          className={baseClassName}
        >
          <option value="">{field.placeholder || 'Seleccionar...'}</option>
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'checkbox':
      return (
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name={field.name}
            checked={value || false}
            onChange={(e) => onChange(field.name, e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-white/10 border-gray-600 rounded focus:ring-blue-500"
          />
          <span className="text-gray-300">{field.label}</span>
        </div>
      );

    case 'file':
      return (
        <input
          type="file"
          name={field.name}
          onChange={(e) => onChange(field.name, e.target.files?.[0])}
          className={baseClassName}
          accept="image/*"
        />
      );

    default:
      return (
        <input
          type="text"
          name={field.name}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={baseClassName}
        />
      );
  }
};

export default BaseForm;
