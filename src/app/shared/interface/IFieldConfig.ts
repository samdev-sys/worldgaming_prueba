import { LucideIcon } from "lucide-react";

// Interfaz para categorías (usada en CategoryPicker)
export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  icon?: string;
  color?: string;
}

export interface IFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'file' | 'checkbox' | 'radio' | 'requirements' | 'phone' | 'category' | 'datetime-local' | 'currency'; 
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    step?: number;
    options?: { value: string; label: string }[];
    validation?: {
      pattern?: string;
      message?: string;
    };
    icon?: LucideIcon;
    className?: string;
    colSpan?: number;
    requirementsConfig?: {
      title?: string;
      subtitle?: string;
      placeholder?: string;
      maxHeight?: string;
    };
    categoryConfig?: {
      categories?: Category[];
      loading?: boolean;
      variant?: 'default' | 'compact';
    };
    showPasswordRules?: boolean;
    formatValue?: (value: string | number | undefined) => string;
    parseValue?: (value: string | number | undefined) => string;
    prefix?: string;
    suffix?: string;
}