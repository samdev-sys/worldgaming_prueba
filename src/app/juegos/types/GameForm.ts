// Tipos específicos para el formulario de juegos

export interface GameForm {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoriaId?: string;
  icon?: string;
  logo?: string | File;
  isActive: boolean;
  palette: {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    accentColor: string;
    lightColor: string;
  };
}

export interface GameFormData {
  id?: number;
  nombre: string;
  descripcion?: string;
  categoriaId?: string;
  icon?: string;
  logo?: string | File;
  isActive: boolean;
  palette: {
    primaryColor: string;
    secondaryColor: string;
    tertiaryColor: string;
    accentColor: string;
    lightColor: string;
  };
}
