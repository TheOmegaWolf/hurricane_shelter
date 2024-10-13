import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { AlertTriangle, MapPin, Phone, Bell, Info } from 'lucide-react';
import MainStyle from "./Styles/Main.module.css";
import CommonStyle from "./Styles/Common.module.css";

const Main = () => {
  const [currentPage, setCurrentPage] = useState("");

  if (currentPage) {
    const routes = {
      LiveLocation: "/liveLocationMap",
      NearbyShelters: "/nearbyShelters",
      EmergencyContacts: "/emergencyContacts",
      NotificationSettings: "/notifSettings",
      SafetyInfo: "/safetyInfo"
    };
    return <Navigate to={routes[currentPage]} />;
  }

  const buttons = [
    { label: "Nearby Shelters", icon: MapPin, page: "NearbyShelters" },
    { label: "Emergency Contacts", icon: Phone, page: "EmergencyContacts" },
    { label: "Notification Settings", icon: Bell, page: "NotificationSettings" },
    { label: "Safety Tips", icon: Info, page: "SafetyInfo" },
  ];

  return (
    <div className={`${MainStyle.main} ${CommonStyle.dflex} ${CommonStyle.flexcolumn} ${CommonStyle.alignBoth}`}>
      <h1 className={MainStyle.title}>SafeScape!</h1>
      
      <button
        className={`${MainStyle.evacuateButton} ${CommonStyle.dflex} ${CommonStyle.alignBoth}`}
        onClick={() => setCurrentPage("LiveLocation")}
      >
        <AlertTriangle size={24} />
        <span>Evacuate!</span>
      </button>
      
      <div className={`${CommonStyle.dflex} ${CommonStyle.flexwrap} ${CommonStyle.alignBoth}`}>
        {buttons.map(({ label, icon: Icon, page }) => (
          <button
            key={page}
            className={`${MainStyle.menuButton} ${CommonStyle.dflex} ${CommonStyle.alignBoth}`}
            onClick={() => setCurrentPage(page)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Main;