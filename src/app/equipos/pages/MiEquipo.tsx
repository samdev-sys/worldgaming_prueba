import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamSelector from '../components/TeamSelector';
import JoinTeamModal from '../components/JoinTeamModal';
import {
  Users,
  Trophy,
  Target,
  TrendingUp,
  Shield,
  Gamepad2,
  Calendar,
  Crown,
  Shield as ShieldIcon,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Settings,
  MessageSquare
} from 'lucide-react';

interface Player {
  id: string;
  name: string;
  role: string;
  experience: number;
  avatar?: string;
  games: string[]; // IDs de los juegos que juega
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    winRate: number;
  };
}

interface GameRequirement {
  gameId: string;
  gameName: string;
  titulares: number;
  suplentes: number;
  totalPlayers: number;
  gameIcon?: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  logo?: string;
  image: string;
  tag: string;
  type?: 'created' | 'joined'; // 'created' = equipo creado por el usuario, 'joined' = equipo al que se unió
  role?: 'captain' | 'player' | 'admin'; // Rol del usuario en el equipo
  captains: {
    gameId: string;
    gameName: string;
    captainName: string;
  }[];
  players: {
    titulares: Player[];
    suplentes: Player[];
  };
  gameRequirements: GameRequirement[];
  isActive: boolean;
  createdAt: string;
  totalMatches: number;
  wins: number;
  losses: number;
  rank: string;
  tier: string;
  points: number;
}

