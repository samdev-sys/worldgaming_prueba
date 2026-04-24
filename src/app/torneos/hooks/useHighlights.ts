import { useState, useEffect } from 'react';

export interface HighlightItem {
  id: number;
  title: string;
  description?: string;
  image: string;
  link?: string;
  type: 'image' | 'video';
  duration?: number;
  isActive: boolean;
  createdAt: string;
  priority: number; // Para ordenar los highlights
}

interface UseHighlightsReturn {
  highlights: HighlightItem[];
  loading: boolean;
  error: string | null;
  refreshHighlights: () => void;
}

export const useHighlights = (): UseHighlightsReturn => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHighlights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular llamada a API - por ahora datos mock
      // TODO: Reemplazar con llamada real al API
      const mockHighlights: HighlightItem[] = [
        {
          id: 1,
          title: "Torneo Mundial de Valorant 2024",
          description: "Únete al torneo más grande del año con premios de $50,000 USD",
          image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop",
          link: "/torneos/valorant-world-2024",
          type: "image",
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z",
          priority: 1
        },
        {
          id: 2,
          title: "Nuevas Actualizaciones de Fortnite",
          description: "Descubre las últimas características y modos de juego",
          image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop",
          type: "image",
          isActive: true,
          createdAt: "2024-01-14T15:30:00Z",
          priority: 2
        },
        {
          id: 3,
          title: "League of Legends Championship",
          description: "Campeonato regional con los mejores equipos de LATAM",
          image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=1200&h=600&fit=crop",
          link: "/torneos/lol-championship-2024",
          type: "image",
          isActive: true,
          createdAt: "2024-01-13T09:15:00Z",
          priority: 3
        },
        {
          id: 4,
          title: "Free Fire Tournament Highlights",
          description: "Revive los mejores momentos del torneo pasado",
          image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=600&fit=crop",
          type: "image",
          isActive: true,
          createdAt: "2024-01-12T14:20:00Z",
          priority: 4
        },
        {
          id: 5,
          title: "Call of Duty Warzone Meta",
          description: "Las mejores estrategias y armas del meta actual",
          image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=600&fit=crop",
          type: "image",
          isActive: true,
          createdAt: "2024-01-11T11:45:00Z",
          priority: 5
        }
      ];

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filtrar solo highlights activos y ordenar por prioridad
      const activeHighlights = mockHighlights
        .filter(highlight => highlight.isActive)
        .sort((a, b) => a.priority - b.priority);

      setHighlights(activeHighlights);
    } catch (err) {
      setError('Error al cargar los highlights');
      console.error('Error loading highlights:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshHighlights = () => {
    loadHighlights();
  };

  useEffect(() => {
    loadHighlights();
  }, []);

  return {
    highlights,
    loading,
    error,
    refreshHighlights
  };
};
