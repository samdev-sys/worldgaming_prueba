import React from 'react';
import { Route } from 'react-router-dom';
import TorneoPage from '../pages/TorneoPage';
import CrearTorneo from '../pages/CrearTorneo';
import AdministrarResultados from '../pages/AdministrarResultados';

const TorneosRoutes = (
  <Route path="torneos">
    <Route index element={<TorneoPage />} />
    <Route path="crear" element={<CrearTorneo />} />
    <Route path="editar/:id" element={<CrearTorneo />} />
    <Route path="resultados" element={<AdministrarResultados />} />
  </Route>
);

export default TorneosRoutes;
