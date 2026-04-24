import React from 'react';
import { Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';

const ProtectedRoutes = (
  <Route path="inicio">
    <Route index element={<HomePage />} />
  </Route>
);

export default ProtectedRoutes;
