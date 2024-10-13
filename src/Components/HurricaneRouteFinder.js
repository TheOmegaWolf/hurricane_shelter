import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { setKey, fromAddress } from 'react-geocode';

const HurricaneRouteFinder = () => {
  const [origin, setOrigin] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [directions, setDirections] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [nearestShelter, setNearestShelter] = useState(null);

  const googleApiKey = 'AIzaSyAy2QWA7e4rwbjq0uBd30LQ7BXAKAE_OF0'; // Replace with your Google Maps API Key
  setKey(googleApiKey);

  // Sample shelter data
  const shelters = [
    { id: 1, name: 'Shelter 1', coords: { lat: 39.7392, lng:  104.9903 } }
  ];

  useEffect(() => {
    fetchDisasterData();
  }, []);

  const fetchDisasterData = async () => {
    try {
      const response = await fetch('https://api.weather.gov/alerts/active');
      const data = await response.json();
      const hurricaneAlerts = data.features.filter((alert) =>
        alert.properties.event.toLowerCase().includes('hurricane')
      );
      setDisasters(hurricaneAlerts);
    } catch (error) {
      console.error('Error fetching disaster data:', error);
    }
  };

  const findNearestShelter = (hurricaneAlerts, originCoords) => {
    let lowestRiskShelter = null;
    let lowestRiskDistance = Infinity;

    shelters.forEach((shelter) => {
      const distance = calculateDistance(originCoords, shelter.coords);
      const isLowRisk = isShelterLowRisk(shelter, hurricaneAlerts);

      if (isLowRisk && distance < lowestRiskDistance) {
        lowestRiskDistance = distance;
        lowestRiskShelter = shelter;
      }
    });

    setNearestShelter(lowestRiskShelter);
  };

  const isShelterLowRisk = (shelter, hurricaneAlerts) => {
    // Check if the shelter is in a disaster area
    return hurricaneAlerts.every((alert) => !isPointInDisasterArea(shelter.coords, alert.properties.geocode));
  };

  const calculateDistance = (coords1, coords2) => {
    const latDiff = coords1.lat - coords2.lat;
    const lngDiff = coords1.lng - coords2.lng;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  };

  const handleCalculateRoute = async () => {
    const originCoords = await getCoordinates(origin);
    setOriginCoords(originCoords); // Set the origin coordinates state
    if (!originCoords || !nearestShelter) return;

    const destinationCoords = nearestShelter.coords;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: originCoords,
        destination: destinationCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  };

  const getCoordinates = async (address) => {
    try {
      const response = await fromAddress(address);
      const { lat, lng } = response.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }
  };

  const isPointInDisasterArea = (point, geocode) => {
    if (!geocode || !geocode.Polygon) return false;

    const [polygon] = geocode.Polygon[0].split(' ');
    const coords = polygon.split(',');

    const [latMin, lonMin, latMax, lonMax] = coords.map(parseFloat);
    return (
      point.lat >= latMin &&
      point.lat <= latMax &&
      point.lng >= lonMin &&
      point.lng <= lonMax
    );
  };

  const handleFindShelter = async () => {
    const originCoords = await getCoordinates(origin);
    setOriginCoords(originCoords);
    findNearestShelter(disasters, originCoords);
  };

  return (
    <div>
      <h1>Hurricane Shelter Route Finder</h1>
      <input
        type="text"
        placeholder="Enter your location"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <button onClick={handleFindShelter}>Find Nearest Shelter</button>
      <button onClick={handleCalculateRoute}>Find Route</button>

      <LoadScript googleMapsApiKey={googleApiKey}>
        <GoogleMap
          mapContainerStyle={{ height: '400px', width: '100%' }}
          center={nearestShelter ? nearestShelter.coords : { lat: 0, lng: 0 }}
          zoom={10}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: { strokeColor: '#FF0000' },
              }}
            />
          )}
          {nearestShelter && (
            <Marker position={nearestShelter.coords} label={nearestShelter.name} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default HurricaneRouteFinder;
