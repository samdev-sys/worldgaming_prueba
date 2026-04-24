import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface HighlightItem {
  id: number;
  title: string;
  description?: string;
  image: string;
  link?: string;
  type: 'image' | 'video';
  duration?: number; // en segundos para videos
}

interface HighlightCarouselProps {
  items: HighlightItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number; // en milisegundos
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
}

const HighlightCarousel: React.FC<HighlightCarouselProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  showIndicators = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality with synchronized progress bar
  useEffect(() => {
    // Limpiar intervalos existentes
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    if (isPlaying && !isHovered && items.length > 1) {
      // Resetear progreso al inicio
      setProgress(0);

      // Crear barra de progreso suave
      const progressStep = 100 / (autoPlayInterval / 50); // Actualizar cada 50ms
      progressRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + progressStep;
          return newProgress >= 100 ? 0 : newProgress;
        });
      }, 50);

      // Cambiar slide cuando el progreso llegue al final
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        setProgress(0); // Resetear progreso para el siguiente slide
      }, autoPlayInterval);
    } else {
      setProgress(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPlaying, isHovered, items.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
    setProgress(0); // Resetear progreso al navegar manualmente
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    setProgress(0); // Resetear progreso al navegar manualmente
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0); // Resetear progreso al navegar manualmente
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];
  if (!currentItem) return null;

  return (
    <div 
      className={`relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main slide */}
      <div className="relative w-full h-full">
        {currentItem.type === 'video' ? (
          <video
            className="w-full h-full object-cover"
            src={currentItem.image}
            autoPlay={isPlaying}
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={currentItem.image}
            alt={currentItem.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 line-clamp-2">
            {currentItem.title}
          </h3>
          {currentItem.description && (
            <p className="text-white/90 text-sm md:text-base line-clamp-2">
              {currentItem.description}
            </p>
          )}
        </div>

        {/* Play/Pause overlay for videos */}
        {currentItem.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlayPause}
              className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors duration-200"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      {showControls && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {autoPlay && items.length > 1 && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={togglePlayPause}
            className="bg-black/30 backdrop-blur-sm rounded-full p-2 hover:bg-black/50 transition-colors duration-200"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* Progress bar */}
      {autoPlay && isPlaying && items.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-75 ease-linear"
            style={{
              width: `${progress}%`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HighlightCarousel;
