import { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: NavigationChild[];
}

export interface NavigationChild {
  name: string;
  href: string;
  icon?: LucideIcon;
} 