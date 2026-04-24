import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  TrendingUp,
  Users,
  Target,
  Filter,
  Search,
  RefreshCw,
  BarChart3,
  Award,
  Star,
  Crown,
  Zap
} from 'lucide-react';
import { useColorPalette } from '../../shared/contexts/ColorPaletteContext';

interface Player {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  points: number;
  wins: number;
  losses: number;
  winRate: number;
  gamesPlayed: number;
  bestGame: string;
  streak: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster';
  badges: string[];
}

interface Team {
  id: string;
  name: string;
  logo: string;
  rank: number;
  points: number;
  members: number;
  wins: number;
  losses: number;
  winRate: number;
  tournaments: number;
  bestTournament: string;
}

interface GameStats {
  game: string;
  totalPlayers: number;
  totalTournaments: number;
  averagePrize: number;
  topPlayer: string;
  topTeam: string;
}

const RankingsPage: React.FC = () => {
  const { currentPalette } = useColorPalette();
  const [activeTab, setActiveTab] = useState<'players' | 'teams' | 'games'>('players');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('rank');

  // Mock data
  const players: Player[] = [
    {
      id: '1',
      name: 'ProGamer123',
      avatar: '/api/placeholder/40/40',
      rank: 1,
      points: 2847,
      wins: 156,
      losses: 23,
      winRate: 87.2,
      gamesPlayed: 179,
      bestGame: 'Counter-Strike 2',
      streak: 12,
      tier: 'grandmaster',
      badges: ['Champion', 'MVP', 'Unstoppable']
    },
    {
      id: '2',
      name: 'ElitePlayer',
      avatar: '/api/placeholder/40/40',
      rank: 2,
      points: 2756,
      wins: 142,
      losses: 31,
      winRate: 82.1,
      gamesPlayed: 173,
      bestGame: 'Valorant',
      streak: 8,
      tier: 'grandmaster',
      badges: ['Champion', 'Consistent']
    },
    {
      id: '3',
      name: 'GamingMaster',
      avatar: '/api/placeholder/40/40',
      rank: 3,
      points: 2689,
      wins: 134,
      losses: 28,
      winRate: 82.7,
      gamesPlayed: 162,
      bestGame: 'League of Legends',
      streak: 15,
      tier: 'master',
      badges: ['MVP', 'Rising Star']
    }
  ];

  const teams: Team[] = [
    {
      id: '1',
      name: 'Team Alpha',
      logo: '/api/placeholder/40/40',
      rank: 1,
      points: 3256,
      members: 5,
      wins: 89,
      losses: 12,
      winRate: 88.1,
      tournaments: 15,
      bestTournament: 'World Championship 2024'
    },
    {
      id: '2',
      name: 'Elite Squad',
      logo: '/api/placeholder/40/40',
      rank: 2,
      points: 3156,
      members: 5,
      wins: 85,
      losses: 18,
      winRate: 82.5,
      tournaments: 14,
      bestTournament: 'Pro League Finals'
    }
  ];

  const gameStats: GameStats[] = [
    {
      game: 'Counter-Strike 2',
      totalPlayers: 15420,
      totalTournaments: 156,
      averagePrize: 2500,
      topPlayer: 'ProGamer123',
      topTeam: 'Team Alpha'
    },
    {
      game: 'Valorant',
      totalPlayers: 12890,
      totalTournaments: 134,
      averagePrize: 1800,
      topPlayer: 'ElitePlayer',
      topTeam: 'Elite Squad'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-500';
      case 'platinum': return 'text-cyan-400';
      case 'diamond': return 'text-blue-500';
      case 'master': return 'text-purple-500';
      case 'grandmaster': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'grandmaster': return <Crown className="h-4 w-4" />;
      case 'master': return <Star className="h-4 w-4" />;
      case 'diamond': return <Award className="h-4 w-4" />;
      default: return <Medal className="h-4 w-4" />;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-white/60">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Rankings & Estadísticas</h1>
          <p className="text-white/80 mt-1">Clasificaciones y análisis de rendimiento</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reporte Completo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-lg p-2 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex space-x-2">
          {[
            { id: 'players', label: 'Jugadores', icon: Users },
            { id: 'teams', label: 'Equipos', icon: Trophy },
            { id: 'games', label: 'Juegos', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Buscar jugadores, equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
            />
          </div>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
          >
            <option value="all">Todos los Juegos</option>
            <option value="cs2">Counter-Strike 2</option>
            <option value="valorant">Valorant</option>
            <option value="lol">League of Legends</option>
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="season">Esta Temporada</option>
            <option value="all">Todo el Tiempo</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
          >
            <option value="rank">Por Ranking</option>
            <option value="points">Por Puntos</option>
            <option value="winRate">Por Win Rate</option>
            <option value="streak">Por Racha</option>
          </select>
        </div>
      </div>

      {/* Contenido de Rankings */}
      {activeTab === 'players' && (
        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={player.id} className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(player.rank)}
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{player.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{player.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-medium ${getTierColor(player.tier)}`}>
                        {player.tier.toUpperCase()}
                      </span>
                      {getTierIcon(player.tier)}
                      <span className="text-sm text-white/60">• {player.bestGame}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{player.points}</div>
                    <div className="text-xs text-white/60">Puntos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{player.winRate}%</div>
                    <div className="text-xs text-white/60">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">{player.streak}</div>
                    <div className="text-xs text-white/60">Racha</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {player.badges.map((badge, badgeIndex) => (
                      <div key={badgeIndex} className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-400">
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(team.rank)}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{team.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-white/60">{team.members} miembros</span>
                      <span className="text-sm text-white/60">• {team.tournaments} torneos</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{team.points}</div>
                    <div className="text-xs text-white/60">Puntos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{team.winRate}%</div>
                    <div className="text-xs text-white/60">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">{team.wins}-{team.losses}</div>
                    <div className="text-xs text-white/60">Récord</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'games' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameStats.map((game) => (
            <div key={game.game} className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{game.game}</h3>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Jugadores</span>
                  <span className="text-white font-semibold">{game.totalPlayers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Torneos</span>
                  <span className="text-white font-semibold">{game.totalTournaments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Premio Promedio</span>
                  <span className="text-white font-semibold">${game.averagePrize.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs text-white/60 mb-1">Mejor Jugador</div>
                  <div className="text-sm text-white font-medium">{game.topPlayer}</div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Mejor Equipo</div>
                  <div className="text-sm text-white font-medium">{game.topTeam}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Jugadores</p>
              <p className="text-2xl font-bold text-white">28,456</p>
            </div>
            <Users className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Torneos Activos</p>
              <p className="text-2xl font-bold text-white">47</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Premio Total</p>
              <p className="text-2xl font-bold text-white">$125K</p>
            </div>
            <Award className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Crecimiento</p>
              <p className="text-2xl font-bold text-green-400">+23%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsPage;
