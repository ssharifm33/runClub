import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { getDistance } from 'geolib';
import mapboxgl from 'mapbox-gl';
import MapboxClient from '@mapbox/mapbox-sdk';
import Navbar from './Navbar'; // Import Navbar
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import './PlanRun.css'; // Import PlanRun CSS

// Initialize Mapbox client
const mapboxClient = MapboxClient({ accessToken: 'pk.eyJ1Ijoic3NoYXJpZm0iLCJhIjoiY20yOTlyanU0MDM4ajJsb2xub2Jyb2s2ZCJ9.iuqhZ7H-tAqqyw_NpHpqAg' });

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
  const [snappedPositions, setSnappedPositions] = useState([]); // For snapped positions
  const [distance, setDistance] = useState(0);
  const [elevationGain, setElevationGain] = useState(0); // Elevation gain state
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

  // Snap the point to the nearest road using Mapbox
  const snapToRoad = async (lat, lng) => {
    const response = await mapboxClient.directions.getDirections({
      profile: 'mapbox/walking',
      waypoints: [{ coordinates: [lng, lat] }],
      geometries: 'geojson',
    }).send();

    const snappedPoint = response.body.routes[0].geometry.coordinates[0]; // Get first snapped point
    return snappedPoint;
  };

  const addPosition = async (e) => {
    const newPosition = [e.latlng.lat, e.latlng.lng];
    const snapped = await snapToRoad(newPosition[0], newPosition[1]); // Snap to road

    // Update positions and snapped positions
    const newPositions = [...positions, newPosition];
    const newSnappedPositions = [...snappedPositions, snapped];
    
    setPositions(newPositions);
    setSnappedPositions(newSnappedPositions);

    if (newSnappedPositions.length > 1) {
      const totalDistance = calculateTotalDistance(newSnappedPositions);
      setDistance(totalDistance);

      const totalElevation = await calculateElevationGain(newSnappedPositions);
      setElevationGain(totalElevation);
    }
  };

  // Calculate total distance
  const calculateTotalDistance = (positions) => {
    let total = 0;
    for (let i = 0; i < positions.length - 1; i++) {
      const start = { latitude: positions[i][1], longitude: positions[i][0] };
      const end = { latitude: positions[i + 1][1], longitude: positions[i + 1][0] };
      total += getDistance(start, end);
    }
    return (total / 1000).toFixed(2); // Convert to km
  };

  // Fetch elevation data using Mapbox's terrain API
  const calculateElevationGain = async (positions) => {
    const coordinates = positions.map((pos) => `${pos[1]},${pos[0]}`).join('|');
    const response = await fetch(
      `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${coordinates}.json?layers=contour&access_token=pk.eyJ1Ijoic3NoYXJpZm0iLCJhIjoiY20yOTlyanU0MDM4ajJsb2xub2Jyb2s2ZCJ9.iuqhZ7H-tAqqyw_NpHpqAg`
    );
    const data = await response.json();
    let elevationGain = 0;

    for (let i = 1; i < data.features.length; i++) {
      const elevationDifference = data.features[i].properties.ele - data.features[i - 1].properties.ele;
      if (elevationDifference > 0) {
        elevationGain += elevationDifference;
      }
    }

    return elevationGain.toFixed(2); // Return elevation gain
  };

  // Save route as a JSON object to the server
  const saveRoute = () => {
    const newRoute = { positions: snappedPositions, distance, elevationGain };

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
        <p>Elevation Gain: {elevationGain} meters</p>
        <MapContainer
          center={currentLocation}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
          onClick={addPosition} // Capture click to add positions
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap currentLocation={currentLocation} />
          {snappedPositions.length > 0 && <Polyline positions={snappedPositions} color="blue" />}
        </MapContainer>
        <button onClick={saveRoute}>Save Route</button> {/* Single Save Button */}
      </div>
    </>
  );
}

export default PlanRun;
