import React, { useState } from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import './LogRun.css'; // Assuming you have the CSS already

function LogRun() {
  const [date, setDate] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  // Removed navigate since it's not needed
  // const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRun = { date, distance, time };

    fetch(`${process.env.REACT_APP_API_BASE_URL}/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRun),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Run logged successfully:', data);
        // Reset form fields
        setDate('');
        setDistance('');
        setTime('');
        // Optionally show a success message
        alert('Run logged successfully!');
        // If you want to redirect, uncomment the next line
        // navigate('/'); // Redirect to the dashboard
      })
      .catch((error) => {
        console.error('Error logging run:', error);
        alert('Failed to log run. Please try again.');
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
            Distance (mi):
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
