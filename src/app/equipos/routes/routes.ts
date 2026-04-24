import { ShieldHalf, User, MessageSquare } from 'lucide-react';
import { NavigationItem } from '../../shared/interface/navigation';

export const equiposRoutes: NavigationItem = {
  name: 'Equipos',
  href: '/worldGaming/equipos',
  icon: ShieldHalf,
  children: [
    { name: 'Gestionar Equipos', href: '/worldGaming/equipos', icon: ShieldHalf },
    { name: 'Mi Equipo', href: '/worldGaming/equipos/mi-equipo', icon: User },
    { name: 'Solicitudes de Equipo', href: '/worldGaming/equipos/solicitudes', icon: MessageSquare },
  ]
};