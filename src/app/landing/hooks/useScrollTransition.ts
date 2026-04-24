import { useEffect, useRef, useState } from 'react';

export const useScrollTransition = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current || !videoRef.current) return;

      const heroRect = heroRef.current.getBoundingClientRect();
      const videoRect = videoRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calcular el progreso de la transición
      const heroBottom = heroRect.bottom;
      const videoTop = videoRect.top;
      const transitionHeight = windowHeight * 0.5; // Altura de la zona de transición

      if (heroBottom > windowHeight && videoTop < windowHeight) {
        // En la zona de transición
        const progress = Math.max(0, Math.min(1, (windowHeight - videoTop) / transitionHeight));
        setScrollProgress(progress);
      } else if (heroBottom <= windowHeight) {
        // Hero section visible
        setScrollProgress(0);
      } else if (videoTop >= windowHeight) {
        // Video section visible
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamada inicial

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollProgress, heroRef, videoRef };
}; 