import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const CustomColorPicker: React.FC<CustomColorPickerProps> = ({ 
  value, 
  onChange, 
  className = '' 
}) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'hue' | 'sl' | null>(null);
  
  // Estados para la posición visual del puntero (solo para mostrar, no para actualizar el color)
  const [cursorPosition, setCursorPosition] = useState({ x: 100, y: 50 });
  const [huePosition, setHuePosition] = useState(0);
  
  // Estado para el color que se muestra en el preview (solo se actualiza al hacer clic/arrastrar)
  const [previewColor, setPreviewColor] = useState(value || '#FF0000');
  
  const colorAreaRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  // Convertir hex a HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Convertir HSL a hex
  const hslToHex = (h: number, s: number, l: number) => {
    h = h % 360;
    if (h < 0) h += 360;
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));

    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(Math.max(0, Math.min(255, c * 255))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Inicializar HSL desde el valor inicial
  useEffect(() => {
    if (value && /^#[0-9A-Fa-f]{6}$/.test(value)) {
      const hsl = hexToHsl(value);
      
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      // Establecer posiciones iniciales del cursor
      // Para colores grises (saturación 0%), centrar horizontalmente
      const cursorX = hsl.s === 0 ? 50 : hsl.s;
      // Y se invierte porque el gradiente va de blanco arriba (0%) a negro abajo (100%)
      setCursorPosition({ x: cursorX, y: 100 - hsl.l });
      setHuePosition(hsl.h / 3.6); // Convertir a porcentaje
      // Establecer color de preview inicial
      setPreviewColor(value);
    }
  }, [value]); // Se ejecuta cuando cambia el valor

  // Actualizar color cuando cambien HSL (sin useEffect para evitar bucles)
  const updateColor = useCallback((newHue?: number, newSaturation?: number, newLightness?: number) => {
    const currentHue = newHue !== undefined ? newHue : hue;
    const currentSaturation = newSaturation !== undefined ? newSaturation : saturation;
    const currentLightness = newLightness !== undefined ? newLightness : lightness;
    
    const newColor = hslToHex(currentHue, currentSaturation, currentLightness);
    setPreviewColor(newColor); // Actualizar color de preview
    onChange(newColor);
  }, [hue, saturation, lightness, onChange]);

  // Manejar clic en el área de color
  const handleColorAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!colorAreaRef.current) return;
    
    const rect = colorAreaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    // X = saturación (0% = sin saturación, 100% = saturación máxima)
    // Y = luminosidad (0% = negro, 100% = blanco)
    const newSaturation = Math.round(x * 100);
    const newLightness = Math.round((1 - y) * 100); // Invertir Y porque el gradiente va de blanco arriba a negro abajo
    
    setSaturation(newSaturation);
    setLightness(newLightness);
    setCursorPosition({ x: newSaturation, y: y * 100 }); // Y para posición visual no se invierte
    updateColor(hue, newSaturation, newLightness);
    setIsDragging(true);
    setDragType('sl');
  };

  // Manejar clic en el slider de matiz
  const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hueSliderRef.current) return;
    
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    
    const newHue = Math.round(x * 360);
    setHue(newHue);
    setHuePosition(x * 100); // Actualizar posición visual
    updateColor(newHue, saturation, lightness);
    setIsDragging(true);
    setDragType('hue');
  };

  // Manejar movimiento del mouse
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragType) return;

    if (dragType === 'sl' && colorAreaRef.current) {
      const rect = colorAreaRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      
      const newSaturation = Math.round(x * 100);
      const newLightness = Math.round((1 - y) * 100); // Invertir Y
      
      setSaturation(newSaturation);
      setLightness(newLightness);
      setCursorPosition({ x: newSaturation, y: y * 100 }); // Y para posición visual no se invierte
      updateColor(hue, newSaturation, newLightness);
    } else if (dragType === 'hue' && hueSliderRef.current) {
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      
      const newHue = Math.round(x * 360);
      setHue(newHue);
      setHuePosition(x * 100);
      updateColor(newHue, saturation, lightness);
    }
  }, [isDragging, dragType, hue, saturation, lightness, updateColor]);

  // Manejar soltar el mouse
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const hueColor = `hsl(${hue}, 100%, 50%)`;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de selección de saturación y luminosidad */}
      <div className="relative">
        <div
          ref={colorAreaRef}
          className="w-full h-48 rounded-lg border-2 border-white/20 cursor-crosshair relative overflow-hidden"
          style={{
            background: `
              linear-gradient(to bottom, 
                hsl(${hue}, 100%, 100%) 0%, 
                hsl(${hue}, 100%, 50%) 50%, 
                hsl(${hue}, 100%, 0%) 100%
              ),
              linear-gradient(to right, 
                hsl(0, 0%, 100%) 0%, 
                hsl(${hue}, 100%, 50%) 100%
              )
            `
          }}
          onClick={handleColorAreaClick}
        >
          {/* Indicador de posición */}
          <div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-2 -translate-y-2 pointer-events-none"
            style={{
              left: `${cursorPosition.x}%`,
              top: `${cursorPosition.y}%`,
              backgroundColor: isDragging ? previewColor : 'transparent'
            }}
          />
        </div>
      </div>

      {/* Slider de matiz */}
      <div className="relative">
        <div
          ref={hueSliderRef}
          className="w-full h-6 rounded-lg border-2 border-white/20 cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
          }}
          onClick={handleHueClick}
        >
          {/* Indicador de matiz */}
          <div
            className="absolute top-0 w-4 h-full border-2 border-white rounded transform -translate-x-2 pointer-events-none shadow-lg"
            style={{
              left: `${huePosition}%`,
              backgroundColor: hueColor
            }}
          />
        </div>
      </div>

      {/* Preview del color */}
      <div className="flex items-center justify-center space-x-4">
        <div
          className="w-16 h-16 rounded-lg border-2 border-white/20 shadow-lg"
          style={{ backgroundColor: previewColor }}
        />
        <div className="text-center">
          <p className="text-white/80 text-sm">Color seleccionado:</p>
          <p className="text-white font-mono text-lg">{previewColor}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomColorPicker;
