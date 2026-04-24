import React from 'react';
import { Route } from 'react-router-dom';
import AchievementSystem from '../components/AchievementSystem';

const GamificationRoutes = (
  <Route path="gamification">
    <Route index element={<AchievementSystem />} />
  </Route>
);

export default GamificationRoutes;
