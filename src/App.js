import { useEffect, useState } from "react";
import "./App.css";
import CommonStyle from "./Components/Styles/Common.module.css";
import { setDefaults } from "react-geocode";
import HurricaneRouteFinder from "./Components/HurricaneRouteFinder";
import Home from "./Components/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import EmergencyContacts from "./Components/EmergencyContacts";
import SafetyInfo from "./Components/SafetyInfo";
import NotifSettings from "./Components/NotifSettings";
import LiveLocationMap from "./Components/LiveLocationMap";
import EmergencyNotification from "./Components/EmergencyNotification";
import Hurricane from "./Components/Hurricane";

setDefaults({
  key: "AIzaSyAy2QWA7e4rwbjq0uBd30LQ7BXAKAE_OF0",
  language: "en",
  region: "es",
});

function App() {
  const [location, setLocation] = useState("");
  useEffect(() => {}, [location]);
  return (
    <Router>
      <div
        className={`${CommonStyle.dflex} ${CommonStyle.flexcolumn} ${CommonStyle.dflex} App`}
      >
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/liveLocationMap" element={<LiveLocationMap />} />
          <Route path="/nearbyShelters" element={<Hurricane />} />
          <Route path="/emergencyContacts" element={<EmergencyContacts />} />
          <Route path="/safetyInfo" element={<SafetyInfo />} />
          <Route path="/notifSettings" element={<NotifSettings />} />
        </Routes>
        <EmergencyNotification />
      </div>
    </Router>
  );
}

export default App;
