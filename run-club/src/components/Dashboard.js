import React, { useState, useEffect } from 'react';
import RunItem from './RunItem';
import Navbar from './Navbar';

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
    <>
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Dashboard</h1>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="alert alert-primary" role="alert">
              <h4>Total Runs: {runs.length}</h4>
            </div>
          </div>
          <div className="col-md-6">
            <div className="alert alert-success" role="alert">
              <h4>Total Distance: {totalDistance.toFixed(2)} km</h4>
            </div>
          </div>
        </div>
        <div className="row">
          {runs.map((run, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <RunItem run={run} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
