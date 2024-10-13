// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // For Bootstrap (if you are using it)
import './index.css'; // Your custom CSS (if applicable)
import 'leaflet/dist/leaflet.css'; // Leaflet CSS
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LogRun from './components/LogRun';
import PlanRun from './components/PlanRun';
import RouteView from './components/RouteView';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log-run" element={<LogRun />} />
          <Route path="/plan-run" element={<PlanRun />} />
          <Route path="/route/:id" element={<RouteView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
