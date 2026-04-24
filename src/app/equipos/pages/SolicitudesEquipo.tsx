import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicCardList from '../../shared/components/ui/DynamicCardList';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  UserPlus,
  UserMinus,
  Trophy,
  Gamepad2,
  ArrowLeft
} from 'lucide-react';

interface TeamRequest {
  id: string;
  type: 'sent' | 'received'; // 'sent' = solicitud enviada, 'received' = solicitud recibida
  status: 'pending' | 'accepted' | 'rejected';
  team: {
    id: string;
    name: string;
    tag: string;
    logo?: string;
    image: string;
    rank: string;
    tier: string;
    points: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    experience: number;
    rank: string;
  };
  message?: string;
  createdAt: string;
  updatedAt?: string;
  gameRequirements?: {
    gameId: string;
    gameName: string;
  }[];
}

const SolicitudesEquipo: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data de solicitudes
  const [requests] = useState<TeamRequest[]>([
    // Solicitudes enviadas
    {
      id: '1',
      type: 'sent',
      status: 'pending',
      team: {
        id: 'team1',
        name: 'ESTRAL ESPORTS',
        tag: 'ESTRAL',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        rank: 'Diamante',
        tier: 'I',
        points: 1850
      },
      message: 'Hola, me interesa unirme a su equipo. Tengo experiencia en League of Legends y Valorant.',
      createdAt: '2024-01-20T10:30:00Z',
      gameRequirements: [
        { gameId: '1', gameName: 'League of Legends' },
        { gameId: '2', gameName: 'Valorant' }
      ]
    },
    {
      id: '2',
      type: 'sent',
      status: 'accepted',
      team: {
        id: 'team2',
        name: 'GAMING LEGENDS',
        tag: 'GL',
        logo: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=300&fit=crop',
        rank: 'Platino',
        tier: 'II',
        points: 1450
      },
      message: 'Me gustaría formar parte de su equipo. Soy jugador de CS:GO.',
      createdAt: '2024-01-18T14:20:00Z',
      updatedAt: '2024-01-19T09:15:00Z',
      gameRequirements: [
        { gameId: '3', gameName: 'CS:GO' }
      ]
    },
    {
      id: '3',
      type: 'sent',
      status: 'rejected',
      team: {
        id: 'team3',
        name: 'ELITE WARRIORS',
        tag: 'EW',
        logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
        rank: 'Diamante',
        tier: 'III',
        points: 2100
      },
      message: 'Solicito unirme a su equipo. Tengo experiencia competitiva.',
      createdAt: '2024-01-15T16:45:00Z',
      updatedAt: '2024-01-16T11:30:00Z',
      gameRequirements: [
        { gameId: '1', gameName: 'League of Legends' },
        { gameId: '2', gameName: 'Valorant' }
      ]
    },
    // Solicitudes recibidas
    {
      id: '4',
      type: 'received',
      status: 'pending',
      team: {
        id: 'my-team',
        name: 'MI EQUIPO',
        tag: 'ME',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        rank: 'Diamante',
        tier: 'I',
        points: 1850
      },
      user: {
        id: 'user1',
        name: 'Alex Rodriguez',
        email: 'alex@email.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        experience: 5,
        rank: 'Diamante III'
      },
      message: 'Hola, me interesa unirme a su equipo. Soy jugador experimentado en League of Legends.',
      createdAt: '2024-01-21T08:15:00Z',
      gameRequirements: [
        { gameId: '1', gameName: 'League of Legends' }
      ]
    },
    {
      id: '5',
      type: 'received',
      status: 'pending',
      team: {
        id: 'my-team',
        name: 'MI EQUIPO',
        tag: 'ME',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        rank: 'Diamante',
        tier: 'I',
        points: 1850
      },
      user: {
        id: 'user2',
        name: 'Sarah Chen',
        email: 'sarah@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        experience: 3,
        rank: 'Platino I'
      },
      message: 'Me gustaría formar parte de su equipo. Tengo experiencia en Valorant.',
      createdAt: '2024-01-20T15:30:00Z',
      gameRequirements: [
        { gameId: '2', gameName: 'Valorant' }
      ]
    },
    {
      id: '6',
      type: 'received',
      status: 'accepted',
      team: {
        id: 'my-team',
        name: 'MI EQUIPO',
        tag: 'ME',
        logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        rank: 'Diamante',
        tier: 'I',
        points: 1850
      },
      user: {
        id: 'user3',
        name: 'Carlos Garcia',
        email: 'carlos@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        experience: 4,
        rank: 'Diamante II'
      },
      message: 'Solicito unirme a su equipo. Soy jugador de League of Legends.',
      createdAt: '2024-01-19T12:00:00Z',
      updatedAt: '2024-01-19T18:45:00Z',
      gameRequirements: [
        { gameId: '1', gameName: 'League of Legends' }
      ]
    }
  ]);

  // Filtrar solicitudes según el tab activo
  const filteredRequests = requests.filter(request => request.type === activeTab);

  const handleAcceptRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Solicitud aceptada:', requestId);
      // Aquí actualizarías el estado o harías la llamada a la API
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Solicitud rechazada:', requestId);
      // Aquí actualizarías el estado o harías la llamada a la API
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = (userId: string) => {
    console.log('Ver perfil de usuario:', userId);
    // Aquí navegarías al perfil del usuario
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'accepted': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return 'Desconocido';
    }
  };

  // Configuración de campos para las cards de solicitudes enviadas
  const sentRequestsCardFields = [
    {
      label: 'Equipo',
      key: 'team',
      render: (value: any, item: TeamRequest) => (
        <div className="flex items-center space-x-3">
          {item.team.logo ? (
            <img
              src={item.team.logo}
              alt={item.team.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{item.team.name}</h3>
            <span className="text-sm text-gray-400">[{item.team.tag}]</span>
          </div>
        </div>
      )
    },
    {
      label: 'Estado',
      key: 'status',
      render: (value: string, item: TeamRequest) => {
        const StatusIcon = getStatusIcon(item.status);
        return (
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${getStatusColor(item.status)}`} />
            <span className={`font-medium ${getStatusColor(item.status)}`}>
              {getStatusText(item.status)}
            </span>
          </div>
        );
      }
    },
    {
      label: 'Mensaje',
      key: 'message',
      render: (value: string) => (
        <p className="text-gray-300 text-sm line-clamp-2">{value}</p>
      )
    },
    {
      label: 'Fecha',
      key: 'createdAt',
      render: (value: string) => (
        <div className="text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(value).toLocaleDateString()}</span>
          </div>
        </div>
      )
    }
  ];

  // Configuración de campos para las cards de solicitudes recibidas
  const receivedRequestsCardFields = [
    {
      label: 'Usuario',
      key: 'user',
      render: (value: any, item: TeamRequest) => (
        <div className="flex items-center space-x-3">
          {item.user?.avatar ? (
            <img
              src={item.user.avatar}
              alt={item.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-white">{item.user?.name}</h3>
            <span className="text-sm text-gray-400">{item.user?.rank}</span>
          </div>
        </div>
      )
    },
    {
      label: 'Estado',
      key: 'status',
      render: (value: string, item: TeamRequest) => {
        const StatusIcon = getStatusIcon(item.status);
        return (
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-5 h-5 ${getStatusColor(item.status)}`} />
            <span className={`font-medium ${getStatusColor(item.status)}`}>
              {getStatusText(item.status)}
            </span>
          </div>
        );
      }
    },
    {
      label: 'Mensaje',
      key: 'message',
      render: (value: string) => (
        <p className="text-gray-300 text-sm line-clamp-2">{value}</p>
      )
    },
    {
      label: 'Fecha',
      key: 'createdAt',
      render: (value: string) => (
        <div className="text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(value).toLocaleDateString()}</span>
          </div>
        </div>
      )
    }
  ];

  // Configuración de filtros
  const filters = [
    {
      type: 'search' as const,
      key: 'search',
      placeholder: 'Buscar solicitudes...'
    },
    {
      type: 'select' as const,
      key: 'status',
      placeholder: 'Todos los estados',
      options: [
        { value: '', label: 'Todos los estados' },
        { value: 'pending', label: 'Pendiente' },
        { value: 'accepted', label: 'Aceptada' },
        { value: 'rejected', label: 'Rechazada' }
      ]
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
        { value: 'rocket', label: 'Rocket League' }
      ]
    }
  ];

  // Función para renderizar acciones personalizadas para solicitudes enviadas
  const renderSentRequestActions = (item: TeamRequest) => (
    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
      <div className="flex items-center space-x-2">
        {item.gameRequirements?.map((game) => (
          <span
            key={game.gameId}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
          >
            {game.gameName}
          </span>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        {item.status === 'pending' && (
          <button
            onClick={() => console.log('Cancelar solicitud:', item.id)}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={() => console.log('Ver equipo:', item.team.id)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>Ver Equipo</span>
        </button>
      </div>
    </div>
  );

  // Función para renderizar acciones personalizadas para solicitudes recibidas
  const renderReceivedRequestActions = (item: TeamRequest) => (
    <div className="flex items-center justify-between pt-4 border-t border-gray-700">
      <div className="flex items-center space-x-2">
        {item.gameRequirements?.map((game) => (
          <span
            key={game.gameId}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full"
          >
            {game.gameName}
          </span>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        {item.status === 'pending' && (
          <>
            <button
              onClick={() => handleAcceptRequest(item.id)}
              disabled={isLoading}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>Aceptar</span>
            </button>
            <button
              onClick={() => handleRejectRequest(item.id)}
              disabled={isLoading}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1 disabled:opacity-50"
            >
              <UserMinus className="w-4 h-4" />
              <span>Rechazar</span>
            </button>
          </>
        )}
        <button
          onClick={() => handleViewProfile(item.user?.id || '')}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>Ver Perfil</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 text-white/60 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Solicitudes de Equipo</h1>
                <p className="text-white/60">Gestiona tus solicitudes de equipos</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 bg-gray-800 p-2 rounded-2xl">
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                activeTab === 'sent'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-medium text-base">Solicitudes Enviadas</span>
            </button>
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${
                activeTab === 'received'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <UserMinus className="w-5 h-5" />
              <span className="font-medium text-base">Solicitudes Recibidas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-6 py-6">
        <DynamicCardList
          title=""
          subtitle=""
          data={filteredRequests}
          cardFields={activeTab === 'sent' ? sentRequestsCardFields : receivedRequestsCardFields}
          filters={filters}
          pagination={true}
          cardActions={activeTab === 'sent' ? renderSentRequestActions : renderReceivedRequestActions}
          gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          emptyMessage={
            activeTab === 'sent' 
              ? "No tienes solicitudes enviadas" 
              : "No tienes solicitudes recibidas"
          }
          emptyIcon={MessageSquare}
          isLoading={isLoading}
          className="bg-transparent"
        />
      </div>
    </div>
  );
};

export default SolicitudesEquipo;
