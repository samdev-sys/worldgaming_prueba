import React from 'react';
import { Route } from 'react-router-dom';
import AnalyticsDashboard from '../pages/AnalyticsDashboard';

const AnalyticsRoutes = (
  <Route path="analytics">
    <Route index element={<AnalyticsDashboard />} />
  </Route>
);

export default AnalyticsRoutes;
