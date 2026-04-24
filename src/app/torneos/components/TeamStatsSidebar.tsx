import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ArrowLeft,
  X,
  BarChart3,
  Users,
  Target,
  Award,
  Clock
} from 'lucide-react';

interface Match {
  id: number;
  opponent: string;
  result: 'W' | 'L' | 'D';
  score: string;
  date: string;
  map: string;
  mvp: string;
}

interface PlayerStats {
  name: string;
  points: number;
  kills: number;
  assists: number;
  kda: number;
}

interface MatchDetails {
  id: string;
  team1: string;
  team2: string;
  score: string;
  date: string;
  map: string;
  mvp: string;
  status: 'completed' | 'pending' | 'cancelled';
  team1Stats: PlayerStats[];
  team2Stats: PlayerStats[];
  detailedStats: {
    team1Points: number;
    team2Points: number;
    team1MapDifference: number;
    team2MapDifference: number;
    team1RoundDifference: number;
    team2RoundDifference: number;
  };
}

interface TeamStatsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentName: string;
  initialTeam?: string; // Nuevo prop para el equipo seleccionado inicialmente
  showBackButton?: boolean; // Prop para controlar si mostrar el botón de volver
}

const TeamStatsSidebar: React.FC<TeamStatsSidebarProps> = ({
  isOpen,
  onClose,
  tournamentName,
  initialTeam,
  showBackButton = true
}) => {
  console.log('=== DEBUG: TeamStatsSidebar component executed ===');
  console.log('=== DEBUG: TeamStatsSidebar render ===');
  console.log('isOpen:', isOpen);
  console.log('tournamentName:', tournamentName);
  
  const [showTeamDetails, setShowTeamDetails] = useState(!!initialTeam);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(initialTeam || null);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchDetails | null>(null);
  const [activePlayerTab, setActivePlayerTab] = useState<'team1' | 'team2'>('team1');

  // Actualizar el equipo seleccionado cuando cambie initialTeam
  useEffect(() => {
    if (initialTeam) {
      setSelectedTeam(initialTeam);
      setShowTeamDetails(true);
    }
  }, [initialTeam]);

  // Datos mock para el ranking general
  const getDetailedStats = () => {
    return [
      { team: 'Estral Esports', rank: 1, wins: 15, losses: 2, trend: 'up' },
      { team: 'Timbers Esports', rank: 2, wins: 14, losses: 3, trend: 'up' },
      { team: 'Atheris Esports', rank: 3, wins: 13, losses: 4, trend: 'down' },
      { team: 'Pixel Esports', rank: 4, wins: 12, losses: 5, trend: 'up' },
      { team: 'Chivas Esports', rank: 5, wins: 11, losses: 6, trend: 'down' },
      { team: 'Infinity Esports', rank: 6, wins: 10, losses: 7, trend: 'up' },
      { team: 'Mexico Esports Team', rank: 7, wins: 8, losses: 9, trend: 'up' },
    ];
  };

  // Datos mock para los partidos de cada equipo
  const getTeamMatches = (teamName: string) => {
    const matchesData = {
      'Estral Esports': [
        { id: 1, opponent: 'Timbers Esports', result: 'W', score: '3-1', date: '2024-03-15', map: 'Dust2', mvp: 'Alex "ProGamer" Rodriguez' },
        { id: 2, opponent: 'Atheris Esports', result: 'W', score: '2-1', date: '2024-03-18', map: 'Mirage', mvp: 'Lisa "NeonQueen" Thompson' },
        { id: 3, opponent: 'Pixel Esports', result: 'W', score: '3-0', date: '2024-03-20', map: 'Inferno', mvp: 'Juan "DragonSlayer" Lopez' },
        { id: 4, opponent: 'Chivas Esports', result: 'W', score: '2-1', date: '2024-03-22', map: 'Overpass', mvp: 'Isabella "StarGazer" Moore' },
        { id: 5, opponent: 'Infinity Esports', result: 'W', score: '3-2', date: '2024-03-25', map: 'Nuke', mvp: 'Alex "ProGamer" Rodriguez' },
      ],
      'Timbers Esports': [
        { id: 1, opponent: 'Estral Esports', result: 'L', score: '1-3', date: '2024-03-15', map: 'Dust2', mvp: 'Sarah "QueenSlayer" Chen' },
        { id: 2, opponent: 'Atheris Esports', result: 'W', score: '3-1', date: '2024-03-17', map: 'Mirage', mvp: 'Carlos "ViperStrike" Garcia' },
        { id: 3, opponent: 'Pixel Esports', result: 'W', score: '2-1', date: '2024-03-19', map: 'Inferno', mvp: 'Sophie "MysticMage" Taylor' },
        { id: 4, opponent: 'Chivas Esports', result: 'W', score: '3-0', date: '2024-03-21', map: 'Overpass', mvp: 'Diego "RageQuit" Perez' },
        { id: 5, opponent: 'Infinity Esports', result: 'W', score: '2-1', date: '2024-03-24', map: 'Nuke', mvp: 'Sarah "QueenSlayer" Chen' },
      ],
      'Atheris Esports': [
        { id: 1, opponent: 'Estral Esports', result: 'L', score: '1-2', date: '2024-03-18', map: 'Mirage', mvp: 'Mike "ShadowKiller" Johnson' },
        { id: 2, opponent: 'Timbers Esports', result: 'L', score: '1-3', date: '2024-03-17', map: 'Mirage', mvp: 'Anna "PixelPrincess" Davis' },
        { id: 3, opponent: 'Pixel Esports', result: 'W', score: '3-2', date: '2024-03-20', map: 'Inferno', mvp: 'Roberto "StealthNinja" Hernandez' },
        { id: 4, opponent: 'Chivas Esports', result: 'W', score: '2-1', date: '2024-03-23', map: 'Overpass', mvp: 'Rachel "LuckyShot" Clark' },
        { id: 5, opponent: 'Infinity Esports', result: 'L', score: '1-3', date: '2024-03-26', map: 'Nuke', mvp: 'Mike "ShadowKiller" Johnson' },
      ],
      'Pixel Esports': [
        { id: 1, opponent: 'Estral Esports', result: 'L', score: '0-3', date: '2024-03-20', map: 'Inferno', mvp: 'Emma "FrostByte" Williams' },
        { id: 2, opponent: 'Timbers Esports', result: 'L', score: '1-2', date: '2024-03-19', map: 'Inferno', mvp: 'James "ThunderBolt" Wilson' },
        { id: 3, opponent: 'Atheris Esports', result: 'L', score: '2-3', date: '2024-03-20', map: 'Inferno', mvp: 'Natalie "PhoenixRise" Anderson' },
        { id: 4, opponent: 'Chivas Esports', result: 'W', score: '3-1', date: '2024-03-22', map: 'Overpass', mvp: 'Lucas "NoobSlayer" White' },
        { id: 5, opponent: 'Infinity Esports', result: 'W', score: '2-1', date: '2024-03-25', map: 'Nuke', mvp: 'Emma "FrostByte" Williams' },
      ],
      'Chivas Esports': [
        { id: 1, opponent: 'Estral Esports', result: 'L', score: '1-2', date: '2024-03-22', map: 'Overpass', mvp: 'David "CyberWolf" Martinez' },
        { id: 2, opponent: 'Timbers Esports', result: 'L', score: '0-3', date: '2024-03-21', map: 'Overpass', mvp: 'Maria "CrystalEyes" Brown' },
        { id: 3, opponent: 'Atheris Esports', result: 'L', score: '1-2', date: '2024-03-23', map: 'Overpass', mvp: 'Kevin "BlitzMaster" Lee' },
        { id: 4, opponent: 'Pixel Esports', result: 'L', score: '1-3', date: '2024-03-22', map: 'Overpass', mvp: 'David "CyberWolf" Martinez' },
        { id: 5, opponent: 'Infinity Esports', result: 'L', score: '1-2', date: '2024-03-27', map: 'Nuke', mvp: 'Maria "CrystalEyes" Brown' },
      ],
      'Infinity Esports': [
        { id: 1, opponent: 'Estral Esports', result: 'L', score: '2-3', date: '2024-03-25', map: 'Nuke', mvp: 'Tú' },
        { id: 2, opponent: 'Timbers Esports', result: 'L', score: '1-2', date: '2024-03-24', map: 'Nuke', mvp: 'Tú' },
        { id: 3, opponent: 'Atheris Esports', result: 'W', score: '3-1', date: '2024-03-26', map: 'Nuke', mvp: 'Tú' },
        { id: 4, opponent: 'Pixel Esports', result: 'L', score: '1-2', date: '2024-03-25', map: 'Nuke', mvp: 'Tú' },
        { id: 5, opponent: 'Chivas Esports', result: 'W', score: '2-1', date: '2024-03-27', map: 'Nuke', mvp: 'Tú' },
      ],
      'Mexico Esports Team': [
        { id: 1, opponent: 'Estral Esports', result: 'L', score: '0-3', date: '2024-03-28', map: 'Dust2', mvp: 'Carlos "Mexicano" Lopez' },
        { id: 2, opponent: 'Timbers Esports', result: 'L', score: '1-2', date: '2024-03-29', map: 'Mirage', mvp: 'Ana "Mexicana" Garcia' },
        { id: 3, opponent: 'Atheris Esports', result: 'L', score: '1-3', date: '2024-03-30', map: 'Inferno', mvp: 'Luis "Mexicano" Rodriguez' },
        { id: 4, opponent: 'Pixel Esports', result: 'L', score: '0-2', date: '2024-03-31', map: 'Overpass', mvp: 'Maria "Mexicana" Hernandez' },
        { id: 5, opponent: 'Chivas Esports', result: 'L', score: '1-2', date: '2024-04-01', map: 'Nuke', mvp: 'Jose "Mexicano" Martinez' },
      ]
    };
    return matchesData[teamName as keyof typeof matchesData] || [];
  };

  const handleTeamClick = (teamName: string) => {
    setSelectedTeam(teamName);
    setShowTeamDetails(true);
  };

  const goBackToRanking = () => {
    setShowTeamDetails(false);
    setSelectedTeam(null);
  };

  const handleClose = () => {
    setShowTeamDetails(false);
    setSelectedTeam(null);
    onClose();
  };

  const handleMatchClick = (match: Match) => {
    // Generar datos detallados del partido basados en el match básico
    const matchDetails: MatchDetails = {
      id: match.id.toString(),
      team1: selectedTeam || '',
      team2: match.opponent,
      score: match.score,
      date: match.date,
      map: match.map,
      mvp: match.mvp,
      status: match.result === 'W' || match.result === 'L' ? 'completed' : 'pending',
      team1Stats: [
        { name: 'Player1', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 },
        { name: 'Player2', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 },
        { name: 'Player3', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 },
        { name: 'Player4', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 },
        { name: 'Player5', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 }
      ],
      team2Stats: [
        { name: 'Player1', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 },
        { name: 'Player2', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 },
        { name: 'Player3', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 },
        { name: 'Player4', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 },
        { name: 'Player5', points: Math.floor(Math.random() * 25) + 5, kills: Math.floor(Math.random() * 15) + 3, assists: Math.floor(Math.random() * 10) + 1, kda: Math.random() * 3 + 0.5 }
      ],
      detailedStats: {
        team1Points: Math.floor(Math.random() * 50) + 20,
        team2Points: Math.floor(Math.random() * 50) + 20,
        team1MapDifference: Math.floor(Math.random() * 10) - 5,
        team2MapDifference: Math.floor(Math.random() * 10) - 5,
        team1RoundDifference: Math.floor(Math.random() * 20) - 10,
        team2RoundDifference: Math.floor(Math.random() * 20) - 10
      }
    };
    
    setSelectedMatch(matchDetails);
    setShowMatchDetails(true);
  };

  const goBackToTeamMatches = () => {
    setShowMatchDetails(false);
    setSelectedMatch(null);
  };

  // Solo renderizar si está abierto
  if (!isOpen) {
    console.log('=== DEBUG: TeamStatsSidebar not rendering (isOpen: false) ===');
    return null;
  }

  console.log('=== DEBUG: TeamStatsSidebar rendering content ===');
  
  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-l border-white/20 shadow-2xl transition-all duration-300 transform translate-x-0 z-[60]">
      <div className="p-6">
        
        {/* Header del panel */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Ranking General</h3>
              <p className="text-white/60 text-sm">{tournamentName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
          >
            <X className="w-5 h-5 text-white/60 hover:text-white" />
          </button>
        </div>

        {/* Lista de equipos */}
        {!showTeamDetails && (
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {getDetailedStats().map((item, index) => (
              <div
                key={index}
                className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 hover:bg-white/10 ${
                  item.team === 'Mi Equipo' ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10'
                } cursor-pointer`}
                onClick={() => handleTeamClick(item.team)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < 3 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' 
                        : 'bg-white/10 text-white/80'
                    }`}>
                      {item.rank}
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        item.team === 'Mi Equipo' ? 'text-blue-300' : 'text-white'
                      }`}>
                        {item.team}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-white/60">
                        <span>{item.wins}W - {item.losses}L</span>
                        <span>•</span>
                        <span className={`flex items-center space-x-1 ${
                          item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <TrendingUp className="w-3 h-3" />
                          <span>{item.trend === 'up' ? 'Subiendo' : 'Bajando'}</span>
                        </span>
                        <span>•</span>
                        <span className="text-blue-400">Click para ver partidos →</span>
                      </div>
                    </div>
                  </div>
                  {item.team === 'Mi Equipo' && (
                    <div className="px-2 py-1 bg-blue-500/20 rounded-lg text-xs text-blue-300 font-semibold">
                      TÚ
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

                 {/* Vista detallada de partidos del equipo */}
         {showTeamDetails && selectedTeam && !showMatchDetails && (
           <div className="space-y-4">
             {/* Header del equipo */}
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-3">
                 {showBackButton && (
                   <button
                     onClick={goBackToRanking}
                     className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                   >
                     <ArrowLeft className="w-5 h-5 text-white/60 hover:text-white" />
                   </button>
                 )}
                 <div>
                   <h4 className="text-lg font-bold text-white">{selectedTeam}</h4>
                   <p className="text-white/60 text-sm">Historial de partidos</p>
                 </div>
               </div>
             </div>

             {/* Estadísticas del equipo */}
             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
               <div className="grid grid-cols-3 gap-4 text-center">
                 <div>
                   <p className="text-white/60 text-xs">Partidos</p>
                   <p className="text-white font-bold text-lg">{getTeamMatches(selectedTeam).length}</p>
                 </div>
                 <div>
                   <p className="text-white/60 text-xs">Victorias</p>
                   <p className="text-green-400 font-bold text-lg">
                     {getTeamMatches(selectedTeam).filter(match => match.result === 'W').length}
                   </p>
                 </div>
                 <div>
                   <p className="text-white/60 text-xs">Derrotas</p>
                   <p className="text-red-400 font-bold text-lg">
                     {getTeamMatches(selectedTeam).filter(match => match.result === 'L').length}
                   </p>
                 </div>
               </div>
             </div>

             {/* Lista de partidos */}
             <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
               {getTeamMatches(selectedTeam).map((match, index) => (
                 <div
                   key={match.id}
                   className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 hover:bg-white/10 cursor-pointer ${
                     match.result === 'W' ? 'border-green-500/30' : 'border-red-500/30'
                   }`}
                   onClick={() => handleMatchClick(match)}
                 >
                   <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center space-x-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                         match.result === 'W' 
                           ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                           : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                       }`}>
                         {match.result}
                       </div>
                       <div>
                         <p className="font-semibold text-white">vs {match.opponent}</p>
                         <p className="text-white/60 text-xs">{match.map}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-white font-bold text-lg">{match.score}</p>
                       <p className="text-white/60 text-xs">
                         {new Date(match.date).toLocaleDateString()}
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center justify-between text-xs text-white/60">
                     <span>MVP: {match.mvp}</span>
                     <span>Partido #{match.id}</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* Vista detallada del partido */}
         {showMatchDetails && selectedMatch && (
           <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
             {/* Header del partido */}
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-3">
                 <button
                   onClick={goBackToTeamMatches}
                   className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                 >
                   <ArrowLeft className="w-5 h-5 text-white/60 hover:text-white" />
                 </button>
                 <div>
                   <h4 className="text-lg font-bold text-white">Partido #{selectedMatch.id}</h4>
                   <p className="text-white/60 text-sm">{selectedMatch.map}</p>
                 </div>
               </div>
             </div>

             {/* Información del partido */}
             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
               <div className="text-center mb-4">
                 <div className="flex items-center justify-between mb-3">
                   <div className="text-center flex-1">
                     <h3 className="text-lg font-bold text-white">{selectedMatch.team1}</h3>
                     <p className="text-white/60 text-sm">{selectedMatch.detailedStats.team1Points} pts</p>
                   </div>
                   <div className="text-center mx-4">
                     <div className="text-2xl font-bold text-white mb-1">VS</div>
                     <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                       selectedMatch.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                       selectedMatch.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                       'bg-red-500/20 text-red-400'
                     }`}>
                       {selectedMatch.status === 'completed' ? 'COMPLETADO' : 
                        selectedMatch.status === 'pending' ? 'PENDIENTE' : 'CANCELADO'}
                     </div>
                   </div>
                   <div className="text-center flex-1">
                     <h3 className="text-lg font-bold text-white">{selectedMatch.team2}</h3>
                     <p className="text-white/60 text-sm">{selectedMatch.detailedStats.team2Points} pts</p>
                   </div>
                 </div>
                 <div className="text-center">
                   <p className="text-xl font-bold text-white mb-1">{selectedMatch.score}</p>
                   <p className="text-white/60 text-xs">{selectedMatch.date} • {selectedMatch.map}</p>
                   <p className="text-blue-400 text-xs mt-1">MVP: {selectedMatch.mvp}</p>
                 </div>
               </div>
             </div>

             {/* Estadísticas detalladas */}
             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
               <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                 <Target className="w-4 h-4 text-blue-400" />
                 Estadísticas Detalladas
               </h3>
               <div className="space-y-3">
                 <div className="flex justify-between items-center">
                   <span className="text-white/60 text-sm">{selectedMatch.team1}</span>
                   <span className="text-white/60 text-sm">{selectedMatch.team2}</span>
                 </div>
                 <div className="grid grid-cols-3 gap-2 text-center text-xs">
                   <div>
                     <p className="text-white/60">Puntos</p>
                     <p className="text-white font-semibold">{selectedMatch.detailedStats.team1Points}</p>
                     <p className="text-white font-semibold">{selectedMatch.detailedStats.team2Points}</p>
                   </div>
                   <div>
                     <p className="text-white/60">Mapas</p>
                     <p className={`font-semibold ${selectedMatch.detailedStats.team1MapDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                       {selectedMatch.detailedStats.team1MapDifference >= 0 ? '+' : ''}{selectedMatch.detailedStats.team1MapDifference}
                     </p>
                     <p className={`font-semibold ${selectedMatch.detailedStats.team2MapDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                       {selectedMatch.detailedStats.team2MapDifference >= 0 ? '+' : ''}{selectedMatch.detailedStats.team2MapDifference}
                     </p>
                   </div>
                   <div>
                     <p className="text-white/60">Rondas</p>
                     <p className={`font-semibold ${selectedMatch.detailedStats.team1RoundDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                       {selectedMatch.detailedStats.team1RoundDifference >= 0 ? '+' : ''}{selectedMatch.detailedStats.team1RoundDifference}
                     </p>
                     <p className={`font-semibold ${selectedMatch.detailedStats.team2RoundDifference >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                       {selectedMatch.detailedStats.team2RoundDifference >= 0 ? '+' : ''}{selectedMatch.detailedStats.team2RoundDifference}
                     </p>
                   </div>
                 </div>
               </div>
             </div>

                           {/* Estadísticas de jugadores */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-md font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Estadísticas de Jugadores
                </h3>
                
                {/* Tabs para equipos */}
                <div className="flex border-b border-white/10 mb-4">
                  <button
                    onClick={() => setActivePlayerTab('team1')}
                    className={`flex-1 px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      activePlayerTab === 'team1'
                        ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {selectedMatch.team1}
                  </button>
                  <button
                    onClick={() => setActivePlayerTab('team2')}
                    className={`flex-1 px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                      activePlayerTab === 'team2'
                        ? 'text-white border-b-2 border-purple-500 bg-purple-500/10'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {selectedMatch.team2}
                  </button>
                </div>

                {/* Contenido de los tabs */}
                <div className="space-y-2">
                  {activePlayerTab === 'team1' ? (
                    // Estadísticas del equipo 1
                    selectedMatch.team1Stats.map((player, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-sm">{player.name}</span>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-green-400 font-semibold">{player.points} pts</span>
                            <span className="text-blue-400">{player.kills} kills</span>
                            <span className="text-yellow-400">{player.assists} asst</span>
                            <span className="text-purple-400">{player.kda.toFixed(2)} KDA</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Estadísticas del equipo 2
                    selectedMatch.team2Stats.map((player, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-sm">{player.name}</span>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-green-400 font-semibold">{player.points} pts</span>
                            <span className="text-blue-400">{player.kills} kills</span>
                            <span className="text-yellow-400">{player.assists} asst</span>
                            <span className="text-purple-400">{player.kda.toFixed(2)} KDA</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
           </div>
         )}
        </div>
     </div>
   );
 };

export default TeamStatsSidebar;
