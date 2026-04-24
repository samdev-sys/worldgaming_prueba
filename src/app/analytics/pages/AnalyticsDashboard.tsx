import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Trophy,
  DollarSign,
  Calendar,
  Target,
  Activity,
  Download,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  tournaments: {
    total: number;
    active: number;
    completed: number;
    upcoming: number;
  };
  participants: {
    total: number;
    newThisMonth: number;
    active: number;
    growth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    growth: number;
    averagePerTournament: number;
  };
  engagement: {
    averageParticipation: number;
    completionRate: number;
    satisfactionScore: number;
    retentionRate: number;
  };
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [showRevenue, setShowRevenue] = useState(true);

  // Mock data
  const analyticsData: AnalyticsData = {
    tournaments: {
      total: 156,
      active: 23,
      completed: 128,
      upcoming: 5
    },
    participants: {
      total: 28456,
      newThisMonth: 1247,
      active: 8923,
      growth: 23.5
    },
    revenue: {
      total: 125000,
      thisMonth: 15420,
      growth: 18.7,
      averagePerTournament: 801
    },
    engagement: {
      averageParticipation: 87.3,
      completionRate: 94.2,
      satisfactionScore: 4.6,
      retentionRate: 78.9
    }
  };

  // Chart data
  const monthlyData = [
    { month: 'Ene', tournaments: 12, participants: 2100, revenue: 8500 },
    { month: 'Feb', tournaments: 15, participants: 2400, revenue: 9200 },
    { month: 'Mar', tournaments: 18, participants: 2800, revenue: 11000 },
    { month: 'Abr', tournaments: 22, participants: 3200, revenue: 12800 },
    { month: 'May', tournaments: 25, participants: 3600, revenue: 14200 },
    { month: 'Jun', tournaments: 28, participants: 4100, revenue: 15800 },
    { month: 'Jul', tournaments: 32, participants: 4600, revenue: 17500 },
    { month: 'Ago', tournaments: 35, participants: 5200, revenue: 19200 },
    { month: 'Sep', tournaments: 38, participants: 5800, revenue: 21000 },
    { month: 'Oct', tournaments: 42, participants: 6500, revenue: 22800 },
    { month: 'Nov', tournaments: 45, participants: 7200, revenue: 24700 },
    { month: 'Dic', tournaments: 48, participants: 8000, revenue: 26700 }
  ];

  const gameDistribution = [
    { name: 'Counter-Strike 2', value: 35, color: '#FF6B35' },
    { name: 'Valorant', value: 28, color: '#FF4655' },
    { name: 'League of Legends', value: 22, color: '#C89B3C' },
    { name: 'Fortnite', value: 15, color: '#00D4FF' }
  ];

  const tournamentTypes = [
    { name: 'Single Elimination', value: 45, color: '#FF6B35' },
    { name: 'Double Elimination', value: 30, color: '#4ECDC4' },
    { name: 'Round Robin', value: 15, color: '#45B7D1' },
    { name: 'Swiss System', value: 10, color: '#96CEB4' }
  ];

  const participationTrend = [
    { day: 'Lun', participants: 1200, matches: 45 },
    { day: 'Mar', participants: 1350, matches: 52 },
    { day: 'Mié', participants: 1100, matches: 38 },
    { day: 'Jue', participants: 1450, matches: 58 },
    { day: 'Vie', participants: 1600, matches: 65 },
    { day: 'Sáb', participants: 1800, matches: 72 },
    { day: 'Dom', participants: 1400, matches: 55 }
  ];

  const COLORS = ['#FF6B35', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard de Análisis</h1>
          <p className="text-white/80 mt-1">Estadísticas y métricas de rendimiento</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200"
          >
            <option value="week">Esta Semana</option>
            <option value="month">Este Mes</option>
            <option value="quarter">Este Trimestre</option>
            <option value="year">Este Año</option>
          </select>
          <button className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Torneos</p>
              <p className="text-3xl font-bold text-white">{formatNumber(analyticsData.tournaments.total)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-green-400">+12.5%</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <Trophy className="h-12 w-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Participantes</p>
              <p className="text-3xl font-bold text-white">{formatNumber(analyticsData.participants.total)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-green-400">+{analyticsData.participants.growth}%</span>
                {getGrowthIcon(analyticsData.participants.growth)}
              </div>
            </div>
            <Users className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Ingresos Totales</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(analyticsData.revenue.total)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-green-400">+{analyticsData.revenue.growth}%</span>
                {getGrowthIcon(analyticsData.revenue.growth)}
              </div>
            </div>
            <DollarSign className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Tasa de Retención</p>
              <p className="text-3xl font-bold text-white">{analyticsData.engagement.retentionRate}%</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-green-400">+5.2%</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <Activity className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Tendencias Mensuales</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRevenue(!showRevenue)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  showRevenue ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-white/60'
                }`}
              >
                {showRevenue ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="month" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="tournaments" 
                stroke="#FF6B35" 
                strokeWidth={2}
                name="Torneos"
              />
              <Line 
                type="monotone" 
                dataKey="participants" 
                stroke="#4ECDC4" 
                strokeWidth={2}
                name="Participantes"
              />
              {showRevenue && (
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#45B7D1" 
                  strokeWidth={2}
                  name="Ingresos"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Game Distribution */}
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Distribución por Juegos</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gameDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {gameDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participation by Day */}
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Participación por Día</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={participationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="day" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend />
              <Bar dataKey="participants" fill="#FF6B35" name="Participantes" />
              <Bar dataKey="matches" fill="#4ECDC4" name="Partidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tournament Types */}
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Tipos de Torneos</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tournamentTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tournamentTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Torneos Activos</p>
            <p className="text-2xl font-bold text-white">{analyticsData.tournaments.active}</p>
            <div className="mt-2 w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${(analyticsData.tournaments.active / analyticsData.tournaments.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Nuevos Participantes</p>
            <p className="text-2xl font-bold text-white">{formatNumber(analyticsData.participants.newThisMonth)}</p>
            <p className="text-sm text-green-400 mt-1">Este mes</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Ingresos del Mes</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(analyticsData.revenue.thisMonth)}</p>
            <p className="text-sm text-green-400 mt-1">+{analyticsData.revenue.growth}% vs mes anterior</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Satisfacción</p>
            <p className="text-2xl font-bold text-white">{analyticsData.engagement.satisfactionScore}/5.0</p>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-500">★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
