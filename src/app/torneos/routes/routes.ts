import { Gamepad2, Trophy, Award } from 'lucide-react';
import { NavigationItem } from '../../shared/interface/navigation';

export const torneosNavigation: NavigationItem = {
  name: 'Torneos',
  href: '/worldGaming/torneos',
  icon: Trophy,
  children: [
    {
      name: 'Todos los Torneos',
      href: '/worldGaming/torneos',
      icon: Gamepad2
    },
    {
      name: 'Administrar Resultados',
      href: '/worldGaming/torneos/resultados',
      icon: Award
    },
  ]
};