import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Star,
  Crown,
  Target,
  Users,
  Heart,
  Badge,
  CheckCircle,
  Lock,
  Unlock,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'tournament' | 'participation' | 'social' | 'skill' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
  requirements: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
}

interface UserStats {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  badgesUnlocked: number;
  totalBadges: number;
  rank: string;
  streak: number;
}

const AchievementSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges' | 'stats'>('achievements');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock user stats
  const userStats: UserStats = {
    level: 42,
    experience: 15420,
    experienceToNext: 20000,
    totalPoints: 2847,
    achievementsUnlocked: 23,
    totalAchievements: 45,
    badgesUnlocked: 8,
    totalBadges: 12,
    rank: 'Elite',
    streak: 15
  };

  // Mock achievements
  const achievements: Achievement[] = [
    {
      id: '1',
      name: 'Primera Victoria',
      description: 'Gana tu primer torneo',
      icon: '🏆',
      category: 'tournament',
      rarity: 'common',
      points: 50,
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      requirements: ['Ganar 1 torneo']
    },
    {
      id: '2',
      name: 'Campeón Invicto',
      description: 'Gana 10 torneos sin perder',
      icon: '👑',
      category: 'tournament',
      rarity: 'legendary',
      points: 500,
      unlocked: false,
      progress: { current: 7, required: 10 },
      requirements: ['Ganar 10 torneos consecutivos']
    },
    {
      id: '3',
      name: 'Participante Activo',
      description: 'Participa en 50 torneos',
      icon: '🎮',
      category: 'participation',
      rarity: 'rare',
      points: 200,
      unlocked: true,
      unlockedAt: new Date('2024-02-20'),
      requirements: ['Participar en 50 torneos']
    },
    {
      id: '4',
      name: 'Líder de Equipo',
      description: 'Crea y lidera un equipo exitoso',
      icon: '👥',
      category: 'social',
      rarity: 'epic',
      points: 300,
      unlocked: false,
      progress: { current: 0, required: 1 },
      requirements: ['Crear un equipo', 'Ganar 5 torneos con el equipo']
    },
    {
      id: '5',
      name: 'Maestro del Tiempo',
      description: 'Juega durante 100 días consecutivos',
      icon: '⏰',
      category: 'participation',
      rarity: 'epic',
      points: 400,
      unlocked: false,
      progress: { current: 67, required: 100 },
      requirements: ['Jugar 100 días consecutivos']
    },
    {
      id: '6',
      name: 'Estratega Supremo',
      description: 'Gana torneos en 5 juegos diferentes',
      icon: '🧠',
      category: 'skill',
      rarity: 'legendary',
      points: 600,
      unlocked: false,
      progress: { current: 3, required: 5 },
      requirements: ['Ganar torneos en 5 juegos diferentes']
    }
  ];

  // Mock badges
  const badges: Badge[] = [
    {
      id: '1',
      name: 'Novato',
      description: 'Completa tu primer torneo',
      icon: '🥉',
      tier: 'bronze',
      unlocked: true,
      unlockedAt: new Date('2024-01-10')
    },
    {
      id: '2',
      name: 'Competidor',
      description: 'Participa en 25 torneos',
      icon: '🥈',
      tier: 'silver',
      unlocked: true,
      unlockedAt: new Date('2024-03-15')
    },
    {
      id: '3',
      name: 'Veterano',
      description: 'Participa en 100 torneos',
      icon: '🥇',
      tier: 'gold',
      unlocked: false,
      progress: { current: 67, required: 100 }
    },
    {
      id: '4',
      name: 'Maestro',
      description: 'Gana 50 torneos',
      icon: '💎',
      tier: 'diamond',
      unlocked: false,
      progress: { current: 23, required: 50 }
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 border-gray-500/30';
      case 'rare': return 'bg-blue-500/20 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 border-purple-500/30';
      case 'legendary': return 'bg-orange-500/20 border-orange-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-500';
      case 'platinum': return 'text-cyan-400';
      case 'diamond': return 'text-blue-500';
      default: return 'text-gray-400';
    }
  };

  const getTierBg = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-500/20 border-amber-500/30';
      case 'silver': return 'bg-gray-500/20 border-gray-500/30';
      case 'gold': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'platinum': return 'bg-cyan-500/20 border-cyan-500/30';
      case 'diamond': return 'bg-blue-500/20 border-blue-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tournament': return <Trophy className="h-4 w-4" />;
      case 'participation': return <Users className="h-4 w-4" />;
      case 'social': return <Heart className="h-4 w-4" />;
      case 'skill': return <Target className="h-4 w-4" />;
      case 'special': return <Star className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true;
    return achievement.category === selectedCategory;
  });

  const experiencePercentage = (userStats.experience / userStats.experienceToNext) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Sistema de Logros</h1>
          <p className="text-white/80 mt-1">Desbloquea logros y badges para mostrar tu progreso</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userStats.level}</div>
            <div className="text-xs text-white/60">Nivel</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{userStats.totalPoints}</div>
            <div className="text-xs text-white/60">Puntos</div>
          </div>
        </div>
      </div>

      {/* User Stats Overview */}
      <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Level Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Nivel {userStats.level}</span>
              <span className="text-white text-sm">{userStats.experience}/{userStats.experienceToNext} XP</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${experiencePercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-white/60">Racha: {userStats.streak} días</span>
            </div>
          </div>

          {/* Achievements Progress */}
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{userStats.achievementsUnlocked}/{userStats.totalAchievements}</div>
            <div className="text-sm text-white/60">Logros Desbloqueados</div>
            <div className="mt-2 w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(userStats.achievementsUnlocked / userStats.totalAchievements) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Badges Progress */}
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{userStats.badgesUnlocked}/{userStats.totalBadges}</div>
            <div className="text-sm text-white/60">Badges Desbloqueados</div>
            <div className="mt-2 w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(userStats.badgesUnlocked / userStats.totalBadges) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Rank */}
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{userStats.rank}</div>
            <div className="text-sm text-white/60">Rango Actual</div>
            <div className="flex justify-center mt-2">
              <Crown className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/5 backdrop-blur-lg p-2 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex space-x-2">
          {[
            { id: 'achievements', label: 'Logros', icon: Trophy },
            { id: 'badges', label: 'Badges', icon: Badge },
            { id: 'stats', label: 'Estadísticas', icon: BarChart3 }
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

      {/* Content */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10 shadow-lg">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'Todos', icon: Award },
                { key: 'tournament', label: 'Torneos', icon: Trophy },
                { key: 'participation', label: 'Participación', icon: Users },
                { key: 'social', label: 'Social', icon: Heart },
                { key: 'skill', label: 'Habilidad', icon: Target },
                { key: 'special', label: 'Especiales', icon: Star }
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.key
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-6 rounded-2xl border transition-all duration-200 ${
                  achievement.unlocked 
                    ? getRarityBg(achievement.rarity)
                    : 'bg-white/5 border-white/10 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex items-center gap-2">
                    {achievement.unlocked ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-white/40" />
                    )}
                    <span className={`text-sm font-semibold ${getRarityColor(achievement.rarity)}`}>
                      {achievement.rarity.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{achievement.name}</h3>
                <p className="text-white/60 text-sm mb-4">{achievement.description}</p>

                {achievement.progress && !achievement.unlocked && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-white/60 mb-1">
                      <span>Progreso</span>
                      <span>{achievement.progress.current}/{achievement.progress.required}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress.current / achievement.progress.required) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-white/60">{achievement.points} puntos</span>
                  </div>
                  {achievement.unlockedAt && (
                    <span className="text-xs text-white/40">
                      {achievement.unlockedAt.toLocaleDateString('es-ES')}
                    </span>
                  )}
                </div>

                {achievement.requirements && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-white/40 mb-2">Requisitos:</p>
                    <ul className="space-y-1">
                      {achievement.requirements.map((req, index) => (
                        <li key={index} className="text-xs text-white/60 flex items-center gap-1">
                          <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-6 rounded-2xl border transition-all duration-200 ${
                badge.unlocked 
                  ? getTierBg(badge.tier)
                  : 'bg-white/5 border-white/10 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{badge.icon}</div>
                <div className="flex items-center gap-2">
                  {badge.unlocked ? (
                    <Unlock className="h-5 w-5 text-green-500" />
                  ) : (
                    <Lock className="h-5 w-5 text-white/40" />
                  )}
                  <span className={`text-sm font-semibold ${getTierColor(badge.tier)}`}>
                    {badge.tier.toUpperCase()}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{badge.name}</h3>
              <p className="text-white/60 text-sm mb-4">{badge.description}</p>

              {badge.progress && !badge.unlocked && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white/60 mb-1">
                    <span>Progreso</span>
                    <span>{badge.progress.current}/{badge.progress.required}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {badge.unlockedAt && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Calendar className="h-3 w-3" />
                  Desbloqueado el {badge.unlockedAt.toLocaleDateString('es-ES')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Estadísticas Generales</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Torneos Jugados</span>
                <span className="text-white font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Victorias</span>
                <span className="text-white font-semibold">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Win Rate</span>
                <span className="text-white font-semibold">57.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Mejor Racha</span>
                <span className="text-white font-semibold">12</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Progreso Mensual</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Torneos Este Mes</span>
                <span className="text-white font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">XP Ganado</span>
                <span className="text-white font-semibold">+2,450</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Logros Desbloqueados</span>
                <span className="text-white font-semibold">+5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Días Activos</span>
                <span className="text-white font-semibold">28/30</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Ranking</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Posición Global</span>
                <span className="text-white font-semibold">#1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">En tu Región</span>
                <span className="text-white font-semibold">#89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">En tu Categoría</span>
                <span className="text-white font-semibold">#23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Puntos para Siguiente</span>
                <span className="text-white font-semibold">+153</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementSystem;
