import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Loader2 } from 'lucide-react';
import { useCountries } from '../../hooks/useCountries';

interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

interface CountrySelectorProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  className?: string;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { countries, loading, error } = useCountries();

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center px-3 py-3 bg-white/8 border-2 border-white/15 rounded-l-xl min-w-[120px] ${className}`}>
        <Loader2 size={16} className="animate-spin text-white" />
      </div>
    );
  }

  if (error && countries.length === 0) {
    return (
      <div className={`flex items-center justify-center px-3 py-3 bg-white/8 border-2 border-white/15 rounded-l-xl min-w-[120px] ${className}`}>
        <span className="text-white text-xs">Error</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Botón selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-3 bg-white/8 border-2 border-white/15 rounded-l-xl text-white hover:bg-white/12 focus:outline-none focus:border-green-500/60 transition-all duration-300 font-medium backdrop-blur-sm min-w-[120px]"
      >
        <span className="text-lg">{selectedCountry.flag}</span>
        <span className="text-sm font-semibold">{selectedCountry.dialCode}</span>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 max-h-80 overflow-hidden">
          {/* Barra de búsqueda */}
          <div className="p-3 border-b border-white/20">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Buscar país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Lista de países */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-green-500/20 transition-colors duration-200 ${
                    selectedCountry.code === country.code ? 'bg-green-500/30' : ''
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {country.name}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-white/80">
                    {country.dialCode}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-white/60 text-sm">
                No se encontraron países
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
