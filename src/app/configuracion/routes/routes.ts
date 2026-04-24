import { Cog } from 'lucide-react';
import { NavigationItem } from '../../shared/interface/navigation';

export const configuracionRoutes: NavigationItem = {
  name: 'Configuración',
  href: '/worldGaming/configuracion',
  icon: Cog,
  children: [
    { name: 'Pantalla Inicial', href: '/worldGaming/configuracion' },
    { name: 'Perfil', href: '/worldGaming/configuracion/perfil' }
  ]
};