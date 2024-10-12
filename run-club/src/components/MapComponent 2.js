import { Polyline } from 'react-leaflet';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);

  const MapClick = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkers([...markers, { lat, lng }]);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* Add markers */}
      {markers.map((position, index) => (
        <Marker key={index} position={[position.lat, position.lng]}>
          <Popup>Point {index + 1}</Popup>
        </Marker>
      ))}

      {/* Draw a polyline connecting the markers */}
      {markers.length > 1 && (
        <Polyline positions={markers.map(marker => [marker.lat, marker.lng])} />
      )}

      <MapClick />
    </MapContainer>
  );
};
