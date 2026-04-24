import React, { useState, useMemo, useCallback } from 'react';
import { Search, Check, ChevronDown } from 'lucide-react';
import { Category } from '../../interface/IFieldConfig';

// Re-exportar la interfaz Category para compatibilidad
export type { Category };

interface CategoryPickerProps {
  categories: Category[];
  selectedCategoryId?: number;
  onCategorySelect: (category: Category | null) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'form';
  showAllOption?: boolean;
  allOptionText?: string;
}

const CategoryPicker: React.FC<CategoryPickerProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  placeholder = "Seleccionar categoría...",
  loading = false,
  className = "",
  variant = 'default',
  showAllOption = false,
  allOptionText = "Todas las categorías"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar categorías basado en el término de búsqueda (memoizado)
  const filteredCategories = useMemo(() => 
    categories.filter(category =>
      category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    ), [categories, searchTerm]
  );

  // Encontrar la categoría seleccionada
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  // Función para convertir hex a RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 139, g: 69, b: 19 }; // Fallback color
  };

  const handleCategoryClick = useCallback((category: Category | null) => {
    onCategorySelect(category);
    setIsOpen(false);
    setSearchTerm('');
  }, [onCategorySelect]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };


  // Estilos basados en la variante
  const isCompact = variant === 'compact';
  const isForm = variant === 'form';
  const buttonClasses = isForm
    ? "w-full px-4 py-4 bg-white/8 border-2 border-white/15 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-green-500/60 focus:bg-white/12 transition-all duration-300 font-medium backdrop-blur-sm text-left"
    : isCompact 
    ? "w-full px-3 py-2 bg-slate-700/80 border border-orange-500/30 rounded-lg text-left focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    : "w-full px-4 py-3 bg-slate-700/80 border border-orange-500/30 rounded-lg text-left focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const iconSize = isForm ? "w-5 h-5" : isCompact ? "w-4 h-4" : "w-6 h-6";
  const textSize = isForm ? "" : isCompact ? "text-sm" : "";
  const dropdownMaxHeight = isForm ? "max-h-80" : isCompact ? "max-h-64" : "max-h-80";
  const searchInputClasses = isForm
    ? "w-full pl-7 pr-3 py-1.5 bg-slate-600/80 border border-white/30 rounded text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors text-sm"
    : isCompact
    ? "w-full pl-7 pr-3 py-1.5 bg-slate-600/80 border border-white/30 rounded text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors text-sm"
    : "w-full pl-10 pr-4 py-2 bg-slate-600/80 border border-white/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors";

  return (
    <div className={`relative ${className}`}>
      {/* Botón trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={buttonClasses}
      >
        {loading ? (
          <div className={`flex items-center ${isCompact ? 'space-x-2' : 'space-x-3'}`}>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            <span className={`text-white/70 ${textSize}`}>Cargando categorías...</span>
          </div>
        ) : selectedCategory ? (
          <div className={`flex items-center ${isForm ? 'space-x-3' : isCompact ? 'space-x-2' : 'space-x-3'}`}>
            <div 
              className={`${iconSize} rounded-full border-2 border-white/30 flex-shrink-0`}
              style={{ backgroundColor: selectedCategory.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <div className={`text-white font-medium truncate ${textSize}`}>
                {selectedCategory.nombre}
              </div>
              {!isCompact && !isForm && (
                <div className="text-white/60 text-sm truncate">
                  {selectedCategory.descripcion}
                </div>
              )}
            </div>
            <div className="text-white/40">
              <ChevronDown className={iconSize} />
            </div>
          </div>
        ) : (
          <div className={`flex items-center ${isForm ? 'space-x-3' : isCompact ? 'space-x-2' : 'space-x-3'}`}>
            <div className={`${iconSize} rounded-full bg-white/10 border-2 border-white/20 flex-shrink-0`}></div>
            <span className={`text-white/60 ${textSize}`}>{placeholder}</span>
            <div className="text-white/40 ml-auto">
              <ChevronDown className={iconSize} />
            </div>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute z-[99999999] w-full mt-1 bg-slate-800/95 backdrop-blur-lg border border-orange-500/50 rounded-lg shadow-xl ${dropdownMaxHeight} overflow-hidden`}>
          {/* Barra de búsqueda */}
          <div className={`${isCompact ? 'p-2' : 'p-3'} border-b border-white/10`}>
            <div className="relative">
              <Search className={`absolute ${isCompact ? 'left-2' : 'left-3'} top-1/2 transform -translate-y-1/2 text-white/40 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
              <input
                type="text"
                placeholder={isCompact ? "Buscar..." : "Buscar categoría..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={searchInputClasses}
              />
            </div>
          </div>

          {/* Lista de categorías */}
          <div className={`${isCompact ? 'max-h-48' : 'max-h-64'} overflow-y-auto`}>
            {/* Opción "Todas las categorías" */}
            {showAllOption && (
              <button
                type="button"
                onClick={() => handleCategoryClick(null)}
                className={`w-full ${isCompact ? 'p-2' : 'p-3'} text-left hover:bg-orange-500/20 transition-colors border-b border-white/10`}
              >
                <div className={`flex items-center ${isCompact ? 'space-x-2' : 'space-x-3'}`}>
                  <div className={`${isCompact ? 'w-4 h-4' : 'w-8 h-8'} rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 border border-white/30 flex-shrink-0 flex items-center justify-center`}>
                    {!selectedCategoryId && (
                      <Check className={`${isCompact ? 'w-2.5 h-2.5' : 'w-4 h-4'} text-white`} />
                    )}
                  </div>
                  <span className={`text-white font-medium ${textSize}`}>{allOptionText}</span>
                  {!selectedCategoryId && (
                    <Check className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'} text-orange-500 flex-shrink-0 ml-auto`} />
                  )}
                </div>
              </button>
            )}

            {filteredCategories.length === 0 ? (
              <div className={`${isCompact ? 'p-3' : 'p-4'} text-center text-white/60 ${textSize}`}>
                {searchTerm ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
              </div>
            ) : (
              filteredCategories.map((category) => {
                const rgb = hexToRgb(category.color);
                const isSelected = category.id === selectedCategoryId;
                
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className={`w-full ${isCompact ? 'p-2' : 'p-3'} text-left hover:bg-orange-500/20 transition-colors border-b border-white/10 last:border-b-0`}
                  >
                    <div className={`flex items-center ${isCompact ? 'space-x-2' : 'space-x-3'}`}>
                      {/* Color de la categoría */}
                      <div 
                        className={`${isCompact ? 'w-4 h-4' : 'w-8 h-8'} rounded-lg border-2 border-white/30 flex-shrink-0 flex items-center justify-center`}
                        style={{ 
                          backgroundColor: category.color,
                          background: `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6))`
                        }}
                      >
                        {isSelected && (
                          <Check className={`${isCompact ? 'w-2.5 h-2.5' : 'w-4 h-4'} text-white`} />
                        )}
                      </div>
                      
                      {/* Información de la categoría */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-white font-medium truncate ${textSize}`}>
                            {category.nombre}
                          </h4>
                          {isSelected && (
                            <Check className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'} text-orange-500 flex-shrink-0`} />
                          )}
                        </div>
                        {!isCompact && (
                          <p className="text-white/70 text-sm truncate">
                            {category.descripcion}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
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

export default CategoryPicker;
