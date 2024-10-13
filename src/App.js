import { useEffect, useState } from "react";
import "./App.css";
import CommonStyle from "./Components/Styles/Common.module.css";
import { setDefaults } from "react-geocode";
import LatLong from "./Components/LatLong";
import WeatherRoutingApp from "./Components/WeatherRoutingApp";
import HurricaneRouteFinder from "./Components/HurricaneRouteFinder";
import HurricaneHeatmap from "./Components/HurricaneHeatMap";
import Home from "./Components/Home";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import EmergencyContacts from "./Components/EmergencyContacts";
import SafetyInfo from "./Components/SafetyInfo";
import NotifSettings from "./Components/NotifSettings";

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
          {/* <WeatherRoutingApp /> */}
          {/* <HurricaneRouteFinder /> */}
          {/* <HurricaneHeatmap /> */}
          <Route exact path="/" element={<Home />} />
          <Route path="/weatherRoutingApp" element={<WeatherRoutingApp />} />
          <Route path="/nearbyShelters" element={<HurricaneRouteFinder />} />
          <Route path="/emergencyContacts" element={<EmergencyContacts />} />
          <Route path="/safetyInfo" element={<SafetyInfo />} />
          <Route path="/notifSettings" element={<NotifSettings />} />
          {/* <Route path="/hurricaneHeatMap" element={<HurricaneHeatmap />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
