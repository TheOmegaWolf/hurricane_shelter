import React, { useState, useEffect } from "react";
import { setKey } from "react-geocode";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Polygon,
  Polyline,
} from "@react-google-maps/api";
import axios from "axios";

const WeatherRoutingApp = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState("");
  const [currentCoords, setCurrentCoords] = useState(null);
  const [disasters, setDisasters] = useState([]);
  const [directions, setDirections] = useState(null);
  const [safeRoute, setSafeRoute] = useState(null);
  const [consideredPoints, setConsideredPoints] = useState([]);
  const [neglectedPoints, setNeglectedPoints] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);

  // Set your Google Maps API key here
  const googleApiKey = "AIzaSyAy2QWA7e4rwbjq0uBd30LQ7BXAKAE_OF0";
  setKey(googleApiKey);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentCoords(coords);
        setOrigin(coords);
      },
      (error) => console.error(error)
    );
  }, []);

  useEffect(() => {
    fetch("https://api.weather.gov/alerts/active")
      .then((response) => response.json())
      .then((data) => {
        const hurricaneAlerts = data.features.filter((alert) =>
          alert.properties.event.toLowerCase().includes("hurricane")
        );
        setDisasters(hurricaneAlerts);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    axios
      .get("https://api.weather.gov/alerts/active", {
        params: {
          conus: true,
          format: "json",
          maxAgeSec: 43200,
        },
      })
      .then((response) => {
        setWeatherAlerts(response.data.features);
      })
      .catch((error) => console.error(error));
  }, []);

  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${googleApiKey}`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error(`Geocoding failed: ${data.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCalculateRoute = async () => {
    if (!origin || !destination) return;

    const destinationCoords = await getCoordinates(destination);

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin,
        destination: destinationCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          filterSafeRoute(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  };

  const filterSafeRoute = (route) => {
    const path = route.routes[0].overview_path;
    const considered = [];
    const neglected = [];

    path.forEach((point) => {
      const isSafe = disasters.every(
        (disaster) => !isPointInDisasterArea(point, disaster.properties.geocode)
      );

      if (isSafe) {
        considered.push({ lat: point.lat(), lng: point.lng() });
      } else {
        neglected.push({ lat: point.lat(), lng: point.lng() });
      }
    });

    setConsideredPoints(considered);
    setNeglectedPoints(neglected);

    if (neglected.length === 0) {
      setSafeRoute(route);
    } else {
      alert("No safe route available. A disaster zone is on the way.");
    }
  };

  const isPointInDisasterArea = (point, geocode) => {
    if (!geocode || !geocode.Polygon) return false;

    const [polygon] = geocode.Polygon[0].split(" ");
    const coords = polygon.split(",");

    const [latMin, lonMin, latMax, lonMax] = coords.map(parseFloat);
    return (
      point.lat() >= latMin &&
      point.lat() <= latMax &&
      point.lng() >= lonMin &&
      point.lng() <= lonMax
    );
  };

  const getDisasterPolygons = () => {
    return disasters.map((disaster, index) => {
      const geocode = disaster.properties.geocode;
      if (geocode && geocode.Polygon) {
        const coordinates = geocode.Polygon[0].split(" ").map((pair) => {
          const [lat, lng] = pair.split(",");
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        });
        return (
          <Polygon
            key={index}
            paths={coordinates}
            options={{
              fillColor: "red",
              fillOpacity: 0.4,
              strokeColor: "red",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        );
      }
      return null;
    });
  };

  const getWeatherAlerts = () => {
    return weatherAlerts.map((alert, index) => {
      const geocode = alert.properties.geocode;
      if (geocode && geocode.Polygon) {
        const coordinates = geocode.Polygon[0].split(" ").map((pair) => {
          const [lat, lng] = pair.split(",");
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        });
        return (
          <Polygon
            key={index}
            paths={coordinates}
            options={{
              fillColor: "yellow",
              fillOpacity: 0.4,
              strokeColor: "yellow",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        );
      }
      return null;
    });
  };

  return (
    <div>
      <h1>Safe Route Finder</h1>
      <input
        type="text"
        placeholder="Enter destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleCalculateRoute}>Calculate Route</button>
      <button
        onClick={() =>
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination}`
          )
        }
      >
        Open in Google Maps
      </button>

      <LoadScript googleMapsApiKey={googleApiKey}>
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          center={currentCoords || { lat: 0, lng: 0 }}
          zoom={8}
        >
          {directions && (
            <DirectionsRenderer
              directions={safeRoute || directions}
              options={{
                polylineOptions: {
                  strokeColor: safeRoute ? "#00FF00" : "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 4,
                },
              }}
            />
          )}
          {getDisasterPolygons()}
          {getWeatherAlerts()}
          {/* Draw considered and neglected points */}
          {consideredPoints.length > 0 && (
            <Polyline
              path={consideredPoints}
              options={{
                strokeColor: "blue",
                strokeOpacity: 0.6,
                strokeWeight: 2,
              }}
            />
          )}
          {neglectedPoints.length > 0 && (
            <Polyline
              path={neglectedPoints}
              options={{
                strokeColor: "red",
                strokeOpacity: 0.6,
                strokeWeight: 2,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default WeatherRoutingApp;