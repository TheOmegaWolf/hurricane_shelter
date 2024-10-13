// src/EmergencyNotification.js
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmergencyNotification = () => {
  // List of mock emergency alerts
  const mockAlerts = [
    { id: 1, message: 'Flood warning in your area!' },
    { id: 2, message: 'Severe thunderstorm alert!' },
    { id: 3, message: 'Wildfire spreading rapidly nearby!' },
    { id: 4, message: 'Hurricane advisory issued!' },
    { id: 5, message: 'Tornado spotted in your vicinity!' },
  ];

  useEffect(() => {
    // Function to show a random mock notification
    const showMockNotification = () => {
      const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
      toast.error(`🚨 Emergency: ${randomAlert.message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    // Show a notification every 30 seconds
    const intervalId = setInterval(showMockNotification, 10000);

    // Initial notification when the component mounts
    showMockNotification();

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return <ToastContainer />;
};

export default EmergencyNotification;
