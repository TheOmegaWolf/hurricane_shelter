
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const Hurricane = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [error, setError] = useState('');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAy2QWA7e4rwbjq0uBd30LQ7BXAKAE_OF0', // Replace with your API key
    libraries: ['places', 'geometry'], // Ensure both 'places' and 'geometry' libraries are loaded
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError('Error fetching location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const findNearbyShelters = (map) => {
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: '5000', // Search within 5 kilometers
      keyword: 'disaster shelter', // Keyword for searching
      type: ['establishment'], // Searching for establishments
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Sort results by distance to find the nearest shelter
        const sortedShelters = results.sort((a, b) => {
          const distanceA = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(location.lat, location.lng),
            a.geometry.location
          );
          const distanceB = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(location.lat, location.lng),
            b.geometry.location
          );
          return distanceA - distanceB;
        });
        setShelters(sortedShelters);
      } else {
        setError('No nearby shelters found.');
      }
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location.lat && location.lng && isLoaded) {
      const map = new window.google.maps.Map(document.createElement('div')); // Dummy map for PlacesService
      findNearbyShelters(map);
    }
  }, [location, isLoaded]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const mapOptions = {
    zoom: 14,
    disableDefaultUI: true,
    draggable: true,
  };

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div>
      <h1>Nearby Disaster Relief Shelters</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {location.lat && location.lng ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location}
          options={mapOptions}
        >
          {/* Marker for user's current location */}
          <Marker position={location} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }} />

          {/* Markers for nearby shelters */}
          {shelters.map((shelter) => (
            <Marker
              key={shelter.place_id}
              position={{
                lat: shelter.geometry.location.lat(),
                lng: shelter.geometry.location.lng(),
              }}
              onClick={() => setSelectedShelter(shelter)}
            />
          ))}

          {/* InfoWindow to display shelter details when a marker is clicked */}
          {selectedShelter && (
            <InfoWindow
              position={{
                lat: selectedShelter.geometry.location.lat(),
                lng: selectedShelter.geometry.location.lng(),
              }}
              onCloseClick={() => setSelectedShelter(null)}
            >
              <div>
                <h2>{selectedShelter.name}</h2>
                <p>{selectedShelter.vicinity}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <p>Fetching your current location...</p>
      )}
    </div>
  );
};

export default Hurricane;
