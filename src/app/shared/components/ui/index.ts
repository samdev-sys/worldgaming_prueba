/**
 * Exportaciones centralizadas de componentes UI
 * Facilita la importación de componentes reutilizables
 */

// Componentes de gestión
export { default as ManagementPageLayout } from './ManagementPageLayout';

// Componentes dinámicos
export { default as DynamicCardList } from './DynamicCardList';
export { default as DynamicForm } from './DynamicForm';
export { default as DynamicModal } from './DynamicModal';

// Componentes de selección
export { default as CategoryPicker } from './CategoryPicker';
export { default as CustomSelect } from './CustomSelect';
export { default as CountrySelector } from './CountrySelector';
export { default as ReactColorPicker } from './ReactColorPicker';

// Componentes de UI básicos
export { Card, CardHeader, CardTitle, CardContent } from './Card';
export { default as CardMinimal } from './CardMinimal';
export type { CardMinimalProps, ChipConfig, DetailItem, ActionButton } from './CardMinimal';

// Componentes especializados
export { default as LoadingScreen } from './LoadingScreen';
export { default as PhoneInput } from './PhoneInput';
export { default as PasswordRules } from './PasswordRules';
