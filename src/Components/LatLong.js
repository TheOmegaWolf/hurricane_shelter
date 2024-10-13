import React, { useState, useEffect } from "react";
import { fromAddress } from "react-geocode";
const LatLong = ({location}) => {
  const [displayLocation, setDisplayLocation] = useState({})
  const saveToCache = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active.postMessage({
          type: 'CACHE_STATE',
          key: '/my-data', // Define a unique key for the cache
          data: displayLocation,
        });
      });
    }
  };
  useEffect(() => {
    getFromCache()
  },[])
  useEffect(() => {
    // Save state data to cache when the component mounts
    saveToCache();
  }, [displayLocation]); // You can adjust the dependencies as needed
  const getFromCache = async () => {
    const cache = await caches.open('my-app-cache-v1');
    const response = await cache.match('/my-data');
    if (response) {
      const cachedData = await response.json();
      setDisplayLocation(cachedData); // Update state with cached data
    }
  };
  
  const {lat,lng} = displayLocation
  return (<>{lat} / {lng}</>);
};

export default LatLong;
