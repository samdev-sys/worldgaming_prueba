import React, { useState, useEffect } from 'react';
import {
  Loader2,
  Zap,
  Target,
  Crown,
  Flame,
  Sparkles,
  Trophy,
  Users,
  TrendingUp,
  Bell,
  Star,
  Gamepad2,
  Calendar,
  Award,
  Activity,
  BarChart3,
  MessageSquare,
  Heart,
  Shield,
  Sword
} from 'lucide-react';
import { useNotification } from '../../shared/components/ui/UnifiedNotificationSystem';

interface PanelData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  stats: string;
  description: string;
  items?: Array<{
    id: string;
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
  }>;
}

const GamingHub: React.FC = () => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification, openModal } = useNotification();

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const panels: PanelData[] = [
    {
      id: 'stats',
      title: 'ESTADÍSTICAS',
      subtitle: 'Métricas en tiempo real',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'text-blue-400',
      stats: '2.5M+',
      description: 'Jugadores activos',
      items: [
        { id: '1', title: 'Torneos Activos', value: '47', icon: <Trophy className="w-4 h-4" />, color: 'text-yellow-400' },
        { id: '2', title: 'Premios Hoy', value: '$125K', icon: <Award className="w-4 h-4" />, color: 'text-green-400' },
        { id: '3', title: 'Eventos Próximos', value: '12', icon: <Calendar className="w-4 h-4" />, color: 'text-purple-400' },
        { id: '4', title: 'Streams Live', value: '89', icon: <Activity className="w-4 h-4" />, color: 'text-red-400' }
      ]
    },
    {
      id: 'activity',
      title: 'ACTIVIDAD',
      subtitle: 'Tu progreso gaming',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-green-400',
      stats: '85%',
      description: 'Win Rate',
      items: [
        { id: '1', title: 'Partidas Hoy', value: '23', icon: <Gamepad2 className="w-4 h-4" />, color: 'text-blue-400' },
        { id: '2', title: 'Victorias', value: '19', icon: <Crown className="w-4 h-4" />, color: 'text-yellow-400' },
        { id: '3', title: 'Ranking', value: '#1,247', icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-400' },
        { id: '4', title: 'Logros', value: '156', icon: <Star className="w-4 h-4" />, color: 'text-orange-400' }
      ]
    },
    {
      id: 'social',
      title: 'SOCIAL',
      subtitle: 'Comunidad gaming',
      icon: <Users className="w-5 h-5" />,
      color: 'text-purple-400',
      stats: '24',
      description: 'Amigos online',
      items: [
        { id: '1', title: 'Mensajes', value: '8', icon: <MessageSquare className="w-4 h-4" />, color: 'text-blue-400' },
        { id: '2', title: 'Clanes', value: '3', icon: <Shield className="w-4 h-4" />, color: 'text-green-400' },
        { id: '3', title: 'Favoritos', value: '12', icon: <Heart className="w-4 h-4" />, color: 'text-red-400' },
        { id: '4', title: 'Retos', value: '5', icon: <Sword className="w-4 h-4" />, color: 'text-orange-400' }
      ]
    },
    {
      id: 'notifications',
      title: 'NOTIFICACIONES',
      subtitle: 'Mantente informado',
      icon: <Bell className="w-5 h-5" />,
      color: 'text-orange-400',
      stats: '7',
      description: 'Nuevas alertas',
      items: [
        { id: '1', title: 'Torneos', value: '3', icon: <Trophy className="w-4 h-4" />, color: 'text-yellow-400' },
        { id: '2', title: 'Mensajes', value: '2', icon: <MessageSquare className="w-4 h-4" />, color: 'text-blue-400' },
        { id: '3', title: 'Logros', value: '1', icon: <Star className="w-4 h-4" />, color: 'text-green-400' },
        { id: '4', title: 'Eventos', value: '1', icon: <Calendar className="w-4 h-4" />, color: 'text-purple-400' }
      ]
    }
  ];

  const handlePanelClick = (panelId: string) => {
    if (panelId === 'notifications') {
      // Abrir el modal de notificaciones
      openModal();
      return;
    }
    
    if (panelId === 'stats') {
      // Simular notificación de estadísticas
      addNotification('Tus estadísticas de juego han sido actualizadas. ¡Revisa tu progreso!', 'info');
    }
    
    if (panelId === 'activity') {
      // Simular notificación de actividad
      addNotification('¡Nuevo Logro Desbloqueado! Has completado 100 partidas. ¡Felicidades por tu dedicación!', 'success');
    }
    
    if (panelId === 'social') {
      // Simular notificación social
      addNotification('Tu amigo GamingPro te ha enviado un mensaje.', 'message');
    }
    
    if (activePanel === panelId) {
      setActivePanel(null);
    } else {
      setActivePanel(panelId);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed top-24 left-6 z-50">
        <div className="bg-gradient-to-br from-black/40 to-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3 text-white">
            <div className="relative">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              <div className="absolute inset-0 w-5 h-5 border-2 border-blue-400/30 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-medium">Inicializando hub gaming...</span>
          </div>
        </div>
      </div>
    );
  }

  const activePanelData = panels.find(p => p.id === activePanel);

  return (
    <div className="fixed top-24 left-6 z-50">
      {/* Contenedor principal */}
      <div className="relative">
        {/* Efectos de partículas de fondo */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-3xl blur-xl animate-pulse w-64 sm:w-72 md:w-80"></div>

        {/* Contenido principal */}
        <div className="relative bg-gradient-to-br from-black/60 via-gray-900/60 to-black/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden w-64 sm:w-72 md:w-80 max-h-[28rem] sm:max-h-[32rem] md:max-h-[36rem]">
          {/* Header con efecto gaming */}
          <div className="relative p-4 sm:p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 animate-pulse" />
                  <Sparkles className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 text-purple-400 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-lg uppercase tracking-wider">
                    GAMING HUB
                  </h3>
                  <p className="text-white/60 text-xs">Tu centro de control</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-xs hidden sm:inline">Live</span>
              </div>
            </div>
          </div>

          {/* Contenido scrolleable */}
          <div className="overflow-y-auto max-h-80 sm:max-h-96 md:max-h-[28rem]" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent' }}>
            {/* Panel activo expandido */}
            {activePanelData && (
              <div className="p-4 sm:p-6 border-b border-white/10">
                <div className={`bg-gradient-to-r from-${activePanelData.color.replace('text-', '')}/20 to-${activePanelData.color.replace('text-', '')}/10 rounded-2xl p-3 sm:p-4 border border-${activePanelData.color.replace('text-', '')}/30`}>
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                    <div className="relative">
                      <div className={`${activePanelData.color} text-xl sm:text-2xl`}>
                        {activePanelData.icon}
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-xs sm:text-sm">{activePanelData.title}</h4>
                      <p className="text-white/70 text-xs">{activePanelData.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg sm:text-2xl font-bold ${activePanelData.color}`}>{activePanelData.stats}</div>
                      <div className="text-white/60 text-xs">{activePanelData.description}</div>
                    </div>
                  </div>

                  {/* Items del panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {activePanelData.items?.map((item) => (
                      <div key={item.id} className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10 hover:bg-white/10 transition-all duration-200">
                        <div className="flex items-center space-x-2">
                          <div className={item.color}>{item.icon}</div>
                          <div className="flex-1">
                            <p className="text-white/60 text-xs">{item.title}</p>
                            <p className="text-white font-semibold text-xs sm:text-sm">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mini paneles */}
            <div className="p-3 sm:p-4 space-y-2">
              {panels.map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => handlePanelClick(panel.id)}
                  onMouseEnter={() => setHoveredPanel(panel.id)}
                  onMouseLeave={() => setHoveredPanel(null)}
                  className={`w-full relative group transition-all duration-300 transform ${hoveredPanel === panel.id ? 'scale-105' : 'scale-100'
                    }`}
                >
                  {/* Efecto de hover */}
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${hoveredPanel === panel.id
                      ? `bg-gradient-to-r from-${panel.color.replace('text-', '')}/20 to-${panel.color.replace('text-', '')}/10 border border-${panel.color.replace('text-', '')}/30`
                      : 'bg-white/5 border border-white/10'
                    }`}></div>

                  {/* Contenido del botón */}
                  <div className="relative p-3 sm:p-4 rounded-xl flex items-center space-x-2 sm:space-x-3">
                    <div className="relative">
                      <div className={`text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200 ${panel.color}`}>
                        {panel.icon}
                      </div>
                      {hoveredPanel === panel.id && (
                        <div className={`absolute -inset-2 bg-${panel.color.replace('text-', '')}/20 rounded-full animate-ping`}></div>
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <h4 className="text-white font-bold text-xs sm:text-sm group-hover:text-blue-400 transition-colors">
                        {panel.title}
                      </h4>
                      <p className="text-white/60 text-xs">{panel.subtitle}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs font-medium ${panel.color}`}>{panel.stats}</span>
                        <span className="text-white/40 text-xs hidden sm:inline">{panel.description}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {hoveredPanel === panel.id && (
                        <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400 animate-pulse" />
                      )}
                      {activePanel === panel.id && (
                        <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer con estadísticas */}
          <div className="p-3 sm:p-4 border-t border-white/10">
            <div className="flex items-center justify-between text-white/60 text-xs">
              <span>Total: {panels.length} hubs</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">Sincronizado</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingHub;
