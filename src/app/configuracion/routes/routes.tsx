import React from 'react';
import { Route } from 'react-router-dom';
import Perfil from '../components/perfil/Perfil';
import ConfiguracionSistema from '../components/sistema/ConfiguracionSistema';

const ConfiguracionRoutes = (
  <Route path="configuracion">
    <Route index element={<ConfiguracionSistema />} />
    <Route path="perfil" element={<Perfil />} />
  </Route>
);

export default ConfiguracionRoutes;
