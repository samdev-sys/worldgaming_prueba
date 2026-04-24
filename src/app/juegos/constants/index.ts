// Constantes compartidas para el módulo de juegos

export const GAME_ICONS = [
  '🎮', '⚔️', '🏆', '🎯', '🔥', '⚡', '💎', '🌟', '🎪', '🎲',
  '🏁', '🥊', '🏈', '⚽', '🏀', '🎾', '🏓', '🎨', '🎭', '🔫'
] as const;

export const COLOR_PURPOSES = {
  primary: 'Color principal de fondo y elementos base',
  secondary: 'Color secundario para gradientes y contraste',
  tertiary: 'Color de acento para indicadores y detalles',
  accent: 'Color para botones y elementos interactivos',
  light: 'Color para texto y elementos sobre fondos oscuros'
} as const;

export const COLOR_ICONS = {
  primary: '🎨',
  secondary: '🌈',
  tertiary: '✨',
  accent: '🔘',
  light: '💡'
} as const;

export const PRESET_COLORS = [
  // Colores oscuros suaves
  '#1A1A2E', '#16213E', '#0F3460', '#2C3E50', '#34495E',
  '#2C2C54', '#40407A', '#706FD3', '#F8B500', '#F8F9FA',
  
  // Azules suaves
  '#5D6D7E', '#566573', '#4A6741', '#2E86AB', '#A23B72',
  '#F18F01', '#C73E1D', '#2C3E50', '#34495E', '#7F8C8D',
  
  // Verdes suaves
  '#27AE60', '#2ECC71', '#16A085', '#1ABC9C', '#58D68D',
  '#7DCEA0', '#82E0AA', '#A9DFBF', '#D5F4E6', '#E8F8F5',
  
  // Morados suaves
  '#8E44AD', '#9B59B6', '#AF7AC5', '#BB8FCE', '#D2B4DE',
  '#E8DAEF', '#F4ECF7', '#F8F9FA', '#ECF0F1', '#BDC3C7',
  
  // Naranjas y rojos suaves
  '#E67E22', '#F39C12', '#F4D03F', '#F7DC6F', '#FCF3CF',
  '#E74C3C', '#EC7063', '#F1948A', '#FADBD8', '#FDF2F2',
  
  // Grises y neutros
  '#95A5A6', '#BDC3C7', '#D5DBDB', '#EBEDEF', '#F8F9FA',
  '#FFFFFF', '#F4F6F7', '#EAEDED', '#D6DBDF', '#AEB6BF'
] as const;
