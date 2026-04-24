import React from 'react';
import { Route } from 'react-router-dom';
import GestionarJuegos from '../pages/Juegos/GestionarJuegos';
import CrearJuego from '../pages/Juegos/CrearJuego';
import GestionarCategorias from '../pages/Categorias/GestionarCategorias';
import CrearCategoria from '../pages/Categorias/CrearCategoria';

const JuegosRoutes = (
  <Route path="juegos">
    <Route index element={<GestionarJuegos />} />
    <Route path="crear" element={<CrearJuego />} />
    <Route path="editar/:id" element={<CrearJuego />} />
    <Route path="categorias" element={<GestionarCategorias />} />
    <Route path="crearCategoria" element={<CrearCategoria />} />
    <Route path="editarCategoria/:id" element={<CrearCategoria />} />
  </Route>
);

export default JuegosRoutes;
