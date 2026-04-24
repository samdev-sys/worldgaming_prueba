import React from "react";
import { useColorPalette } from "../../shared/contexts";

const TournamentsSection: React.FC = () => {
  const { currentPalette } = useColorPalette();

  return (
    <section
        id="torneos"
        className="py-24 relative overflow-hidden"
      >

        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2
              className="text-6xl font-extrabold mb-8 font-friendly text-white tracking-wide"
            >
              TORNEOS ÉPICOS
            </h2>
            <p
              className="text-2xl max-w-4xl mx-auto leading-relaxed font-friendly text-pastel-pink font-medium"
            >
              PARTICIPA EN LOS TORNEOS MÁS COMPETITIVOS DEL MUNDO GAMING.
              PREMIOS INCREÍBLES Y RECONOCIMIENTO GLOBAL TE ESPERAN.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="group transform hover:scale-105 transition-all duration-500">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🏆</div>
                  <h3 className="text-3xl font-gaming-secondary text-white mb-6">TORNEOS MENSUALES</h3>
                  <p className="text-white/90 text-lg font-gaming-light leading-relaxed">
                    Compite en torneos mensuales con premios de hasta $10,000 USD y reconocimiento global
                  </p>
                </div>
              </div>
            </div>

            <div className="group transform hover:scale-105 transition-all duration-500">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">⚡</div>
                  <h3 className="text-3xl font-gaming-secondary text-white mb-6">LIGAS PROFESIONALES</h3>
                  <p className="text-white/90 text-lg font-gaming-light leading-relaxed">
                    Únete a ligas profesionales y compite contra los mejores jugadores del mundo
                  </p>
                </div>
              </div>
            </div>

            <div className="group transform hover:scale-105 transition-all duration-500">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">🎮</div>
                  <h3 className="text-3xl font-gaming-secondary text-white mb-6">EVENTOS ESPECIALES</h3>
                  <p className="text-white/90 text-lg font-gaming-light leading-relaxed">
                    Participa en eventos exclusivos con celebridades del gaming y streamers famosos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};

export default TournamentsSection;