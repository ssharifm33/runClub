import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import './RouteView.css';


function RouteView() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const storedRoutes = JSON.parse(localStorage.getItem('routes')) || [];
    setRoute(storedRoutes[id]);
  }, [id]);

  if (!route) {
    return <div>Loading...</div>;
  }

  const center = route.positions[0];

  return (
      <div className="container">
          <h1>Route Details</h1>
          <p>Total Distance: {route.distance} km</p>
          <MapContainer
              center={center}
              zoom={13}
              style={{height: '500px', width: '100%'}}
          >
              <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline positions={route.positions} color="blue"/>
          </MapContainer>
      </div>
  );
}

export default RouteView;
