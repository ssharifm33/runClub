import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import Navbar from './Navbar';
import './SavedRoutes.css'; // Create a CSS file for styling

function SavedRoutes() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null); // To handle selected route

  useEffect(() => {
    // Fetch all saved routes from the back end
    fetch(`${process.env.REACT_APP_API_BASE_URL}/routes`)
      .then((response) => response.json())
      .then((data) => setRoutes(data))
      .catch((error) => console.error('Error fetching routes:', error));
  }, []);

  const selectRoute = (route) => {
    setSelectedRoute(route);
  };

  return (
    <>
      <Navbar />
      <div className="container saved-routes">
        <h1>Saved Routes</h1>
        <div className="row">
          <div className="col-md-4 route-list">
            <ul>
              {routes.map((route, index) => (
                <li key={index} onClick={() => selectRoute(route)}>
                  {route.name} - {route.distance} miles
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-8 route-map">
            {selectedRoute && (
              <MapContainer
                center={selectedRoute.positions[0]}
                zoom={13}
                style={{ height: '400px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline positions={selectedRoute.positions} color="blue" />
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SavedRoutes;
