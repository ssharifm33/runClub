// App.js
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
