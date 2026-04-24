import React from "react";
import { useColorPalette } from "../../shared/contexts";

const ContactSection: React.FC = () => {
    const { currentPalette } = useColorPalette();

    return (
        <section
            id="contacto"
            className="py-24 relative overflow-hidden"
        >
            {/* Efectos de fondo */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-6xl font-extrabold mb-8 font-friendly text-white tracking-wide" >
                        CONTÁCTANOS
                    </h2>
                    <p className="text-2xl max-w-4xl mx-auto leading-relaxed font-friendly text-pastel-pink font-medium">
                        ¿TIENES PREGUNTAS? ¿QUIERES ORGANIZAR UN TORNEO?
                        ESTAMOS AQUÍ PARA AYUDARTE.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative group">
                        {/* Efectos de brillo alrededor de la card */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>

                        <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500">
                            <form className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="group">
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            className="w-full px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-300 text-lg"
                                        />
                                    </div>
                                    <div className="group">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="w-full px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-300 text-lg"
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <textarea
                                        placeholder="Mensaje"
                                        rows={6}
                                        className="w-full px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all duration-300 text-lg resize-none"
                                    ></textarea>
                                </div>
                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="group relative px-12 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-xl transform hover:scale-105"
                                    >
                                        <span className="relative z-10">Enviar Mensaje</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;