import { User } from 'lucide-react';
import { NavigationItem } from '../../shared/interface/navigation';

export const usuariosRoutes: NavigationItem = {
  name: 'Usuarios',
  href: '/worldGaming/usuarios',
  icon: User,
  children: [
    { name: 'Pantalla Inicial', href: '/worldGaming/usuarios' },
    { name: 'Perfiles', href: '/worldGaming/usuarios/perfiles' }
  ]
};
