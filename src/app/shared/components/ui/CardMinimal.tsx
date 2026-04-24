import React, { memo, useCallback } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ChipConfig {
  label: string;
  className: string; // Clases CSS completas para el chip
}

export interface DetailItem {
  icon: LucideIcon;
  text: string;
  colSpan?: number; // Para grid, por defecto 1
}

export interface ActionButton {
  icon: LucideIcon;
  onClick: (e: React.MouseEvent) => void;
  className: string; // Clases CSS completas para el botón
  title: string;
}

export interface CardMinimalProps {
  // Imagen/Logo
  image?: string;
  imageAlt?: string;
  fallbackText?: {
    line1: string;
    line2: string;
  };

  // Contenido principal
  title: string;
  chips?: ChipConfig[];
  details: DetailItem[];

  // Badge informativo (opcional)
  infoBadge?: {
    text: string;
    className?: string; // Clases CSS, por defecto usa el estilo estándar
  };

  // Botones de acción
  actionButtons?: ActionButton[];

  // Eventos
  onClick?: () => void;

  // Clases personalizadas
  className?: string;
  imageContainerClassName?: string;
}

const CardMinimal: React.FC<CardMinimalProps> = memo(({
  image,
  imageAlt,
  fallbackText,
  title,
  chips = [],
  details,
  infoBadge,
  actionButtons = [],
  onClick,
  className = '',
  imageContainerClassName = ''
}) => {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const defaultInfoBadgeClassName = 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg px-4 py-2 border border-white/10';

  return (
    <div
      className={`bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-300 group cursor-pointer hover:border-white/20 relative w-full ${className}`}
      onClick={handleClick}
    >
      {/* Contenido de la card */}
      <div className="flex items-center p-6 space-x-6">
        {/* Logo/Imagen */}
        <div className="flex-shrink-0">
          <div className={`w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center ${imageContainerClassName}`}>
            {image ? (
              <img
                src={image}
                alt={imageAlt || title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&crop=center';
                }}
              />
            ) : (
              <div className="text-white/60 text-xs font-bold text-center px-1">
                {fallbackText ? (
                  <>
                    <div className="text-[8px] leading-tight">{fallbackText.line1}</div>
                    <div className="text-[10px] leading-tight font-bold">{fallbackText.line2}</div>
                  </>
                ) : (
                  <>
                    <div className="text-[8px] leading-tight">CARD</div>
                    <div className="text-[10px] leading-tight font-bold">ITEM</div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Información principal */}
        <div className="flex-1 min-w-0">
          {/* Chips */}
          {chips.length > 0 && (
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {chips.map((chip, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${chip.className}`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          )}

          {/* Título */}
          <h3 className="text-white font-semibold text-xl mb-3 truncate group-hover:text-purple-300 transition-colors">
            {title}
          </h3>

          {/* Detalles */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              const colSpan = detail.colSpan || 1;
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 text-white/70 text-sm ${colSpan === 2 ? 'col-span-2' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{detail.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Información adicional y botones */}
        {(infoBadge || actionButtons.length > 0) && (
          <div className="flex-shrink-0 text-right">
            {/* Badge informativo */}
            {infoBadge && (
              <div className="mb-4">
                <div className={infoBadge.className || defaultInfoBadgeClassName}>
                  <span className="text-white font-bold text-sm">
                    {infoBadge.text}
                  </span>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            {actionButtons.length > 0 && (
              <div className="flex gap-2 justify-end">
                {actionButtons.map((button, index) => {
                  const Icon = button.icon;
                  return (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        button.onClick(e);
                      }}
                      className={button.className}
                      title={button.title}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

CardMinimal.displayName = 'CardMinimal';

export default CardMinimal;

