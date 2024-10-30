// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Your custom CSS
import 'leaflet/dist/leaflet.css'; // Leaflet CSS
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LogRun from './components/LogRun';
import PlanRun from './components/PlanRun';
import RouteView from './components/RouteView';
import SavedRuns from './components/Dashboard';
import { Authenticator } from '@aws-amplify/ui-react';

function App() {
  return (
    <Authenticator>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log-run" element={<LogRun />} />
            <Route path="/plan-run" element={<PlanRun />} />
            <Route path="/route/:id" element={<RouteView />} />
            <Route path="/saved-runs" element={<SavedRuns />} />
          </Routes>
        </div>
      </Router>
    </Authenticator>
  );
}

export default App;
