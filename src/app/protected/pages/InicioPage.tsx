import React from 'react';

const InicioPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Página de Inicio - Área Protegida
        </h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">
            ¡Has accedido exitosamente al área protegida!
          </h2>
          
          <p className="text-white/80 mb-6">
            Esta es una página protegida que solo puede ser accedida por usuarios autenticados.
            Aquí puedes ver que el layout incluye el header y footer heredados del diseño principal.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Características del Layout</h3>
              <ul className="text-white/80 space-y-2">
                <li>• Header con navegación</li>
                <li>• Footer con información</li>
                <li>• Selector de juegos</li>
                <li>• Fondo con gradiente dinámico</li>
                <li>• Diseño responsive</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Funcionalidades</h3>
              <ul className="text-white/80 space-y-2">
                <li>• Rutas protegidas</li>
                <li>• Redirección automática</li>
                <li>• Estado de autenticación</li>
                <li>• Layout reutilizable</li>
                <li>• Componentes modulares</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <button 
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InicioPage;
