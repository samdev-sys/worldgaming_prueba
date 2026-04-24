import React from 'react';
import { X, LucideIcon } from 'lucide-react';

export interface DynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  showBackdrop?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
  footer?: React.ReactNode;
}

const DynamicModal: React.FC<DynamicModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  children,
  size = 'md',
  showCloseButton = true,
  showBackdrop = true,
  closeOnBackdropClick = true,
  className = '',
  footer
}) => {
  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-2xl';
      case 'lg': return 'max-w-4xl';
      case 'xl': return 'max-w-6xl';
      case 'full': return 'max-w-full mx-4';
      default: return 'max-w-2xl';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        showBackdrop ? 'bg-black/50 backdrop-blur-sm' : ''
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 w-full ${getSizeClasses()} max-h-[80vh] overflow-hidden ${className}`}>
        {/* Header */}
        {(title || subtitle || Icon) && (
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className={`p-2 rounded-xl ${iconColor.replace('text-', 'bg-')}/20`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
              )}
              <div>
                {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
                {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
              </div>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-white/60 hover:text-white" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-white/10 bg-white/5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicModal;
