import { Gamepad2 } from 'lucide-react';
import { NavigationItem } from '../../shared/interface/navigation';

export const juegosRoutes: NavigationItem = {
  name: 'Juegos',
  href: '/worldGaming/juegos',
  icon: Gamepad2,
  children: [
    { name: 'Juegos', href: '/worldGaming/juegos' },
    { name: 'Categorías', href: '/worldGaming/juegos/categorias' }
  ]
};