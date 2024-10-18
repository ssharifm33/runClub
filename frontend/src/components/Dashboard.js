import React, { useState, useEffect } from 'react';
import RunItem from './RunItem';
import Navbar from './Navbar';
import './Dashboard.css';

function Dashboard() {
  const [runs, setRuns] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);     // Track errors

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/runs`);
        const data = await response.json();
        console.log("Runs data:", data);
        const runsData = JSON.parse(data.body); // Parse the body
        if (Array.isArray(runsData)) {
          setRuns(runsData);
        } else {
          throw new Error('Invalid response format for runs.');
        }
      } catch (error) {
        console.error('Error fetching runs:', error);
        setError(error.message);
      }
    };

    // Fetch runs only since routes may not be used currently
    fetchRuns().finally(() => setLoading(false));

  }, []);

  // Calculate total distance
  const totalDistance = runs.reduce((total, run) => total + parseFloat(run.distance), 0);

  // If there's an error, display it
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <h1 className="mb-4">Dashboard</h1>
          <div className="alert alert-danger">
            <h4>Error: {error}</h4>
          </div>
        </div>
      </div>
    );
  }

  // Display loading message while fetching data
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-5">
          <h1 className="mb-4">Dashboard</h1>
          <div className="alert alert-info">
            <h4>Loading...</h4>
          </div>
        </div>
      </div>
    );
  }

  // Check if runs are available
  if (runs.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h1 className="mb-4">Dashboard</h1>
          <div className="alert alert-warning">
            <h4>No runs logged yet.</h4>
          </div>
        </div>
      </>
    );
  }

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
