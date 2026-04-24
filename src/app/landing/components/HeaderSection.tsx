import React from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import Logo from "./Logo";
import UnifiedSidebar from "../../shared/components/ui/UnifiedSidebar";

interface HeaderSectionProps {
  scrollToSection: (sectionId: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenLoginModal: () => void;
  onOpenRegisterModal: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  scrollToSection,
  isMenuOpen,
  setIsMenuOpen,
  onOpenLoginModal,
  onOpenRegisterModal,
}) => {
  const { isAuthenticated } = useAuth();
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Menú Hamburguesa */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`text-white p-4 rounded-full transition-all duration-500 z-50 backdrop-blur-sm hover:bg-white/10 hover:scale-110 ${isMenuOpen ? 'bg-white/20' : ''}`}
          >
            <div className={`transition-transform duration-500 ${isMenuOpen ? 'rotate-90' : ''}`}>
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </div>
          </button>
        </div>
      </header>

      {/* Renderizar sidebar unificado */}
      <UnifiedSidebar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        scrollToSection={scrollToSection}
        onOpenLoginModal={onOpenLoginModal}
        onOpenRegisterModal={onOpenRegisterModal}
        isDynamic={isAuthenticated}
      />
    </>
  );
};

export default HeaderSection;