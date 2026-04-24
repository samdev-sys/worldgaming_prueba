import React from 'react';
import { IoGameController } from 'react-icons/io5';

export interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  description?: string;
  showDetails?: boolean;
  details?: {
    title: string;
    items: Array<{
      label: string;
      value: string;
    }>;
  };
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = 'Cargando...',
  subtitle = 'Procesando información...',
  description,
  showDetails = false,
  details,
  variant = 'default',
  className = ''
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className="w-12 h-12 mx-auto flex items-center justify-center">
            {/* @ts-ignore - react-icons type compatibility */}
            <IoGameController className="w-12 h-12 text-white/80 animate-pulse" />
          </div>
        );
      default:
        return (
          <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
            {/* @ts-ignore - react-icons type compatibility */}
            <IoGameController className="w-20 h-20 text-white/90 animate-bounce" />
            
            {/* Efectos de carga sutiles */}
            <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-60"></div>
            <div className="absolute top-2 right-2 w-1 h-1 bg-red-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '1.5s' }}></div>
          </div>
        );
    }
  };

  const renderDetails = () => {
    if (!showDetails || !details) return null;

    return (
      <div className="bg-white/5 backdrop-blur-lg p-4 rounded-xl border border-white/10 w-full">
        <h3 className="text-white font-semibold mb-2 text-sm">{details.title}</h3>
        <div className="space-y-1 text-xs text-white/70">
          {details.items.map((item, index) => (
            <p key={index}>
              <span className="font-medium">{item.label}:</span> {item.value}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center space-y-4 max-w-xl w-full px-4">
        
        {/* Texto de carga */}
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-white/70 text-base">{subtitle}</p>
            {description && (
              <p className="text-white/60 text-xs max-w-md mx-auto">{description}</p>
            )}
          </div>
          
          {/* Spinner centralizado */}
          <div className="flex justify-center">
            {renderSpinner()}
          </div>
        </div>
        
        {/* Detalles opcionales */}
        {renderDetails()}
      </div>
    </div>
  );
};

export default LoadingScreen;
