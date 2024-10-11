import React, { useState, useEffect } from 'react';
import RunItem from './RunItem.js';
import './Dashboard.css'; // Import the CSS file

function Dashboard() {
  const [runs, setRuns] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/runs')
      .then((response) => response.json())
      .then((data) => setRuns(data));

    fetch('http://localhost:5001/routes')
      .then((response) => response.json())
      .then((data) => setRoutes(data));
  }, []);

  const totalDistance = runs.reduce((total, run) => total + parseFloat(run.distance), 0);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <p>Total Runs: {runs.length}</p>
      <p>Total Distance: {totalDistance.toFixed(2)} km</p>
      <ul>
        {runs.map((run, index) => (
          <RunItem key={index} run={run} />
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
