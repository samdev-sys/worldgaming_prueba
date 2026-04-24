import React from 'react';
import { Route } from 'react-router-dom';
import CrearEquipo from '../pages/CrearEquipo';
import GestionarEquipos from '../pages/GestionarEquipos';
import MiEquipo from '../pages/MiEquipo';
import SolicitudesEquipo from '../pages/SolicitudesEquipo';

const EquiposRoutes = (
  <Route path="equipos">
    <Route index element={<GestionarEquipos />} />
    <Route path="crear" element={<CrearEquipo />} />
    <Route path="mi-equipo" element={<MiEquipo />} />
    <Route path="solicitudes" element={<SolicitudesEquipo />} />
  </Route>
);

export default EquiposRoutes;
