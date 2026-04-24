import React, { useState, useCallback } from 'react';

import StatsSection from './components/StatsSection';
import FeaturedTournament from './components/FeaturedTournament';
import GameSelector from './components/GameSelector';
import GamingHub from './components/GamingHub';
import { useColorPalette } from '../shared/contexts';
import HeaderSection from './components/HeaderSection';
import HeroSection from './components/HeroSection';
import TournamentsSection from './components/TournamentsSection';
import CommunitySection from './components/CommunitySection';
import ContactSection from './components/ContactSection';
import LoginModal from '../auth/components/LoginModal';
import RegisterModal from '../auth/components/RegisterModal';
import { Zap, Gamepad2 } from 'lucide-react';

// Interfaz para la paleta de colores
interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  light: string;
}

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isGamingHubOpen, setIsGamingHubOpen] = useState(false);
  const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);
  const [gamePalette, setGamePalette] = useState<ColorPalette | null>(null);
  const { currentPalette } = useColorPalette();

  // Función para actualizar la paleta desde el GameSelector
  const handlePaletteUpdate = useCallback((palette: ColorPalette) => {
    setGamePalette(palette);
  }, []);

  // Usar la paleta del juego si está disponible, sino usar la del contexto
  const activePalette = gamePalette || currentPalette;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(135deg, ${activePalette.primary} 0%, ${activePalette.secondary} 50%, ${activePalette.tertiary} 100%)`
      }}
    >
      {/* Header */}
      <HeaderSection
        scrollToSection={scrollToSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onOpenLoginModal={handleOpenLoginModal}
        onOpenRegisterModal={handleOpenRegisterModal}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Sección de Estadísticas */}
      <StatsSection />

      {/* Sección Torneo Destacado */}
      <FeaturedTournament />

      {/* Sección Torneos */}
      <TournamentsSection />

      {/* Sección Comunidad */}
      <CommunitySection />

      {/* Sección Contacto */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/60">
            © 2025 World Gaming. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Icono flotante para Gaming Hub */}
      <div className="fixed top-24 left-6 z-50">
        <button
          onClick={() => setIsGamingHubOpen(!isGamingHubOpen)}
          className={`relative group transition-all duration-300 transform hover:scale-110 ${
            isGamingHubOpen ? 'rotate-12' : 'rotate-0'
          }`}
        >
          {/* Efecto de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Botón principal */}
          <div className="relative bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-full p-3 sm:p-4 border border-white/20 shadow-2xl hover:border-white/40 transition-all duration-300">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 group-hover:text-purple-400 transition-colors duration-300" />
            
            {/* Indicador de estado */}
            {isGamingHubOpen && (
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden sm:block">
              Gaming Hub
            </div>
          </div>
        </button>
      </div>

      {/* Icono flotante para Game Selector */}
      <div className="fixed top-24 right-6 z-50">
        <button
          onClick={() => setIsGameSelectorOpen(!isGameSelectorOpen)}
          className={`relative group transition-all duration-300 transform hover:scale-110 ${
            isGameSelectorOpen ? 'rotate-12' : 'rotate-0'
          }`}
        >
          {/* Efecto de fondo */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Botón principal */}
          <div className="relative bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-full p-3 sm:p-4 border border-white/20 shadow-2xl hover:border-white/40 transition-all duration-300">
            <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 group-hover:text-red-400 transition-colors duration-300" />
            
            {/* Indicador de estado */}
            {isGameSelectorOpen && (
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden sm:block">
              Seleccionar Juego
            </div>
          </div>
        </button>
      </div>

      {/* Gaming Hub - Solo visible cuando está abierto y el sidebar está cerrado */}
      <div
        className={`fixed top-24 left-20 sm:left-24 z-40 transition-all duration-500 ease-out ${
          isGamingHubOpen && !isMenuOpen
            ? 'opacity-100 pointer-events-auto transform translate-x-0'
            : 'opacity-0 pointer-events-none transform -translate-x-4'
        }`}
      >
        <GamingHub />
      </div>

      {/* Selector de Juegos - Solo visible cuando está abierto y el sidebar está cerrado */}
      <div
        className={`fixed top-24 right-20 z-40 transition-all duration-500 ease-out ${
          isGameSelectorOpen && !isMenuOpen
            ? 'opacity-100 pointer-events-auto transform translate-x-0'
            : 'opacity-0 pointer-events-none transform translate-x-4'
        }`}
      >
        <GameSelector onPaletteUpdate={handlePaletteUpdate} />
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        onSwitchToLogin={handleSwitchToLogin}
      />

    </div>
  );
};

export default LandingPage;