import React, { useState } from 'react';
import { Users, X, Trophy, Gamepad2, Target } from 'lucide-react';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';

interface AvailableTeam {
  id: string;
  name: string;
  tag: string;
  logo?: string;
  image: string;
  description: string;
  gameRequirements: {
    gameId: string;
    gameName: string;
  }[];
  players: {
    titulares: any[];
    suplentes: any[];
  };
  wins: number;
  totalMatches: number;
  isRecruiting: boolean;
  rank: string;
  tier: string;
  points: number;
  createdAt: string;
}

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinTeam: (teamId: string) => void;
}

const JoinTeamModal: React.FC<JoinTeamModalProps> = ({
  isOpen,
  onClose,
  onJoinTeam
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Mock data de equipos disponibles
  const availableTeams: AvailableTeam[] = [
    {
      id: '1',
      name: 'ESTRAL ESPORTS',
      tag: 'ESTRAL',
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      description: 'Equipo profesional de esports con experiencia en múltiples juegos. Buscamos jugadores dedicados y comprometidos.',
      gameRequirements: [
        { gameId: '1', gameName: 'League of Legends' },
        { gameId: '2', gameName: 'Valorant' }
      ],
      players: { titulares: [], suplentes: [] },
      wins: 18,
      totalMatches: 25,
      isRecruiting: true,
      rank: 'Diamante',
      tier: 'I',
      points: 1850,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'TIMBERS ESPORTS',
      tag: 'TIMBERS',
      logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      description: 'Equipo emergente con gran potencial en FPS. Somos una comunidad joven y ambiciosa.',
      gameRequirements: [
        { gameId: '2', gameName: 'Valorant' },
        { gameId: '3', gameName: 'CS:GO' }
      ],
      players: { titulares: [], suplentes: [] },
      wins: 12,
      totalMatches: 18,
      isRecruiting: true,
      rank: 'Platino',
      tier: 'II',
      points: 1450,
      createdAt: '2024-02-10'
    },
    {
      id: '3',
      name: 'PIXEL ESPORTS',
      tag: 'PIXEL',
      logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      description: 'Equipo especializado en juegos de estrategia y deportes electrónicos.',
      gameRequirements: [
        { gameId: '4', gameName: 'Rocket League' }
      ],
      players: { titulares: [], suplentes: [] },
      wins: 8,
      totalMatches: 12,
      isRecruiting: true,
      rank: 'Oro',
      tier: 'I',
      points: 950,
      createdAt: '2024-03-05'
    },
    {
      id: '4',
      name: 'STORM RIDERS',
      tag: 'STORM',
      logo: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=100&h=100&fit=crop',
      image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=300&fit=crop',
      description: 'Equipo casual para diversión y aprendizaje. Perfecto para jugadores que quieren mejorar.',
      gameRequirements: [
        { gameId: '1', gameName: 'League of Legends' },
        { gameId: '5', gameName: 'FIFA' }
      ],
      players: { titulares: [], suplentes: [] },
      wins: 5,
      totalMatches: 10,
      isRecruiting: false,
      rank: 'Plata',
      tier: 'II',
      points: 650,
      createdAt: '2024-03-15'
    }
  ];

  const handleJoinTeam = async (teamId: string) => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onJoinTeam(teamId);
      onClose();
    } catch (error) {
      console.error('Error al unirse al equipo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Configuración de campos para las cards
  const cardFields = [
    {
      label: 'Nombre',
      key: 'name',
      render: (value: string, item: AvailableTeam) => (
        <div className="flex items-center space-x-3">
          {item.logo ? (
            <img
              src={item.logo}
              alt={item.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{value}</h3>
            <span className="text-sm text-gray-400">[{item.tag}]</span>
          </div>
        </div>
      )
    },
    {
      label: 'Descripción',
      key: 'description',
      render: (value: string) => (
        <p className="text-gray-300 text-sm line-clamp-2">{value}</p>
      )
    },
    {
      label: 'Estadísticas',
      key: 'stats',
      render: (value: any, item: AvailableTeam) => (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">
              {Math.round((item.wins / item.totalMatches) * 100)}%
            </div>
            <div className="text-xs text-gray-400">Win Rate</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">{item.points}</div>
            <div className="text-xs text-gray-400">Puntos</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">
              {item.rank} {item.tier}
            </div>
            <div className="text-xs text-gray-400">Rango</div>
          </div>
        </div>
      )
    },
    {
      label: 'Juegos',
      key: 'games',
      render: (value: any, item: AvailableTeam) => (
        <div className="flex flex-wrap gap-2">
          {item.gameRequirements.map((game) => (
            <span
              key={game.gameId}
              className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
            >
              {game.gameName}
            </span>
          ))}
        </div>
      )
    }
  ];

  // Configuración de filtros
  const filters = [
    {
      type: 'search' as const,
      key: 'search',
      placeholder: 'Buscar equipos...'
    },
    {
      type: 'select' as const,
      key: 'game',
      placeholder: 'Todos los juegos',
      options: [
        { value: '', label: 'Todos los juegos' },
        { value: 'lol', label: 'League of Legends' },
        { value: 'valorant', label: 'Valorant' },
        { value: 'csgo', label: 'CS:GO' },
        { value: 'rocket', label: 'Rocket League' },
        { value: 'fifa', label: 'FIFA' }
      ]
    },
    {
      type: 'select' as const,
      key: 'status',
      placeholder: 'Estado',
      options: [
        { value: '', label: 'Todos' },
        { value: 'recruiting', label: 'Reclutando' },
        { value: 'full', label: 'Completo' }
      ]
    }
  ];

  // Función para renderizar acciones personalizadas
  const renderCardActions = (item: AvailableTeam) => (
    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${item.isRecruiting ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className={`text-xs ${item.isRecruiting ? 'text-green-400' : 'text-red-400'}`}>
          {item.isRecruiting ? 'Reclutando' : 'Completo'}
        </span>
      </div>
      <button
        onClick={() => handleJoinTeam(item.id)}
        disabled={!item.isRecruiting || isLoading}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          item.isRecruiting && !isLoading
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? 'Enviando...' : 'Solicitar Unirse'}
      </button>
    </div>
  );

  // Función para personalizar el estilo de las cards
  const getCardClassName = (item: AvailableTeam) => {
    return `bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500 transition-all duration-300 ${
      !item.isRecruiting ? 'opacity-75' : ''
    }`;
  };

  // Función para renderizar card personalizada
  const renderCustomCard = (item: AvailableTeam) => (
    <div className={getCardClassName(item)}>
      <div className="p-6">
        {/* Header con imagen de fondo */}
        <div className="relative h-32 rounded-lg overflow-hidden mb-4">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="text-xl font-bold text-white">{item.name}</h3>
            <span className="text-sm text-gray-300">[{item.tag}]</span>
          </div>
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              item.isRecruiting 
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {item.isRecruiting ? 'Reclutando' : 'Completo'}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-4">
          {/* Descripción */}
          <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-400">
                {Math.round((item.wins / item.totalMatches) * 100)}%
              </div>
              <div className="text-xs text-gray-400">Win Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-400">{item.points}</div>
              <div className="text-xs text-gray-400">Puntos</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-400">
                {item.rank} {item.tier}
              </div>
              <div className="text-xs text-gray-400">Rango</div>
            </div>
          </div>

          {/* Juegos */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Gamepad2 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Juegos:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.gameRequirements.map((game) => (
                <span
                  key={game.gameId}
                  className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
                >
                  {game.gameName}
                </span>
              ))}
            </div>
          </div>

          {/* Acciones */}
          {renderCardActions(item)}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Unirse a un Equipo</h2>
                  <p className="text-white/60 text-sm">Explora equipos disponibles y solicita unirte</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6">
            <DynamicCardList
              title=""
              subtitle=""
              data={availableTeams}
              cardFields={cardFields}
              filters={filters}
              pagination={true}
              cardActions={renderCardActions}
              renderCard={renderCustomCard}
              getCardClassName={getCardClassName}
              gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              emptyMessage="No se encontraron equipos disponibles"
              emptyIcon={Users}
              isLoading={isLoading}
              className="bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTeamModal;
