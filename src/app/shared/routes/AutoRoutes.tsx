import React from 'react';
import { Route } from 'react-router-dom';
import { IRouteProps } from '../interface/IRouteProps';
import { IModuleInfo } from '../interface/IModuleInfo';

// Función principal para aplanar rutas
const flattenRoutes = (routeElement: React.ReactElement): React.ReactElement[] => {
  if (routeElement.type !== Route) return [];

  const props = routeElement.props as IRouteProps;

  // Si tiene hijos, devolver solo la ruta padre (las rutas anidadas se manejan automáticamente)
  if (props.children) {
    return [routeElement];
  }

  // Rutas simples
  return [routeElement];
};

// Importar módulos de rutas
const modules = import.meta.glob('../../**/routes/routes.tsx', { eager: true });

// Procesar y extraer todas las rutas
const routeElements = Object.entries(modules)
  .map(([path, mod]): IModuleInfo | null => {
    const element = (mod as { default: React.ReactElement }).default;
    return React.isValidElement(element) && element.type === Route 
      ? { path, element } 
      : null;
  })
  .filter((module): module is IModuleInfo => module !== null)
  .flatMap(({ element }) => flattenRoutes(element))
  .filter((route): route is React.ReactElement => 
    React.isValidElement(route) && route.type === Route
  );

export { routeElements };

// Componente para renderizar rutas (mantenido por compatibilidad)
export const AutoRoutes = () => {
  return routeElements.map((route, index) =>
    React.cloneElement(route, { key: route.key || `route-${index}` })
  );
};
