import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { getDistance } from 'geolib';
import Navbar from './Navbar'; // Import Navbar
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import './PlanRun.css'; // Import PlanRun CSS

// Custom hook to update the map's center
function RecenterMap({ currentLocation }) {
  const map = useMap();
  useEffect(() => {
    if (currentLocation) {
      map.setView(currentLocation);
    }
  }, [currentLocation, map]);

  return null;
}

function PlanRun() {
  const [positions, setPositions] = useState([]);
  const [distance, setDistance] = useState(0);
  const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]); // Default location

  // Fetch current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting current location", error);
        }
      );
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

  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <div className="container plan-run">
        <h1>Plan a New Run</h1>
        <p>Total Distance: {distance} km</p>
        <MapContainer
          center={currentLocation}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
          onClick={addPosition}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Call RecenterMap component to update map center */}
          <RecenterMap currentLocation={currentLocation} />
          {positions.length > 0 && <Polyline positions={positions} color="blue" />}
        </MapContainer>
        <button onClick={saveRoute}>Save Route</button>
      </div>
    </>
  );
}

export default PlanRun;
