import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ChevronDown, X } from 'lucide-react';
import { useAutoNavigation } from '../../routes/AutoNavigation';
import { useAuth } from '../../../auth/AuthContext';

interface UnifiedSidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // Props para modo estático (landing page)
  scrollToSection?: (sectionId: string) => void;
  onOpenLoginModal?: () => void;
  onOpenRegisterModal?: () => void;
  // Props para modo dinámico (área protegida)
  isDynamic?: boolean;
}


const UnifiedSidebar: React.FC<UnifiedSidebarProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  scrollToSection,
  onOpenLoginModal,
  onOpenRegisterModal,
  isDynamic = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  
  // Siempre llamar el hook, pero usar el resultado condicionalmente
  const autoNavigationItems = useAutoNavigation();
  const navigationItems = isDynamic ? autoNavigationItems : [];
  
  // Estado para controlar qué submenús están abiertos
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  const isActive = (path: string) => {
    if (path.includes('/inventario') || path.includes('/usuarios')) {
      return location.pathname === path;
    }
    return location.pathname === path;
  };

  const handleRouteClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleSubmenu = (itemHref: string) => {
    setOpenSubmenus(prev => {
      const newSet = new Set<string>();
      if (prev.has(itemHref)) {
        return newSet;
      } else {
        newSet.add(itemHref);
        return newSet;
      }
    });
  };

  const hasActiveChild = (item: any) => {
    return item.children?.some((child: any) => isActive(child.href));
  };


  // Navegación estática para landing page
  const staticNavigationItems = [
    { name: 'Inicio', action: () => { scrollToSection?.('inicio'); setIsMenuOpen(false); } },
    { name: 'Video Torneos', action: () => { scrollToSection?.('video'); setIsMenuOpen(false); } },
    { name: 'Estadísticas', action: () => { scrollToSection?.('stats'); setIsMenuOpen(false); } },
    { name: 'Torneos Destacado', action: () => { scrollToSection?.('torneoDestacado'); setIsMenuOpen(false); } },
    { name: 'Torneos', action: () => { scrollToSection?.('torneos'); setIsMenuOpen(false); } },
    { name: 'Comunidad', action: () => { scrollToSection?.('comunidad'); setIsMenuOpen(false); } },
    { name: 'Contacto', action: () => { scrollToSection?.('contacto'); setIsMenuOpen(false); } }
  ];

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-gray-900/98 to-black/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header del Sidebar */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <h2 className="text-3xl font-bold text-white tracking-wider">NAVEGACIÓN</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white/80 hover:text-white"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navegación */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="space-y-1">
              {isDynamic ? (
                // Navegación dinámica para área protegida
                navigationItems.map((item) => (
                  <div key={item.href} className="relative group">
                    <button
                      onClick={() => {
                        if (item.children && item.children.length > 0) {
                          toggleSubmenu(item.href);
                        } else {
                          handleRouteClick(item.href);
                        }
                      }}
                      className={`w-full text-left p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02] flex items-center justify-between ${
                        isActive(item.href) || hasActiveChild(item)
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <item.icon className="w-6 h-6" />
                        <span>{item.name.toUpperCase()}</span>
                      </div>
                      {item.children && item.children.length > 0 && (
                        <ChevronDown 
                          className={`w-5 h-5 transition-transform duration-300 ${
                            openSubmenus.has(item.href) ? 'rotate-180' : ''
                          }`} 
                        />
                      )}
                    </button>
                    
                    {/* Submenú desplegable */}
                    {item.children && item.children.length > 0 && (
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openSubmenus.has(item.href) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="ml-6 mt-2 space-y-1">
                          {item.children.map((childItem) => (
                            <button
                              key={childItem.href}
                              onClick={() => handleRouteClick(childItem.href)}
                              className={`w-full text-left p-4 rounded-xl transition-all duration-300 text-lg font-semibold tracking-wide hover:scale-[1.02] flex items-center space-x-3 ${
                                isActive(childItem.href)
                                  ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-md'
                                  : 'text-white/80 hover:bg-white/5'
                              }`}
                            >
                              {childItem.icon && <childItem.icon className="w-5 h-5" />}
                              <span>{childItem.name.toUpperCase()}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Navegación estática para landing page
                staticNavigationItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
                  >
                    {item.name.toUpperCase()}
                  </button>
                ))
              )}
            </div>

            {/* Separador */}
            <div className="my-12 border-t border-white/20"></div>

            {/* Sección de Cuenta */}
            <div className="space-y-1">
              <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-6 px-6">CUENTA</h3>
              
              {isDynamic ? (
                // Información del usuario autenticado
                <>
                  <div className="bg-white/5 rounded-2xl p-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-base">
                          {user?.nombre && user?.apellidos 
                            ? `${user.nombre} ${user.apellidos}` 
                            : user?.nombre || 'Usuario'}
                        </p>
                        <p className="text-white/60 text-sm">
                          {user?.correo || 'Usuario Autenticado'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white/50 text-xs">Sesión activa</span>
                          {user?.rol && (
                            <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs font-medium">
                              {user.rol}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botón de Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-white hover:bg-red-500/20 p-4 rounded-2xl transition-all duration-300 text-lg font-bold tracking-wide hover:scale-[1.02] mt-4 flex items-center space-x-3"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>CERRAR SESIÓN</span>
                  </button>
                </>
              ) : (
                // Botones de autenticación para landing page
                <>
                  <button
                    onClick={() => { onOpenLoginModal?.(); setIsMenuOpen(false); }}
                    className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
                  >
                    INICIAR SESIÓN
                  </button>
                  <button
                    onClick={() => { onOpenRegisterModal?.(); setIsMenuOpen(false); }}
                    className="w-full text-left text-white hover:bg-white/10 p-6 rounded-2xl transition-all duration-300 text-xl font-bold tracking-wide hover:scale-[1.02]"
                  >
                    REGISTRARSE
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer del Sidebar */}
          <div className="p-8 border-t border-white/10">
            <div className="flex items-center justify-between text-white/40 text-sm font-medium">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                <span className="tracking-wide">ESPAÑOL</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="tracking-wide">CONFIGURACIÓN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedSidebar;
