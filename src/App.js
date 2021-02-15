import { useState } from "react";
import "./App.css";

const locationForecastEndpoint = "";
const convertPlaceToCoordinates = place => {};

function App() {
  const [place, setPlace] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [weatherData, setWeatherData] = useState({});

  fetchWeatherData()... 

  return (
    <div className="App">
      {/* <SearchComponent /> */}
      {/* <Location /> */}
      <CurrentConditionsComponent place={place} currentConditions={weatherData.currentConditions} />
      {/* <FutureForecast /> */}
    </div>
  );
}

export default App;
