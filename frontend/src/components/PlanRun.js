import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { getDistance } from 'geolib';
import MapboxClient from '@mapbox/mapbox-sdk'; // Import Mapbox SDK
import directions from '@mapbox/mapbox-sdk/services/directions'; // Import the Directions service
import Navbar from './Navbar'; // Import Navbar
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import './PlanRun.css'; // Import PlanRun CSS

// Initialize the Mapbox client
const mapboxClient = new MapboxClient({ accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN });

// Initialize the Directions service
const directionsService = directions(mapboxClient); // Create an instance of the directions service

// RecenterMap component to center map based on current location
function RecenterMap({ currentLocation }) {
  const map = useMap();
  useEffect(() => {
    if (currentLocation) {
      map.setView(currentLocation, 13); // Ensure the map centers on the current location with zoom level 13
    }
  }, [currentLocation, map]);

  return null;
}

// Function to handle click events on the map and add positions
function AddClickHandler({ onAddPosition }) {
  useMapEvents({
    click(e) {
      onAddPosition(e); // Call the function to add position on map click
    },
  });
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
  const snapToRoad = async (positions) => {
    if (positions.length < 2) {
      console.error('At least two waypoints are required to get a snapped route.');
      return null;
    }
  
    try {
      const waypoints = positions.map(pos => ({ coordinates: [pos[1], pos[0]] }));
  
      const response = await directionsService.getDirections({
        profile: 'walking', // Set to 'walking' or another valid profile
        waypoints: waypoints,
        geometries: 'geojson',
      }).send();
  
      if (response.body && response.body.routes.length > 0) {
        const snappedRoute = response.body.routes[0].geometry.coordinates;
        console.log('Snapped Route:', snappedRoute);
        return snappedRoute;
      } else {
        console.error('No routes found for the given coordinates.');
        return null;
      }
    } catch (error) {
      console.error('Error snapping to road:', error);
      return null;
    }
  };
  
  const addPosition = async (e) => {
    const newPosition = [e.latlng.lat, e.latlng.lng];
    const newPositions = [...positions, newPosition];
    
    setPositions(newPositions); // Update state with the new positions

    // Only snap if there are at least two points
    if (newPositions.length > 1) {
      const snappedRoute = await snapToRoad(newPositions);
      if (snappedRoute) {
        // Reverse the coordinates for Leaflet
        const reversedCoordinates = snappedRoute.map(coord => [coord[1], coord[0]]);
        setSnappedPositions(reversedCoordinates); // Update the snapped positions
        const totalDistance = calculateTotalDistance(reversedCoordinates);
        setDistance(totalDistance);
        const totalElevation = await calculateElevationGain(reversedCoordinates);
        setElevationGain(totalElevation);
      }
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
      `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery/${coordinates}.json?layers=contour&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
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
  // Save route as a JSON object to the server
const saveRoute = () => {
  // Prompt user to give the route a name
  const routeName = prompt('Please enter a name for this route');

  if (!routeName) {
    alert('Route name is required!');
    return;
  }

  const newRoute = {
    name: routeName,                // Add name for the route
    positions: snappedPositions,    // The snapped positions (coordinates) of the route
    distance: distance,             // Total distance of the route
    elevationGain: elevationGain,   // Total elevation gain
    date: new Date().toISOString()  // Store the date when the route was created
  };

  fetch('${API_BASE_URL}/routes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRoute),
  })
    .then((response) => response.json())
    .then(() => {
      alert('Route saved successfully!');
    })
    .catch((error) => {
      console.error('Error saving the route:', error);
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
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap currentLocation={currentLocation} />
          <AddClickHandler onAddPosition={addPosition} /> {/* Custom hook to capture clicks */}
          
          {/* Only render the Polyline if there are at least two positions */}
          {snappedPositions.length > 1 && (
            <Polyline positions={snappedPositions} color="blue" />
          )}
        </MapContainer>
        <button onClick={saveRoute}>Save Route</button> {/* Single Save Button */}
      </div>
    </>
  );
}

export default PlanRun;
