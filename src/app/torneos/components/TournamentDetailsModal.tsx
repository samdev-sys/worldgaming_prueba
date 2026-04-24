import React, { useEffect, useState } from 'react';
import {
    Trophy,
    Users,
    Calendar,
    Clock,
    DollarSign,
    TrendingUp,
    X,
    Star,
    Zap,
    Award,
    Gamepad2,
    BarChart3,
    ArrowLeft
} from 'lucide-react';
import { getDifficultyColor } from '../../shared/utils';

interface Tournament {
    id: string;
    name: string;
    game: string;
    startDate: string;
    endDate: string;
    participants: number;
    maxParticipants: number;
    prize: string;
    status: 'active' | 'upcoming' | 'completed';
    myRank?: number;
    myScore?: number;
    myProgress?: number;
    registrationDate: string;
    category: string;
    difficulty: string;
    location: string;
    description: string;
}

interface TournamentDetailsModalProps {
    tournament: Tournament | null;
    isOpen: boolean;
    onClose: () => void;
}

const TournamentDetailsModal: React.FC<TournamentDetailsModalProps> = ({
    tournament,
    isOpen,
    onClose
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [selectedStat, setSelectedStat] = useState<string | null>(null);
    const [showStatsPanel, setShowStatsPanel] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
    const [showTeamDetails, setShowTeamDetails] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender || !tournament) return null;

    const handleStatClick = (statType: string) => {
        setSelectedStat(statType);
        setShowStatsPanel(true);
    };

    const closeStatsPanel = () => {
        setShowStatsPanel(false);
        setSelectedStat(null);
        setShowTeamDetails(false);
        setSelectedTeam(null);
    };

    const handleTeamClick = (teamName: string) => {
        setSelectedTeam(teamName);
        setShowTeamDetails(true);
    };

    const goBackToRanking = () => {
        setShowTeamDetails(false);
        setSelectedTeam(null);
    };

    // Datos mock para las estadísticas detalladas
    const getDetailedStats = (statType: string) => {
        const mockData = {
            score: [
                { player: 'Alex "ProGamer" Rodriguez', score: 2850, rank: 1, team: 'Team Alpha', trend: 'up', level: 'Diamante' },
                { player: 'Sarah "QueenSlayer" Chen', score: 2720, rank: 2, team: 'Team Beta', trend: 'up', level: 'Diamante' },
                { player: 'Mike "ShadowKiller" Johnson', score: 2680, rank: 3, team: 'Team Gamma', trend: 'down', level: 'Platino' },
                { player: 'Emma "FrostByte" Williams', score: 2650, rank: 4, team: 'Team Delta', trend: 'up', level: 'Platino' },
                { player: 'David "CyberWolf" Martinez', score: 2620, rank: 5, team: 'Team Epsilon', trend: 'down', level: 'Platino' },
                { player: 'Lisa "NeonQueen" Thompson', score: 2580, rank: 6, team: 'Team Alpha', trend: 'up', level: 'Oro' },
                { player: 'Carlos "ViperStrike" Garcia', score: 2550, rank: 7, team: 'Team Beta', trend: 'up', level: 'Oro' },
                { player: 'Anna "PixelPrincess" Davis', score: 2520, rank: 8, team: 'Team Gamma', trend: 'down', level: 'Oro' },
                { player: 'James "ThunderBolt" Wilson', score: 2480, rank: 9, team: 'Team Delta', trend: 'up', level: 'Oro' },
                { player: 'Maria "CrystalEyes" Brown', score: 2450, rank: 10, team: 'Team Epsilon', trend: 'down', level: 'Oro' },
                { player: 'Juan "DragonSlayer" Lopez', score: 2420, rank: 11, team: 'Team Alpha', trend: 'up', level: 'Plata' },
                { player: 'Sophie "MysticMage" Taylor', score: 2380, rank: 12, team: 'Team Beta', trend: 'up', level: 'Plata' },
                { player: 'Roberto "StealthNinja" Hernandez', score: 2350, rank: 13, team: 'Team Gamma', trend: 'down', level: 'Plata' },
                { player: 'Natalie "PhoenixRise" Anderson', score: 2320, rank: 14, team: 'Team Delta', trend: 'up', level: 'Plata' },
                { player: 'Tú', score: 2450, rank: 15, team: 'Mi Equipo', trend: 'up', level: 'Oro' },
                { player: 'Kevin "BlitzMaster" Lee', score: 2280, rank: 16, team: 'Team Epsilon', trend: 'down', level: 'Plata' },
                { player: 'Isabella "StarGazer" Moore', score: 2250, rank: 17, team: 'Team Alpha', trend: 'up', level: 'Plata' },
                { player: 'Diego "RageQuit" Perez', score: 2220, rank: 18, team: 'Team Beta', trend: 'down', level: 'Bronce' },
                { player: 'Rachel "LuckyShot" Clark', score: 2180, rank: 19, team: 'Team Gamma', trend: 'up', level: 'Bronce' },
                { player: 'Lucas "NoobSlayer" White', score: 2150, rank: 20, team: 'Team Delta', trend: 'down', level: 'Bronce' },
            ],
            progress: [
                { team: 'Team Alpha', progress: 95, rank: 1, trend: 'up' },
                { team: 'Team Beta', progress: 88, rank: 2, trend: 'up' },
                { team: 'Team Gamma', progress: 82, rank: 3, trend: 'down' },
                { team: 'Team Delta', progress: 78, rank: 4, trend: 'up' },
                { team: 'Team Epsilon', progress: 75, rank: 5, trend: 'down' },
                { team: 'Mi Equipo', progress: 75, rank: 15, trend: 'up' },
            ],
            rank: [
                { team: 'Team Alpha', rank: 1, wins: 15, losses: 2, trend: 'up' },
                { team: 'Team Beta', rank: 2, wins: 14, losses: 3, trend: 'up' },
                { team: 'Team Gamma', rank: 3, wins: 13, losses: 4, trend: 'down' },
                { team: 'Team Delta', rank: 4, wins: 12, losses: 5, trend: 'up' },
                { team: 'Team Epsilon', rank: 5, wins: 11, losses: 6, trend: 'down' },
                { team: 'Mi Equipo', rank: 15, wins: 8, losses: 9, trend: 'up' },
            ]
        };
        return mockData[statType as keyof typeof mockData] || [];
    };

    // Datos mock para los partidos de cada equipo
    const getTeamMatches = (teamName: string) => {
        const matchesData = {
            'Team Alpha': [
                { id: 1, opponent: 'Team Beta', result: 'W', score: '3-1', date: '2024-03-15', map: 'Dust2', mvp: 'Alex "ProGamer" Rodriguez' },
                { id: 2, opponent: 'Team Gamma', result: 'W', score: '2-1', date: '2024-03-18', map: 'Mirage', mvp: 'Lisa "NeonQueen" Thompson' },
                { id: 3, opponent: 'Team Delta', result: 'W', score: '3-0', date: '2024-03-20', map: 'Inferno', mvp: 'Juan "DragonSlayer" Lopez' },
                { id: 4, opponent: 'Team Epsilon', result: 'W', score: '2-1', date: '2024-03-22', map: 'Overpass', mvp: 'Isabella "StarGazer" Moore' },
                { id: 5, opponent: 'Mi Equipo', result: 'W', score: '3-2', date: '2024-03-25', map: 'Nuke', mvp: 'Alex "ProGamer" Rodriguez' },
            ],
            'Team Beta': [
                { id: 1, opponent: 'Team Alpha', result: 'L', score: '1-3', date: '2024-03-15', map: 'Dust2', mvp: 'Sarah "QueenSlayer" Chen' },
                { id: 2, opponent: 'Team Gamma', result: 'W', score: '3-1', date: '2024-03-17', map: 'Mirage', mvp: 'Carlos "ViperStrike" Garcia' },
                { id: 3, opponent: 'Team Delta', result: 'W', score: '2-1', date: '2024-03-19', map: 'Inferno', mvp: 'Sophie "MysticMage" Taylor' },
                { id: 4, opponent: 'Team Epsilon', result: 'W', score: '3-0', date: '2024-03-21', map: 'Overpass', mvp: 'Diego "RageQuit" Perez' },
                { id: 5, opponent: 'Mi Equipo', result: 'W', score: '2-1', date: '2024-03-24', map: 'Nuke', mvp: 'Sarah "QueenSlayer" Chen' },
            ],
            'Team Gamma': [
                { id: 1, opponent: 'Team Alpha', result: 'L', score: '1-2', date: '2024-03-18', map: 'Mirage', mvp: 'Mike "ShadowKiller" Johnson' },
                { id: 2, opponent: 'Team Beta', result: 'L', score: '1-3', date: '2024-03-17', map: 'Mirage', mvp: 'Anna "PixelPrincess" Davis' },
                { id: 3, opponent: 'Team Delta', result: 'W', score: '3-2', date: '2024-03-20', map: 'Inferno', mvp: 'Roberto "StealthNinja" Hernandez' },
                { id: 4, opponent: 'Team Epsilon', result: 'W', score: '2-1', date: '2024-03-23', map: 'Overpass', mvp: 'Rachel "LuckyShot" Clark' },
                { id: 5, opponent: 'Mi Equipo', result: 'L', score: '1-3', date: '2024-03-26', map: 'Nuke', mvp: 'Mike "ShadowKiller" Johnson' },
            ],
            'Team Delta': [
                { id: 1, opponent: 'Team Alpha', result: 'L', score: '0-3', date: '2024-03-20', map: 'Inferno', mvp: 'Emma "FrostByte" Williams' },
                { id: 2, opponent: 'Team Beta', result: 'L', score: '1-2', date: '2024-03-19', map: 'Inferno', mvp: 'James "ThunderBolt" Wilson' },
                { id: 3, opponent: 'Team Gamma', result: 'L', score: '2-3', date: '2024-03-20', map: 'Inferno', mvp: 'Natalie "PhoenixRise" Anderson' },
                { id: 4, opponent: 'Team Epsilon', result: 'W', score: '3-1', date: '2024-03-22', map: 'Overpass', mvp: 'Lucas "NoobSlayer" White' },
                { id: 5, opponent: 'Mi Equipo', result: 'W', score: '2-1', date: '2024-03-25', map: 'Nuke', mvp: 'Emma "FrostByte" Williams' },
            ],
            'Team Epsilon': [
                { id: 1, opponent: 'Team Alpha', result: 'L', score: '1-2', date: '2024-03-22', map: 'Overpass', mvp: 'David "CyberWolf" Martinez' },
                { id: 2, opponent: 'Team Beta', result: 'L', score: '0-3', date: '2024-03-21', map: 'Overpass', mvp: 'Maria "CrystalEyes" Brown' },
                { id: 3, opponent: 'Team Gamma', result: 'L', score: '1-2', date: '2024-03-23', map: 'Overpass', mvp: 'Kevin "BlitzMaster" Lee' },
                { id: 4, opponent: 'Team Delta', result: 'L', score: '1-3', date: '2024-03-22', map: 'Overpass', mvp: 'David "CyberWolf" Martinez' },
                { id: 5, opponent: 'Mi Equipo', result: 'L', score: '1-2', date: '2024-03-27', map: 'Nuke', mvp: 'Maria "CrystalEyes" Brown' },
            ],
            'Mi Equipo': [
                { id: 1, opponent: 'Team Alpha', result: 'L', score: '2-3', date: '2024-03-25', map: 'Nuke', mvp: 'Tú' },
                { id: 2, opponent: 'Team Beta', result: 'L', score: '1-2', date: '2024-03-24', map: 'Nuke', mvp: 'Tú' },
                { id: 3, opponent: 'Team Gamma', result: 'W', score: '3-1', date: '2024-03-26', map: 'Nuke', mvp: 'Tú' },
                { id: 4, opponent: 'Team Delta', result: 'L', score: '1-2', date: '2024-03-25', map: 'Nuke', mvp: 'Tú' },
                { id: 5, opponent: 'Team Epsilon', result: 'W', score: '2-1', date: '2024-03-27', map: 'Nuke', mvp: 'Tú' },
            ]
        };
        return matchesData[teamName as keyof typeof matchesData] || [];
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'En Progreso';
            case 'upcoming':
                return 'Próximo';
            case 'completed':
                return 'Completado';
            default:
                return 'Desconocido';
        }
    };

    // Usar función centralizada de utils
    const getDifficultyTextColor = (difficulty: string) => {
        const badgeClasses = getDifficultyColor(difficulty);
        return badgeClasses.split(' ')[0]; // Retorna solo la clase de texto
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Diamante':
                return 'text-cyan-400';
            case 'Platino':
                return 'text-purple-400';
            case 'Oro':
                return 'text-yellow-400';
            case 'Plata':
                return 'text-gray-300';
            case 'Bronce':
                return 'text-orange-600';
            default:
                return 'text-gray-400';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
            animation: isAnimating ? 'modalFadeIn 0.3s ease-out' : 'modalFadeOut 0.3s ease-in'
        }}>
            <style>{`
                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes modalFadeOut {
                    from {
                        opacity: 1;
                        transform: scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                }
                
                @keyframes particleFloat {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-10px) rotate(180deg);
                    }
                }
                
                .particle {
                    animation: particleFloat 3s ease-in-out infinite;
                }
            `}</style>
            
            {/* Overlay con efecto gaming */}
            <div 
                className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            />
            
            {/* Modal principal */}
            <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl transition-all duration-300 transform ${
                isAnimating 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 translate-y-4'
            }`}>
                
                {/* Efecto de partículas gaming */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
                        isAnimating ? 'opacity-100' : 'opacity-0'
                    }`}>
                        {/* Partículas animadas */}
                        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse particle"></div>
                        <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-ping particle"></div>
                        <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce particle"></div>
                        <div className="absolute bottom-4 right-4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse particle"></div>
                        <div className="absolute top-1/2 left-4 w-1 h-1 bg-red-400 rounded-full animate-ping particle"></div>
                        <div className="absolute top-1/3 right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce particle"></div>
                    </div>
                </div>

                {/* Header del modal */}
                <div className="relative p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl transition-all duration-500 transform ${
                                isAnimating ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                            }`}>
                                <Gamepad2 className="w-6 h-6 text-white" />
                            </div>
                            <div className={`transition-all duration-500 transform ${
                                isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                            }`}>
                                <h2 className="text-2xl font-bold text-white">Detalles del Torneo</h2>
                                <p className="text-white/60 text-sm">Información completa del torneo</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-2 hover:bg-white/10 rounded-xl transition-all duration-300 transform ${
                                isAnimating ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
                            } hover:rotate-90 hover:scale-110`}
                        >
                            <X className="w-6 h-6 text-white/60 hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Contenido scrolleable */}
                <div className={`overflow-y-auto max-h-[calc(90vh-120px)] p-6 transition-all duration-700 transform ${
                    isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                    
                    {/* Información principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        
                        {/* Columna izquierda */}
                        <div className={`space-y-6 transition-all duration-500 transform ${
                            isAnimating ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                        }`}>
                            
                            {/* Título y descripción */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                                <h3 className="text-xl font-bold text-white mb-3">{tournament.name}</h3>
                                <p className="text-white/70 text-sm leading-relaxed">{tournament.description}</p>
                            </div>

                            {/* Estadísticas del usuario */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                    <BarChart3 className="w-5 h-5 text-blue-400" />
                                    <span>Mis Estadísticas</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {tournament.myScore && (
                                        <button 
                                            onClick={() => handleStatClick('score')}
                                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <TrendingUp className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                                <div>
                                                    <p className="text-white/60 text-xs">Mi Puntuación</p>
                                                    <p className="text-white font-bold text-lg">{tournament.myScore}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-white/40 group-hover:text-white/60 transition-colors">
                                                Click para ver ranking individual →
                                            </div>
                                        </button>
                                    )}
                                    
                                    {tournament.myProgress && (
                                        <button 
                                            onClick={() => handleStatClick('progress')}
                                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Clock className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
                                                <div>
                                                    <p className="text-white/60 text-xs">Progreso</p>
                                                    <p className="text-white font-bold text-lg">{tournament.myProgress}%</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-white/40 group-hover:text-white/60 transition-colors">
                                                Click para ver progreso completo →
                                            </div>
                                        </button>
                                    )}

                                    {tournament.myRank && (
                                        <button 
                                            onClick={() => handleStatClick('rank')}
                                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Award className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                                                <div>
                                                    <p className="text-white/60 text-xs">Mi Ranking</p>
                                                    <p className="text-white font-bold text-lg">#{tournament.myRank}</p>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-white/40 group-hover:text-white/60 transition-colors">
                                                Click para ver ranking completo →
                                            </div>
                                        </button>
                                    )}

                                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div className="flex items-center space-x-3">
                                            <DollarSign className="w-5 h-5 text-yellow-400" />
                                            <div>
                                                <p className="text-white/60 text-xs">Premio</p>
                                                <p className="text-white font-bold text-lg">{tournament.prize}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha */}
                        <div className={`space-y-6 transition-all duration-500 transform delay-200 ${
                            isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                        }`}>
                            
                            {/* Información del torneo */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                    <span>Información del Torneo</span>
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Juego:</span>
                                        <span className="text-white font-semibold">{tournament.game}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Categoría:</span>
                                        <span className="text-white font-semibold">{tournament.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Dificultad:</span>
                                        <span className={`font-semibold ${getDifficultyColor(tournament.difficulty)}`}>
                                            {tournament.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Ubicación:</span>
                                        <span className="text-white font-semibold">{tournament.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Participantes:</span>
                                        <span className="text-white font-semibold">
                                            {tournament.participants}/{tournament.maxParticipants}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Fechas */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-purple-400" />
                                    <span>Fechas</span>
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Inicio:</span>
                                        <span className="text-white font-semibold">
                                            {new Date(tournament.startDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Fin:</span>
                                        <span className="text-white font-semibold">
                                            {new Date(tournament.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60">Registro:</span>
                                        <span className="text-white font-semibold">
                                            {new Date(tournament.registrationDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Estado del torneo */}
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                    <Zap className="w-5 h-5 text-green-400" />
                                    <span>Estado</span>
                                </h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60">Estado actual:</span>
                                    <div className={`px-3 py-1 rounded-lg font-bold text-xs ${
                                        tournament.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                                        tournament.status === 'upcoming' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                                        'bg-gradient-to-r from-blue-300 to-blue-400 text-white'
                                    }`}>
                                        {getStatusText(tournament.status)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Barra de progreso detallada */}
                    {tournament.myProgress && (
                        <div className={`bg-white/5 rounded-2xl p-6 border border-white/10 mb-6 transition-all duration-500 transform delay-300 hover:bg-white/10 hover:scale-[1.02] ${
                            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}>
                            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                                <Star className="w-5 h-5 text-yellow-400" />
                                <span>Progreso del Torneo</span>
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-white/60 text-sm">
                                    <span>Progreso actual</span>
                                    <span>{tournament.myProgress}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${tournament.myProgress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className={`flex space-x-4 transition-all duration-500 transform delay-500 ${
                        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                        <button className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg transform hover:scale-105 hover:shadow-xl">
                            <Users className="w-5 h-5" />
                            <span>Ver Participantes</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel lateral de estadísticas detalladas */}
            {showStatsPanel && selectedStat && (
                <div className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-l border-white/20 shadow-2xl transition-all duration-300 transform ${
                    showStatsPanel ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="p-6">
                        
                        {/* Header del panel */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">
                                        {selectedStat === 'score' && 'Ranking Individual'}
                                        {selectedStat === 'progress' && 'Progreso de Equipos'}
                                        {selectedStat === 'rank' && 'Ranking General'}
                                    </h3>
                                    <p className="text-white/60 text-sm">
                                        {selectedStat === 'score' && 'Comparación con otros jugadores'}
                                        {selectedStat === 'progress' && 'Comparación con otros equipos'}
                                        {selectedStat === 'rank' && 'Comparación con otros equipos'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeStatsPanel}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                            >
                                <X className="w-5 h-5 text-white/60 hover:text-white" />
                            </button>
                        </div>

                        {/* Lista de equipos */}
                        {!showTeamDetails && (
                            <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                                {getDetailedStats(selectedStat).map((item, index) => (
                                    <div 
                                        key={index}
                                        className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 hover:bg-white/10 ${
                                            (selectedStat === 'score' && (item as any).player === 'Tú') || (selectedStat !== 'score' && item.team === 'Mi Equipo')
                                                ? 'border-blue-500/50 bg-blue-500/10' 
                                                : 'border-white/10'
                                        } ${selectedStat === 'rank' ? 'cursor-pointer' : ''}`}
                                        onClick={selectedStat === 'rank' ? () => handleTeamClick(item.team) : undefined}
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
                                                        (selectedStat === 'score' && (item as any).player === 'Tú') || (selectedStat !== 'score' && item.team === 'Mi Equipo') ? 'text-blue-300' : 'text-white'
                                                    }`}>
                                                        {selectedStat === 'score' ? (item as any).player : item.team}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-xs text-white/60">
                                                        {selectedStat === 'score' && (
                                                            <>
                                                                <span>{(item as any).score} pts</span>
                                                                <span>•</span>
                                                                <span className={`${getLevelColor((item as any).level)} font-semibold`}>
                                                                    {(item as any).level}
                                                                </span>
                                                                <span>•</span>
                                                                <span className={`flex items-center space-x-1 ${
                                                                    item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                                                }`}>
                                                                    <TrendingUp className="w-3 h-3" />
                                                                    <span>{item.trend === 'up' ? 'Subiendo' : 'Bajando'}</span>
                                                                </span>
                                                            </>
                                                        )}
                                                        {selectedStat === 'progress' && (
                                                            <>
                                                                <span>{(item as any).progress}%</span>
                                                                <span>•</span>
                                                                <span className={`flex items-center space-x-1 ${
                                                                    item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                                                }`}>
                                                                    <TrendingUp className="w-3 h-3" />
                                                                    <span>{item.trend === 'up' ? 'Subiendo' : 'Bajando'}</span>
                                                                </span>
                                                            </>
                                                        )}
                                                        {selectedStat === 'rank' && (
                                                            <>
                                                                <span>{(item as any).wins}W - {(item as any).losses}L</span>
                                                                <span>•</span>
                                                                <span className={`flex items-center space-x-1 ${
                                                                    item.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                                                }`}>
                                                                    <TrendingUp className="w-3 h-3" />
                                                                    <span>{item.trend === 'up' ? 'Subiendo' : 'Bajando'}</span>
                                                                </span>
                                                                <span>•</span>
                                                                <span className="text-blue-400">Click para ver partidos →</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {((selectedStat === 'score' && (item as any).player === 'Tú') || (selectedStat !== 'score' && item.team === 'Mi Equipo')) && (
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
                        {showTeamDetails && selectedTeam && (
                            <div className="space-y-4">
                                {/* Header del equipo */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <button
                                            onClick={goBackToRanking}
                                            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
                                        >
                                            <ArrowLeft className="w-5 h-5 text-white/60 hover:text-white" />
                                        </button>
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
                                            className={`bg-white/5 rounded-xl p-4 border transition-all duration-300 hover:bg-white/10 ${
                                                match.result === 'W' ? 'border-green-500/30' : 'border-red-500/30'
                                            }`}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default TournamentDetailsModal;