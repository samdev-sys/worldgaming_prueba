import React, { useState } from 'react';
import { ZoomIn, Download, Share2 } from 'lucide-react';

interface PromotionalImageProps {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}

const PromotionalImage: React.FC<PromotionalImageProps> = ({ 
  src, 
  alt, 
  title = "Imagen Promocional",
  className = "" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Mira esta imagen promocional de World Gaming',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Efectos de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
      </div>

      {/* Overlay de controles */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-3xl flex items-center justify-center transition-all duration-300">
          <div className="flex space-x-6">
            <button
              onClick={() => window.open(src, '_blank')}
              className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
              title="Ver imagen completa"
            >
              <ZoomIn className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
              title="Descargar imagen"
            >
              <Download className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={handleShare}
              className="p-4 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
              title="Compartir"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Título flotante */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <h3 className="text-white font-bold text-lg">{title}</h3>
          <p className="text-white/80 text-sm mt-1">Imagen promocional oficial</p>
        </div>
      </div>

      {/* Indicador de imagen */}
      <div className="absolute top-4 right-4">
        <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/30">
          <span className="text-white text-xs font-medium">PNG</span>
        </div>
      </div>
    </div>
  );
};

export default PromotionalImage; 