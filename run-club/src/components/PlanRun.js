// PlanRun.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMapEvents } from 'react-leaflet';
import { getDistance } from 'geolib';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';

function PlanRun() {
  const [positions, setPositions] = useState([]);
  const [distance, setDistance] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(null); // State for user's location

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting current position:', error);
          // Set a default location if user denies access or there's an error
          setCurrentPosition([51.505, -0.09]); // Default to London
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCurrentPosition([51.505, -0.09]); // Default to London
    }
  }, []);

  const addPosition = (e) => {
    const newPositions = [...positions, [e.latlng.lat, e.latlng.lng]];
    setPositions(newPositions);
    if (newPositions.length > 1) {
      const totalDistance = calculateTotalDistance(newPositions);
      setDistance(totalDistance);
    }
  };

  const calculateTotalDistance = (positions) => {
    let total = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      const start = { latitude: positions[i][0], longitude: positions[i][1] };
      const end = { latitude: positions[i + 1][0], longitude: positions[i + 1][1] };
      total += getDistance(start, end);
    }
    return (total / 1000).toFixed(2); // Convert to km
  };

  const saveRoute = () => {
    const newRoute = { positions, distance };

    fetch('http://localhost:5001/routes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRoute),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Route saved!');
      });
  };

  // Component to handle map clicks
  function ClickHandler() {
    useMapEvents({
      click: addPosition,
    });
    return null;
  }

  return (
    <div className="container">
      <h1>Plan a New Run</h1>
      <p>Total Distance: {distance} km</p>
      {currentPosition ? (
        <MapContainer
          center={currentPosition}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {positions.length > 0 && <Polyline positions={positions} color="blue" />}
          <ClickHandler />
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
      <button onClick={saveRoute}>Save Route</button>
    </div>
  );
}

export default PlanRun;
