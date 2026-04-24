import React from 'react';
import { Route } from 'react-router-dom';
import RankingsPage from '../pages/RankingsPage';

const RankingsRoutes = (
  <Route path="rankings">
    <Route index element={<RankingsPage />} />
  </Route>
);

export default RankingsRoutes;
