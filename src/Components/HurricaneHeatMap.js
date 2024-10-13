import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, HeatmapLayer, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 25,
  lng: -70
};

const libraries = ['visualization'];

const HurricaneHeatMap = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyAy2QWA7e4rwbjq0uBd30LQ7BXAKAE_OF0",
    libraries
  });

  const [map, setMap] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  const getHurricaneWeight = (sshs) => {
    switch (sshs) {
      case "TD": return 1;
      case "TS": return 2;
      case "1": return 3;
      case "2": return 4;
      case "3": return 5;
      case "4": return 6;
      case "5": return 7;
      default: return 1;
    }
  };

  const fetchHurricanes = useCallback(async () => {
    if (!isLoaded) return;

    try {
      // Fetch data from the National Hurricane Center API
      const response = await fetch('https://www.nhc.noaa.gov/CurrentStorms.json');
      const data = await response.json();
      
      let newHeatmapData = [];
      let newMarkers = [];
      let debugText = '';

      if (data && data.features && data.features.length > 0) {
        data.features.forEach(feature => {
          if (feature.geometry && feature.geometry.type === "Point") {
            const [lng, lat] = feature.geometry.coordinates;
            const weight = getHurricaneWeight(feature.properties.intensityTrend);
            newHeatmapData.push({ location: new window.google.maps.LatLng(lat, lng), weight });
            newMarkers.push({ position: { lat, lng }, title: feature.properties.name });
            debugText += `Hurricane: ${feature.properties.name}, Lat: ${lat}, Lng: ${lng}, Intensity: ${feature.properties.intensityTrend}\n`;
          }
        });
      } else {
        debugText = 'No current storm data available.';
      }

      setHeatmapData(newHeatmapData);
      setMarkers(newMarkers);
      setDebugInfo(debugText);
    } catch (error) {
      console.error("Error fetching hurricane data:", error);
      setDebugInfo(`Error: ${error.message}`);
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      fetchHurricanes();
    }
  }, [isLoaded, fetchHurricanes]);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={4}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {heatmapData.length > 0 && (
          <HeatmapLayer
            data={heatmapData}
            options={{
              radius: 20,
              opacity: 0.6,
              dissipating: true,
              maxIntensity: 7,
            }}
          />
        )}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.title}
          />
        ))}
      </GoogleMap>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        <h3>Debug Information:</h3>
        <p>{debugInfo}</p>
      </div>
    </div>
  );
};

export default HurricaneHeatMap;