// Color Palette Context
export { ColorPaletteProvider, useColorPalette } from './ColorPaletteContext';
export type { ColorPalette } from './ColorPaletteContext';

// Game Context
export { GameProvider, useGame } from './GameContext';

// Notification Context
export { NotificationProvider, useNotification } from './NotificationContext';
export type { NotificationType, Notification } from './NotificationContext';

// Confirmation Context
export { ConfirmationProvider, useConfirmation } from './ConfirmationContext';

// Notification Center Context
export { NotificationCenterProvider, useNotificationCenter } from './NotificationCenterContext';

// Notification Modal Context
export { NotificationModalProvider, useNotificationModal } from './NotificationModalContext';

// Re-export all contexts for convenience
export * from './ColorPaletteContext';
export * from './GameContext';
export * from './NotificationContext';
export * from './ConfirmationContext';
export * from './NotificationCenterContext';
export * from './NotificationModalContext';
