import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationModalContextType {
  isNotificationModalOpen: boolean;
  openNotificationModal: () => void;
  closeNotificationModal: () => void;
}

const NotificationModalContext = createContext<NotificationModalContextType | undefined>(undefined);

export const useNotificationModal = () => {
  const context = useContext(NotificationModalContext);
  if (!context) {
    throw new Error('useNotificationModal must be used within a NotificationModalProvider');
  }
  return context;
};

export const NotificationModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const openNotificationModal = () => {
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  return (
    <NotificationModalContext.Provider value={{
      isNotificationModalOpen,
      openNotificationModal,
      closeNotificationModal
    }}>
      {children}
    </NotificationModalContext.Provider>
  );
};
