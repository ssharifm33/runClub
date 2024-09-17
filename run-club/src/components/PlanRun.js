import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { getDistance } from 'geolib';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';

function PlanRun() {
  const [positions, setPositions] = useState([]);
  const [distance, setDistance] = useState(0);

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

  fetch('http://localhost:5001/routes', { // Updated port number
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
      <div className="container">
          <h1>Plan a New Run</h1>
          <p>Total Distance: {distance} km</p>
          <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              style={{height: '500px', width: '100%'}}
              onClick={addPosition}
          >
              <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {positions.length > 0 && <Polyline positions={positions} color="blue"/>}
          </MapContainer>
          <button onClick={saveRoute}>Save Route</button>
      </div>
  );
}

export default PlanRun;
