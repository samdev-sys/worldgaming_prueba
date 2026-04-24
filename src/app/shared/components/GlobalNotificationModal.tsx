import React from 'react';
import { X } from 'lucide-react';
import { useNotificationModal } from '../contexts/NotificationModalContext';
import NotificationCenter from './NotificationCenter';

const GlobalNotificationModal: React.FC = () => {
  const { isNotificationModalOpen, closeNotificationModal } = useNotificationModal();

  if (!isNotificationModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900/95 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Centro de Notificaciones</h2>
            <p className="text-white/80 text-sm sm:text-base lg:text-lg">Mantente al día con las últimas novedades de World Gaming</p>
          </div>
          <button
            onClick={closeNotificationModal}
            className="p-2 sm:p-3 hover:bg-white/10 rounded-lg sm:rounded-xl transition-colors duration-200"
          >
            <X className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </button>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 overflow-auto max-h-[calc(95vh-120px)] sm:max-h-[calc(95vh-140px)]">
          <NotificationCenter 
            isOpen={isNotificationModalOpen}
            onClose={closeNotificationModal}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalNotificationModal;
