import React from 'react';
import { Route } from 'react-router-dom';
import UsuariosList from '../components/UsuariosList';

// Componentes de ejemplo
const UsuariosPage = () => (
  <div className="container mx-auto px-6 py-8">
    <h1 className="text-4xl font-bold text-white mb-8">Usuarios</h1>
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
      <p className="text-white/80">Esta es la página de usuarios protegida.</p>
    </div>
  </div>
);

const PerfilesPage = () => (
  <div className="container mx-auto px-6 py-8">
    <h1 className="text-4xl font-bold text-white mb-8">Perfiles</h1>
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
      <p className="text-white/80">Esta es la página de perfiles protegida.</p>
    </div>
  </div>
);

const UsuariosRoutes = (
  <Route path="usuarios">
    <Route index element={<UsuariosList />} />
    <Route path="perfiles" element={<PerfilesPage />} />
  </Route>
);

export default UsuariosRoutes;
