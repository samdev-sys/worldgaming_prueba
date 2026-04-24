import React, { useState, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'form';
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  className = "",
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Estilos basados en la variante
  const isFormVariant = variant === 'form';
  const buttonClasses = isFormVariant 
    ? "w-full px-4 py-4 bg-white/8 border-2 border-white/15 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-green-500/60 focus:bg-white/12 transition-all duration-300 font-medium backdrop-blur-sm text-left"
    : "w-full px-3 py-2 bg-slate-700/80 border border-orange-500/30 rounded-lg text-left focus:outline-none focus:border-orange-500 transition-colors text-sm min-w-[180px]";


  return (
    <div className={`relative ${className}`}>
      {/* Botón trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={buttonClasses}
        style={{ 
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none'
        }}
      >
        <div className="flex items-center justify-between w-full">
          <span className={`${isFormVariant ? 'text-white' : 'text-white/60'} ${isFormVariant ? 'text-base' : 'text-sm'} flex-1`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`${isFormVariant ? 'w-5 h-5' : 'w-4 h-4'} text-white/40 flex-shrink-0`} />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-[99999999] w-full mt-1 bg-slate-800/95 backdrop-blur-lg border border-orange-500/50 rounded-lg shadow-xl max-h-48 overflow-hidden">
          {/* Lista de opciones */}
          <div className="max-h-48 overflow-y-auto">
            {/* Opción vacía */}
            <button
              type="button"
              onClick={() => handleOptionClick('')}
              className="w-full px-3 py-2 text-left hover:bg-slate-600/80 transition-colors flex items-center space-x-2"
            >
              <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0 flex items-center justify-center">
                {!value && <Check className="w-3 h-3 text-orange-500" />}
              </div>
              <span className="text-white/60 text-sm">Seleccionar...</span>
            </button>

            {/* Opciones */}
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className="w-full px-3 py-2 text-left hover:bg-slate-600/80 transition-colors flex items-center space-x-2"
              >
                <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0 flex items-center justify-center">
                  {value === option.value && <Check className="w-3 h-3 text-orange-500" />}
                </div>
                <span className="text-white text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay para cerrar al hacer clic fuera */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomSelect;
