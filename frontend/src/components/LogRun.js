import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Import the Navbar component
import './LogRun.css'; // Assuming you have the CSS already

function LogRun() {
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRun = { date, distance, time };

    fetch('${API_BASE_URL}/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRun),
    })
      .then((response) => response.json())
      .then(() => {
        navigate('/'); // Redirect to the dashboard
      });
  };

  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <div className="container">
        <h1>Log a New Run</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Distance (km):
            <input
              type="number"
              step="0.01"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Time (minutes):
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Log Run</button>
        </form>
      </div>
    </>
  );
}

export default LogRun;