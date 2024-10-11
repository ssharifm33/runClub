import React from 'react';
import './App.css';
import Navbar from './components/Navbar.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard.js';
import LogRun from './components/LogRun.js';
import PlanRun from './components/PlanRun.js';
import RouteView from './components/RouteView.js';
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <div>
        <Navbar />
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
