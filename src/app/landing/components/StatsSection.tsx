import React from 'react';
import { Users, Trophy, Gamepad2, Globe } from 'lucide-react';
import { useColorPalette } from '../../shared/contexts';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, delay }) => (
  <div
    className="text-center group transform hover:scale-105 transition-all duration-500"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex justify-center mb-6">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
        <div className="relative p-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500">
          {icon}
        </div>
      </div>
    </div>
    <div className="text-5xl font-gaming text-white mb-3 group-hover:text-white transition-colors duration-300">
      {value}
    </div>
    <div className="text-white/90 text-lg font-gaming-secondary">{label}</div>
  </div>
);

const StatsSection: React.FC = () => {
  const { currentPalette } = useColorPalette();

  return (
    <section id="stats"
      className="py-24 relative overflow-hidden"
    >
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-6xl font-extrabold mb-8 font-friendly text-white tracking-wide">
            NÚMEROS QUE HABLAN
          </h2>
          <p className="text-2xl max-w-4xl mx-auto leading-relaxed font-friendly text-pastel-pink font-medium">
            NUESTRA PLATAFORMA CONECTA A MILLONES DE JUGADORES EN TODO EL MUNDO
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatItem
            icon={<Users className="w-10 h-10 text-white" />}
            value="1M+"
            label="Jugadores Activos"
            delay={0}
          />
          <StatItem
            icon={<Trophy className="w-10 h-10 text-white" />}
            value="500+"
            label="Torneos Mensuales"
            delay={200}
          />
          <StatItem
            icon={<Gamepad2 className="w-10 h-10 text-white" />}
            value="50+"
            label="Juegos Soportados"
            delay={400}
          />
          <StatItem
            icon={<Globe className="w-10 h-10 text-white" />}
            value="150+"
            label="Países"
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 