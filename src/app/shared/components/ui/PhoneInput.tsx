import React, { useState, useEffect } from 'react';
import CountrySelector from './CountrySelector';

interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "Número de teléfono",
  className = "",
  required = false
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: 'Estados Unidos',
    code: 'US',
    flag: '🇺🇸',
    dialCode: '+1'
  });

  const [phoneNumber, setPhoneNumber] = useState('');

  // Separar el código de país del número
  useEffect(() => {
    if (value) {
      // Buscar si el valor ya incluye un código de país
      const hasCountryCode = value.startsWith('+');
      if (hasCountryCode) {
        // Extraer el código de país y el número
        const parts = value.split(' ');
        if (parts.length > 1) {
          const number = parts.slice(1).join(' ');
          setPhoneNumber(number);
          // Aquí podrías actualizar el país seleccionado basado en el código
        } else {
          // Si solo hay código de país sin número, limpiar el input
          setPhoneNumber('');
        }
      } else {
        setPhoneNumber(value);
      }
    } else {
      setPhoneNumber('');
    }
  }, [value]);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    // Actualizar el valor completo con el nuevo código de país
    const fullNumber = phoneNumber ? `${country.dialCode} ${phoneNumber}` : '';
    onChange(fullNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    setPhoneNumber(number);
    // Actualizar el valor completo
    const fullNumber = number ? `${selectedCountry.dialCode} ${number}` : '';
    onChange(fullNumber);
  };

  return (
    <div className={`w-full flex ${className}`}>
      {/* Selector de país */}
      <CountrySelector
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        className="flex-shrink-0"
      />
      
      {/* Input de número de teléfono */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        required={required}
        className="flex-1 px-4 py-3 bg-white/8 border-2 border-l-0 border-white/15 rounded-r-xl text-white placeholder-white/60 focus:outline-none focus:border-green-500/60 focus:bg-white/12 transition-all duration-300 font-medium backdrop-blur-sm min-w-0"
      />
    </div>
  );
};

export default PhoneInput;