const MiEquipo: React.FC = () => {
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [hasTeam, setHasTeam] = useState(true); // Para simular si tiene equipo o no
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showTeamSelector, setShowTeamSelector] = useState(false);

  // Función para manejar la selección de equipo
  const handleTeamSelect = (selectedTeam: Team) => {
    setTeam(selectedTeam);
    setShowTeamSelector(false);
    // Aquí podrías hacer una llamada a la API para cargar los datos del equipo seleccionado
  };

  // Función para abrir el selector de equipos
  const handleOpenTeamSelector = () => {
    setShowTeamSelector(true);
  };

  // Función para manejar la solicitud de unirse a un equipo
  const handleJoinTeam = (teamId: string) => {
    console.log('Solicitando unirse al equipo:', teamId);
    // Aquí iría la lógica para enviar la solicitud a la API
    // Por ahora solo mostramos un mensaje
    alert(`Solicitud enviada para unirse al equipo ${teamId}`);
  };

  useEffect(() => {
    // Mock data - en producción esto vendría de una API
    const mockTeam: Team = {
      id: '1',
      name: 'ESTRAL ESPORTS',
      description: 'Equipo profesional de esports con experiencia en múltiples juegos. Somos una comunidad apasionada por la excelencia competitiva.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      tag: 'ESTRAL',
      type: 'created',
      role: 'captain',
      captains: [
        { gameId: '1', gameName: 'League of Legends', captainName: 'Alex Rodriguez' },
        { gameId: '2', gameName: 'Valorant', captainName: 'Sarah Chen' }
      ],
      players: {
        titulares: [
          {
            id: '1',
            name: 'Alex Rodriguez',
            role: 'Captain',
            experience: 5,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
            games: ['1', '2'], // League of Legends y Valorant
            stats: { kills: 1250, deaths: 890, assists: 2100, winRate: 72 }
          },
          {
            id: '2',
            name: 'Sarah Chen',
            role: 'Player',
            experience: 3,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            games: ['2'], // Solo Valorant
            stats: { kills: 980, deaths: 650, assists: 1800, winRate: 68 }
          },
          {
            id: '3',
            name: 'Carlos Garcia',
            role: 'Player',
            experience: 4,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            games: ['1'], // Solo League of Legends
            stats: { kills: 1100, deaths: 720, assists: 1950, winRate: 70 }
          },
          {
            id: '4',
            name: 'Lisa Thompson',
            role: 'Player',
            experience: 2,
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            games: ['1', '2'], // League of Legends y Valorant
            stats: { kills: 850, deaths: 580, assists: 1650, winRate: 65 }
          },
          {
            id: '5',
            name: 'Juan Lopez',
            role: 'Player',
            experience: 6,
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
            games: ['1'], // Solo League of Legends
            stats: { kills: 1350, deaths: 920, assists: 2200, winRate: 75 }
          }
        ],
        suplentes: [
          {
            id: '6',
            name: 'Emma Williams',
            role: 'Player',
            experience: 3,
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
            games: ['2'], // Solo Valorant
            stats: { kills: 750, deaths: 520, assists: 1400, winRate: 62 }
          },
          {
            id: '7',
            name: 'Diego Perez',
            role: 'Player',
            experience: 4,
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
            games: ['1'], // Solo League of Legends
            stats: { kills: 920, deaths: 680, assists: 1700, winRate: 67 }
          }
        ]
      },
      gameRequirements: [
        {
          gameId: '1',
          gameName: 'League of Legends',
          titulares: 5,
          suplentes: 2,
          totalPlayers: 7,
          gameIcon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=50&h=50&fit=crop'
        },
        {
          gameId: '2',
          gameName: 'Valorant',
          titulares: 5,
          suplentes: 2,
          totalPlayers: 7,
          gameIcon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=50&h=50&fit=crop'
        }
      ],
      isActive: true,
      createdAt: '2024-01-15',
      totalMatches: 25,
      wins: 18,
      losses: 7,
      rank: 'Diamante',
      tier: 'I',
      points: 1850
    };
    setTeam(mockTeam);
  }, []);

  if (!hasTeam || !team) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-4 border-purple-500">
              <Users className="w-16 h-16 text-purple-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">No tienes un equipo creado</h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Crea tu primer equipo para comenzar a competir en torneos y mostrar tus habilidades
            </p>
          </div>

          <div className="space-y-6">
            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/worldGaming/equipos/crear', { state: { from: '/worldGaming/equipos/mi-equipo' } })}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg flex items-center justify-center space-x-3"
              >
                <Gamepad2 className="w-6 h-6" />
                <span>Crear Mi Equipo</span>
              </button>

              <button
                onClick={() => setShowJoinModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg flex items-center justify-center space-x-3"
              >
                <Users className="w-6 h-6" />
                <span>Unirse a un Equipo</span>
              </button>
              
              <button
                onClick={() => navigate('/worldGaming/equipos/solicitudes')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg flex items-center justify-center space-x-3"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Ver Solicitudes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                <div className="text-center">
                  <Gamepad2 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Crear Equipo</h3>
                  <p className="text-gray-400 text-sm">Forma tu propio equipo y sé el líder de tu comunidad gaming</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Unirse a Equipo</h3>
                  <p className="text-gray-400 text-sm">Encuentra un equipo existente y forma parte de su éxito</p>
                </div>
              </div>
            </div>

            <div className="text-gray-500 text-sm">
              <p>¿Necesitas ayuda? Consulta nuestra guía de equipos o contacta con nuestro soporte</p>
            </div>
          </div>
        </div>

        {/* Modal de Unirse a Equipo */}
        <JoinTeamModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onJoinTeam={handleJoinTeam}
        />
      </div>
    );
  }

  const winRate = ((team.wins / team.totalMatches) * 100).toFixed(1);
  const totalPlayers = team.players.titulares.length + team.players.suplentes.length;

  // Función para obtener colores según el juego
  const getGameColor = (gameId: string) => {
    switch (gameId) {
      case '1': // League of Legends
        return {
          background: 'from-blue-900 to-blue-800',
          border: 'border-blue-600',
          hoverBorder: 'border-blue-400',
          primary: 'text-blue-400',
          accent: 'bg-blue-600',
          badge: 'bg-blue-600'
        };
      case '2': // Valorant
        return {
          background: 'from-red-900 to-red-800',
          border: 'border-red-600',
          hoverBorder: 'border-red-400',
          primary: 'text-red-400',
          accent: 'bg-red-600',
          badge: 'bg-red-600'
        };
      case '3': // Counter-Strike
        return {
          background: 'from-orange-900 to-orange-800',
          border: 'border-orange-600',
          hoverBorder: 'border-orange-400',
          primary: 'text-orange-400',
          accent: 'bg-orange-600',
          badge: 'bg-orange-600'
        };
      case '4': // Dota 2
        return {
          background: 'from-green-900 to-green-800',
          border: 'border-green-600',
          hoverBorder: 'border-green-400',
          primary: 'text-green-400',
          accent: 'bg-green-600',
          badge: 'bg-green-600'
        };
      case '5': // Overwatch
        return {
          background: 'from-yellow-900 to-yellow-800',
          border: 'border-yellow-600',
          hoverBorder: 'border-yellow-400',
          primary: 'text-yellow-400',
          accent: 'bg-yellow-600',
          badge: 'bg-yellow-600'
        };
      default:
        return {
          background: 'from-gray-800 to-gray-900',
          border: 'border-gray-700',
          hoverBorder: 'border-purple-500',
          primary: 'text-purple-400',
          accent: 'bg-purple-600',
          badge: 'bg-purple-600'
        };
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, trend }: any) => (
    <div className={`bg-gradient-to-br ${color} p-8 rounded-2xl shadow-xl border border-gray-700`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-300 text-base font-medium">{title}</p>
          <p className="text-4xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`p-4 rounded-xl bg-white/10`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4">
          {trend > 0 ? (
            <ArrowUp className="w-5 h-5 text-green-400" />
          ) : trend < 0 ? (
            <ArrowDown className="w-5 h-5 text-red-400" />
          ) : (
            <Minus className="w-5 h-5 text-gray-400" />
          )}
          <span className={`text-base ml-2 ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
  );

  const PlayerCard = ({ player, isCaptain = false }: { player: Player; isCaptain?: boolean }) => {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={player.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
              alt={player.name}
              className="w-20 h-20 rounded-full border-3 border-gray-600"
            />
            {isCaptain && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1.5">
                <Crown className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-xl">{player.name}</h3>
            <p className="text-purple-400 text-base">{player.role}</p>
            <div className="flex items-center mt-3 space-x-6 text-sm text-gray-400">
              <span>Exp: {player.experience} años</span>
              <span>WR: {player.stats.winRate}%</span>
            </div>
            {/* Juegos que juega */}
            <div className="flex items-center mt-2 space-x-2">
              {player.games.map(gameId => {
                const game = team?.gameRequirements.find(g => g.gameId === gameId);
                const gameColorForBadge = getGameColor(gameId);
                return game ? (
                  <span key={gameId} className={`${gameColorForBadge.badge} text-white px-2 py-1 rounded-full text-xs`}>
                    {game.gameName}
                  </span>
                ) : null;
              })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-purple-400">{player.stats.kills}</div>
            <div className="text-sm text-gray-400">Kills</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Botón de demostración - Solo para testing */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setHasTeam(!hasTeam)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
        >
          {hasTeam ? 'Simular Sin Equipo' : 'Simular Con Equipo'}
        </button>
      </div>
      {/* Header con imagen de fondo */}
      <div className="relative h-[500px] bg-transparent overflow-hidden">

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-8">
            <div className="flex items-center space-x-12">
              <div className="relative">
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-56 h-56 rounded-3xl border-4 border-purple-500 shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-green-500 rounded-full p-2">
                  <div className="w-7 h-7 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <h1 className="text-7xl font-bold text-white">{team.name}</h1>
                  <button
                    onClick={handleOpenTeamSelector}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                    title="Cambiar equipo"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm">Cambiar</span>
                  </button>
                </div>
                <div className="flex items-center space-x-8">
                  <span className="bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-medium">
                    {team.tag}
                  </span>
                  <span className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-medium flex items-center">
                    <div className="w-4 h-4 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    Activo
                  </span>
                  <span className="bg-yellow-600 text-white px-6 py-3 rounded-full text-lg font-medium flex items-center">
                    <Trophy className="w-6 h-6 mr-3" />
                    {team.rank} {team.tier}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard
            icon={Trophy}
            title="Victorias"
            value={team.wins}
            color="from-green-600 to-green-700"
            trend={5.2}
          />
          <StatCard
            icon={Target}
            title="Win Rate"
            value={`${winRate}%`}
            color="from-blue-600 to-blue-700"
            trend={2.1}
          />
          <StatCard
            icon={Users}
            title="Jugadores"
            value={totalPlayers}
            color="from-purple-600 to-purple-700"
          />
          <StatCard
            icon={TrendingUp}
            title="Puntos"
            value={team.points}
            color="from-yellow-600 to-yellow-700"
            trend={8.5}
          />
        </div>

        {/* Tabs de navegación */}
        <div className="flex space-x-2 bg-gray-800 p-2 rounded-2xl mb-12">
          {[
            { id: 'overview', label: 'Vista General', icon: Eye },
            { id: 'players', label: 'Jugadores', icon: Users },
            { id: 'games', label: 'Juegos', icon: Gamepad2 },
            { id: 'stats', label: 'Estadísticas', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium text-base">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido de tabs */}
        {activeTab === 'overview' && (
          <div className="space-y-12 min-h-[600px]">
            {/* Descripción del equipo */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-purple-500" />
                Sobre el Equipo
              </h2>
              <p className="text-gray-300 leading-relaxed">{team.description}</p>
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Creado: {new Date(team.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  {team.totalMatches} partidas jugadas
                </span>
              </div>
            </div>

            {/* Últimos resultados */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
                Rendimiento Reciente
              </h2>
              <div className="grid grid-cols-5 gap-4">
                {['W', 'W', 'L', 'W', 'W'].map((result, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${result === 'W'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                      }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'players' && (
          <div className="space-y-12 min-h-[600px]">
            {/* Selector de Juego */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Gamepad2 className="w-6 h-6 mr-2 text-purple-500" />
                Seleccionar Juego
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedGame('all')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${selectedGame === 'all'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  Todos los Juegos
                </button>
                {team.gameRequirements.map((game) => {
                  const gameColor = getGameColor(game.gameId);
                  return (
                    <button
                      key={game.gameId}
                      onClick={() => setSelectedGame(game.gameId)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${selectedGame === game.gameId
                          ? `${gameColor.accent} text-white shadow-lg`
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                      <img
                        src={game.gameIcon || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=50&h=50&fit=crop'}
                        alt={game.gameName}
                        className="w-5 h-5 rounded"
                      />
                      <span>{game.gameName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jugadores según juego seleccionado */}
            {selectedGame === 'all' ? (
              <>
                {/* Titulares */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                    Titulares - Todos los Juegos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.players.titulares.map((player, index) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        isCaptain={index === 0}
                      />
                    ))}
                  </div>
                </div>

                {/* Suplentes */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <ShieldIcon className="w-6 h-6 mr-2 text-blue-500" />
                    Suplentes - Todos los Juegos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.players.suplentes.map((player) => (
                      <PlayerCard key={player.id} player={player} />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Titulares del juego seleccionado */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                    Titulares - {team.gameRequirements.find(g => g.gameId === selectedGame)?.gameName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.players.titulares
                      .filter(player => player.games.includes(selectedGame))
                      .map((player, index) => (
                        <PlayerCard
                          key={player.id}
                          player={player}
                          isCaptain={index === 0}
                        />
                      ))}
                    {team.players.titulares.filter(player => player.games.includes(selectedGame)).length === 0 && (
                      <div className="col-span-full flex items-center justify-center py-12">
                        <div className="text-center">
                          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 text-lg">No hay titulares para este juego</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suplentes del juego seleccionado */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <ShieldIcon className="w-6 h-6 mr-2 text-blue-500" />
                    Suplentes - {team.gameRequirements.find(g => g.gameId === selectedGame)?.gameName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.players.suplentes
                      .filter(player => player.games.includes(selectedGame))
                      .map((player) => (
                        <PlayerCard key={player.id} player={player} />
                      ))}
                    {team.players.suplentes.filter(player => player.games.includes(selectedGame)).length === 0 && (
                      <div className="col-span-full flex items-center justify-center py-12">
                        <div className="text-center">
                          <ShieldIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400 text-lg">No hay suplentes para este juego</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'games' && (
          <div className="space-y-8 min-h-[600px]">
            {team.gameRequirements.map((game) => (
              <div key={game.gameId} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={game.gameIcon || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=50&h=50&fit=crop'}
                      alt={game.gameName}
                      className="w-12 h-12 rounded-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">{game.gameName}</h3>
                      <p className="text-gray-400">Capacidad: {game.totalPlayers} jugadores</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-500">{game.titulares}</div>
                    <div className="text-sm text-gray-400">Titulares</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-400">
                  <span>Suplentes: {game.suplentes}</span>
                  <span>Total: {game.totalPlayers}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-12 min-h-[600px]">
            {/* Estadísticas detalladas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Estadísticas Generales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Partidas Jugadas</span>
                    <span className="text-white font-semibold">{team.totalMatches}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Victorias</span>
                    <span className="text-green-400 font-semibold">{team.wins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Derrotas</span>
                    <span className="text-red-400 font-semibold">{team.losses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-purple-400 font-semibold">{winRate}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Ranking</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rango Actual</span>
                    <span className="text-yellow-400 font-semibold">{team.rank} {team.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Puntos</span>
                    <span className="text-purple-400 font-semibold">{team.points}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estado</span>
                    <span className="text-green-400 font-semibold">Activo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico de rendimiento */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Rendimiento Mensual</h3>
              <div className="h-64 flex items-end justify-center space-x-2">
                {[65, 72, 68, 75, 80, 78, 82, 85, 88, 90, 87, 92].map((value, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t"
                      style={{ height: `${value * 2}px` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-2">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Selector Modal */}
      <TeamSelector
        isOpen={showTeamSelector}
        onClose={() => setShowTeamSelector(false)}
        onSelectTeam={handleTeamSelect}
        currentTeam={team}
      />
    </div>
  );
};

export default MiEquipo;
