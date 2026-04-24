import React from "react";
import { useColorPalette } from "../../shared/contexts";

const CommunitySection: React.FC = () => {
    const { currentPalette } = useColorPalette();

    return (
        <section
            id="comunidad"
            className="py-24 relative overflow-hidden"
        >
            {/* Efectos de fondo */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-6xl font-extrabold mb-8 font-friendly text-white tracking-wide">
                        COMUNIDAD GLOBAL
                    </h2>
                    <p
                        className="text-2xl max-w-4xl mx-auto leading-relaxed font-friendly text-pastel-pink font-medium"
                    >
                        CONECTA CON JUGADORES DE TODO EL MUNDO. COMPARTE ESTRATEGIAS,
                        FORMA EQUIPOS Y CONSTRUYE AMISTADES QUE DURARÁN TODA LA VIDA.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="group">
                        <h3 className="text-4xl font-gaming-secondary text-white mb-8">CARACTERÍSTICAS DE LA COMUNIDAD</h3>
                        <ul className="space-y-6">
                            <li className="flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                                <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                                <span className="text-white/90 text-lg">Chat en tiempo real con jugadores globales</span>
                            </li>
                            <li className="flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                                <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                                <span className="text-white/90 text-lg">Foros de discusión por juego</span>
                            </li>
                            <li className="flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                                <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                                <span className="text-white/90 text-lg">Sistema de clanes y equipos</span>
                            </li>
                            <li className="flex items-center space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                                <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                                <span className="text-white/90 text-lg">Streaming integrado</span>
                            </li>
                        </ul>
                    </div>

                    <div className="group transform hover:scale-105 transition-all duration-500">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500">
                                <div className="text-center">
                                    <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">🌍</div>
                                    <h4 className="text-3xl font-gaming-secondary text-white mb-4">+1M JUGADORES</h4>
                                    <p className="text-white/90 text-xl font-gaming-light">Activos en todo el mundo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;