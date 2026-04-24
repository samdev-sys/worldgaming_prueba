import React from 'react';
import { Trophy, Users, Calendar, DollarSign, Star } from 'lucide-react';
import { useColorPalette, useGame } from '../../shared/contexts';
import '../../../index.css';

interface TournamentData {
  name: string;
  game: string;
  prize: string;
  participants: string;
  date: string;
  status: 'active' | 'upcoming' | 'completed';
  description: string;
  image: string;
}

const tournamentData: Record<string, TournamentData> = {
  'gta-vi': {
    name: 'GTA VI Championship',
    game: 'Grand Theft Auto VI',
    prize: '$50,000 USD',
    participants: '2,500+',
    date: '15-20 Marzo 2024',
    status: 'upcoming',
    description: 'El torneo más épico de GTA VI. Compite por el título de campeón y premios increíbles.',
    image: '/images/tournaments/gta-vi-tournament.jpg'
  },
  'valorant': {
    name: 'Valorant Masters',
    game: 'Valorant',
    prize: '$25,000 USD',
    participants: '1,800+',
    date: '10-15 Abril 2024',
    status: 'upcoming',
    description: 'Demuestra tu habilidad táctica en el torneo más competitivo de Valorant.',
    image: '/images/tournaments/valorant-tournament.jpg'
  },
  'csgo': {
    name: 'CS:GO Pro League',
    game: 'Counter-Strike: Global Offensive',
    prize: '$30,000 USD',
    participants: '3,200+',
    date: '5-10 Mayo 2024',
    status: 'upcoming',
    description: 'La liga profesional más prestigiosa de CS:GO. ¿Tienes lo que se necesita?',
    image: '/images/tournaments/csgo-tournament.jpg'
  },
  'fortnite': {
    name: 'Fortnite Battle Royale',
    game: 'Fortnite',
    prize: '$20,000 USD',
    participants: '4,500+',
    date: '20-25 Junio 2024',
    status: 'upcoming',
    description: 'Construye, lucha y sobrevive en el torneo más grande de Fortnite.',
    image: '/images/tournaments/fortnite-tournament.jpg'
  },
  'lol': {
    name: 'League of Legends Cup',
    game: 'League of Legends',
    prize: '$40,000 USD',
    participants: '2,800+',
    date: '1-6 Julio 2024',
    status: 'upcoming',
    description: 'Forma tu equipo y compite en el torneo más estratégico de LoL.',
    image: '/images/tournaments/lol-tournament.jpg'
  },
  'overwatch': {
    name: 'Overwatch Championship',
    game: 'Overwatch',
    prize: '$18,000 USD',
    participants: '1,500+',
    date: '15-20 Agosto 2024',
    status: 'upcoming',
    description: 'Demuestra tu trabajo en equipo en el torneo de Overwatch.',
    image: '/images/tournaments/overwatch-tournament.jpg'
  },
  'dota2': {
    name: 'Dota 2 International',
    game: 'Dota 2',
    prize: '$35,000 USD',
    participants: '2,200+',
    date: '10-15 Septiembre 2024',
    status: 'upcoming',
    description: 'El torneo más épico de Dota 2. ¿Eres digno del Aegis?',
    image: '/images/tournaments/dota2-tournament.jpg'
  },
  'rainbow6': {
    name: 'Rainbow Six Siege Pro',
    game: 'Rainbow Six Siege',
    prize: '$22,000 USD',
    participants: '1,900+',
    date: '25-30 Octubre 2024',
    status: 'upcoming',
    description: 'Tácticas, estrategia y precisión en el torneo de R6 Siege.',
    image: '/images/tournaments/rainbow6-tournament.jpg'
  }
};

const FeaturedTournament: React.FC = () => {
  const { currentPalette } = useColorPalette();
  const { selectedGame } = useGame();

  const tournament = tournamentData[selectedGame] || tournamentData['gta-vi'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'EN CURSO';
      case 'upcoming':
        return 'PRÓXIMAMENTE';
      case 'completed':
        return 'COMPLETADO';
      default:
        return 'PRÓXIMAMENTE';
    }
  };

  return (
    <section id="torneoDestacado" className="relative py-24 overflow-hidden">

      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-extrabold mb-8 font-friendly text-white tracking-wide">
            TORNEO DESTACADO
          </h2>
          <p className="text-2xl max-w-4xl mx-auto leading-relaxed font-friendly text-pastel-pink font-medium">
            EL EVENTO MÁS IMPORTANTE DEL MOMENTO. NO TE PIERDAS LA OPORTUNIDAD DE COMPETIR.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative group">
            {/* Efectos de brillo alrededor de la card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>

            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Imagen del torneo */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white/60 font-friendly">
                        <Trophy className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg">Imagen del Torneo</p>
                      </div>
                    </div>
                  </div>

                  {/* Badge de estado */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(tournament.status)} font-friendly`}>
                    {getStatusText(tournament.status)}
                  </div>
                </div>

                {/* Información del torneo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-4xl font-extrabold text-white mb-2 font-friendly">{tournament.name}</h3>
                    <p className="text-xl text-white/80 mb-4 font-friendly font-medium">{tournament.game}</p>
                    <p className="text-white/90 leading-relaxed font-friendly">{tournament.description}</p>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-6 h-6 text-white" />
                        <div>
                          <p className="text-white/60 text-sm font-friendly">Premio</p>
                          <p className="text-white font-bold font-friendly">{tournament.prize}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <Users className="w-6 h-6 text-white" />
                        <div>
                          <p className="text-white/60 text-sm font-friendly">Participantes</p>
                          <p className="text-white font-bold font-friendly">{tournament.participants}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-white" />
                        <div>
                          <p className="text-white/60 text-sm font-friendly">Fecha</p>
                          <p className="text-white font-bold font-friendly">{tournament.date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <Star className="w-6 h-6 text-white" />
                        <div>
                          <p className="text-white/60 text-sm font-friendly">Nivel</p>
                          <p className="text-white font-bold font-friendly">Profesional</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botón de registro */}
                  <div className="pt-4">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-8 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 font-friendly">
                      REGISTRARSE AHORA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturedTournament;