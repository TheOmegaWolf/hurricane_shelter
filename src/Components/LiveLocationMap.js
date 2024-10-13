
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

const LiveLocationMap = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [shelters, setShelters] = useState([]);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [directions, setDirections] = useState(null);
  const [error, setError] = useState("");

  const googleApiKey = "AIzaSyAy2QWA7e4rwbjq0uBd30LQ7BXAKAE_OF0"; // Replace with your API key

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
    libraries: ["places", "geometry"],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          setError("Error fetching location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location.lat && location.lng && isLoaded) {
      findNearbyShelters();
    }
  }, [location, isLoaded]);

  const findNearbyShelters = () => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: "5000",
      keyword: "disaster shelter",
      type: ["establishment"],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setShelters(results);
        if (results.length > 0) {
          const nearestShelter = results[0];
          setSelectedShelter(nearestShelter);
          handleCalculateRoute(nearestShelter.geometry.location);
        }
      } else {
        setError("No nearby shelters found.");
      }
    });
  };
//Mock
 /* const getNationalWeatherServiceApiData = async (location) => {
    // Mock API response to simulate a red zone
    const mockApiResponse = {
      properties: {
        periods: [
          {
            startTime: "2024-10-12T06:00:00-05:00",
            endTime: "2024-10-12T18:00:00-05:00",
            shortForecast: "Red Flag Warning",
          },
        ],
      },
    };
    return mockApiResponse;
  };*/

  const getNationalWeatherServiceApiData = async (location) => {
    const url = `https://api.weather.gov/gridpoints/TOP/31,80/forecast`; // Modify the URL with appropriate grid points
    const response = await axios.get(url);
    return response.data;
  };


  
  const checkIfRouteFallsUnderRedZone = async (route, nationalWeatherServiceApiData) => {
    const routePoints = route.routes[0].legs[0].steps;
    let cumulativeTime = 0; // Keep track of the cumulative travel time in seconds

    for (const point of routePoints) {
      // Calculate the travel time to this point (in seconds)
      const travelTimeToPoint = point.duration.value; // duration in seconds
      cumulativeTime += travelTimeToPoint;

      const travelTimestamp = new Date(Date.now() + cumulativeTime * 1000).toISOString(); // Calculate expected arrival time at this point

      const weatherData = nationalWeatherServiceApiData.properties.periods.find((period) => {
        return period.startTime <= travelTimestamp && period.endTime >= travelTimestamp;
      });

      if (weatherData && weatherData.shortForecast.includes("Red Flag Warning")) {
        return true; // Route falls in red zone
      }
    }

    return false; // No red zone in the route
  };

  const optimizeRoute = async (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true, // Request alternative routes
    };

    const response = await directionsService.route(request);
    const alternativeRoutes = response.routes.slice(1); // Skip the default route

    let optimizedRoute = response.routes[0]; // Initialize optimized route as the default route
    let optimizedDistance = Infinity; // Initialize optimized distance as infinity

    for (const route of alternativeRoutes) {
      const nationalWeatherServiceApiData = await getNationalWeatherServiceApiData(location);
      const isRedZone = await checkIfRouteFallsUnderRedZone(route, nationalWeatherServiceApiData);
      if (!isRedZone) {
        const routeDistance = calculateRouteDistance(route); // Calculate route distance
        if (routeDistance < optimizedDistance) {
          optimizedRoute = route;
          optimizedDistance = routeDistance;
        }
      }
    }

    return optimizedRoute;
  };

  const calculateRouteDistance = (route) => {
    let distance = 0;
    for (const leg of route.legs) {
      distance += leg.distance.value;
    }
    return distance;
  };

  const handleCalculateRoute = async (shelterCoords) => {
    const directionsService = new window.google.maps.DirectionsService();
    const request = {
      origin: location,
      destination: shelterCoords,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, async (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        const route = result;
        const nationalWeatherServiceApiData = await getNationalWeatherServiceApiData(location);

        const isRedZone = await checkIfRouteFallsUnderRedZone(route, nationalWeatherServiceApiData);

        if (isRedZone) {
          // Pass origin and destination for optimization
          const optimizedRoute = await optimizeRoute(location, shelterCoords);
          setDirections(optimizedRoute || route); // Fallback to original route if no optimized route found
        } else {
          setDirections(route); // No red zone, use the default route
        }
      } else {
        console.error(`Error fetching directions: ${status}`);
      }
    });
  };

  const handleOpenInMaps = () => {
    const destination = selectedShelter.geometry.location;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${destination.lat()},${destination.lng()}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const renderRouteSteps = (directions) => {
    if (!directions) return null;

    return (
      <div>
        <h3>Directions:</h3>
        <ol>
          {directions.routes[0].legs[0].steps.map((step, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: step.instructions }} />
          ))}
        </ol>
        <button onClick={handleOpenInMaps}>Open in Google Maps</button>
      </div>
    );
  };

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  const mapContainerStyle = {
    width: "100%",
    height: "600px",
  };

  return (
    <div>
      <h1>Hurricane Shelter Route Finder</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {location.lat && location.lng ? (
        <GoogleMap mapContainerStyle={mapContainerStyle} center={location} zoom={14}>
          <Marker
            position={location}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />

          {shelters.map((shelter) => (
            <Marker
              key={shelter.place_id}
              position={{
                lat: shelter.geometry.location.lat(),
                lng: shelter.geometry.location.lng(),
              }}
              onClick={() => {
                setSelectedShelter(shelter);
                handleCalculateRoute(shelter.geometry.location);
              }}
            />
          ))}

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

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: { strokeColor: "#FF0000" },
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <p>Fetching your current location...</p>
      )}
      {renderRouteSteps(directions)}
    </div>
  );
};

export default LiveLocationMap;
