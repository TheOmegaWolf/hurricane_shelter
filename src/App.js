import { useEffect, useState } from "react";
import "./App.css";
import { setDefaults } from "react-geocode";
import LatLong from "./Components/LatLong";
import WeatherRoutingApp from "./Components/WeatherRoutingApp";
import HurricaneRouteFinder from "./Components/HurricaneRouteFinder";
import HurricaneHeatmap from "./Components/HurricaneHeatMap";


setDefaults({
  key: "AIzaSyAy2QWA7e4rwbjq0uBd30LQ7BXAKAE_OF0",
  language: "en",
  region: "es",
});
function App() {
  const [location, setLocation] = useState("");
  useEffect(() => {}, [location]);
  return (
    <div className="App">
      {/* <WeatherRoutingApp /> */}
      {/* <HurricaneRouteFinder /> */}
      <HurricaneHeatmap />
    </div>
  );
}

export default App;
