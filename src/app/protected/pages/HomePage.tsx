import React from 'react';

const HomePage: React.FC = () => {
  return (
    <>
      <h1 className="text-5xl font-bold text-white mb-10 text-center font-friendly">
        ¡Bienvenido a World Gaming!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Estadísticas */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Estadísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/80">Juegos jugados</span>
              <span className="text-white font-semibold">156</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Horas totales</span>
              <span className="text-white font-semibold">2,847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Logros</span>
              <span className="text-white font-semibold">89</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Actividad Reciente */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Completaste "Cyberpunk 2077"</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Nuevo logro: "Speed Runner"</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white/80 text-sm">Torneo próximo: "FPS Championship"</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Próximos Eventos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Próximos Eventos</h3>
          <div className="space-y-3">
            <div className="border-l-4 border-orange-500 pl-3">
              <p className="text-white font-semibold">FPS Championship</p>
              <p className="text-white/60 text-sm">15 de Enero, 2025</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-3">
              <p className="text-white font-semibold">RPG Marathon</p>
              <p className="text-white/60 text-sm">22 de Enero, 2025</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <p className="text-white font-semibold">Strategy Tournament</p>
              <p className="text-white/60 text-sm">29 de Enero, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Acciones Rápidas */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
            Ver Biblioteca
          </button>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
            Unirse a Torneo
          </button>
          <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
            Ver Amigos
          </button>
          <button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
            Configuración
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
