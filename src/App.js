import { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import SearchLocationComponent from "./SearchLocationComponent";

export const weatherReducer = (state, action) => {
  switch (action.type) {
    case "WEATHER_FETCH_LOCALSTORAGE":
      return {
        ...state,
        isLoading: false,
        isError: false,
        location: action.payload.location,
        coordinates: { ...action.payload.coordinates },
        currentConditions: action.payload.currentConditions,
        expires: action.payload.expires,
      };
    case "WEATHER_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "WEATHER_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        currentConditions: action.payload.currentConditions,
        expires: action.payload.expires,
      };
    case "WEATHER_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "SET_PLACE_COORDINATES":
      return {
        ...state,
        location: action.payload.location,
        coordinates: action.payload.coordinates,
      };
    default:
      throw new Error();
  }
};

const locationForecastEndpoint =
  "https://api.met.no/weatherapi/locationforecast/2.0/compact?";

const extractCurrentConditions = (rawData) => {
  const timeseries = rawData.properties.timeseries;
  const nowString = new Date().toISOString().substring(0, 13);
  const currentWeather = timeseries.find(
    (weather) => weather.time.substring(0, 13) === nowString
  );
  return currentWeather.data;
};

const updateLocalStorage = (currentConditions, expires) => {
  localStorage.setItem("currentConditions", JSON.stringify(currentConditions));
  localStorage.setItem("expires", JSON.stringify(expires));
};

const App = () => {
  const [weather, dispatchWeather] = useReducer(weatherReducer, {
    isLoading: false,
    isError: false,
    location: null,
    coordinates: null,
    currentConditions: null,
    expires: null,
  });

  console.log(weather);

  const fetchWeatherData = useCallback(async () => {
    dispatchWeather({ type: "WEATHER_FETCH_INIT" });

    try {
      const res = await fetch(
        `${locationForecastEndpoint}lat=${weather.coordinates.latitude}&lon=${weather.coordinates.longitude}`,
        {
          headers: {
            "User-Agent":
              "https://github.com/simenjh/super-awesome-weather-app",
          },
        }
      );
      const rawData = await res.json();
      const currentConditions = extractCurrentConditions(rawData);
      const expires = res.headers.get("expires");
      updateLocalStorage(currentConditions, expires);
      dispatchWeather({
        type: "WEATHER_FETCH_SUCCESS",
        payload: { currentConditions, expires },
      });
    } catch (err) {
      dispatchWeather({ type: "WEATHER_FETCH_FAILURE" });
    }
  }, [weather.coordinates]);

  useEffect(() => {
    if (
      localStorage.location &&
      localStorage.coordinates &&
      localStorage.currentConditions &&
      localStorage.expires &&
      new Date(localStorage.getItem("expires")) > new Date()
    ) {
      dispatchWeather({
        type: "WEATHER_FETCH_LOCALSTORAGE",
        payload: {
          location: localStorage.getItem("location"),
          coordinates: JSON.parse(localStorage.getItem("coordinates")),
          currentConditions: JSON.parse(
            localStorage.getItem("currentConditions")
          ),
          expires: localStorage.getItem("expires"),
        },
      });
    } else if (localStorage.coordinates) {
      fetchWeatherData();
      setInterval(() => {
        fetchWeatherData();
      }, 1800000);
    }
  }, [fetchWeatherData]);

  return (
    <div className="App">
      <SearchLocationComponent dispatchWeather={dispatchWeather} />

      {weather.isError && <p>Something went wrong...</p>}

      {weather.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* <LocationComponent location={weather.location} /> */}
          {/* <CurrentConditionsComponent
            currentConditions={weather.currentConditions}
          /> */}
          {/* <FutureForecast /> */}
        </>
      )}
    </div>
  );
};

export default App;

const CurrentConditionsComponent = ({ currentConditions }) => {
  const details = currentConditions.instant.details;
  const weather_symbol = currentConditions.next_1_hours.summary.symbol_code;
  const precipitation_amount =
    currentConditions.next_1_hours.details.precipitation_amount;

  return (
    <div style={{ display: "flex" }}>
      <span className="currentWeatherElement">Some weather icon</span>
      <div className="currentWeatherElement">
        <span>Temp icon</span>
        <span>{details.air_temperature}</span>
      </div>
      <div className="currentWeatherElement">
        <span>Precip icon</span>
        <span>{precipitation_amount}</span>
      </div>
      <div className="currentWeatherElement">
        <span>Wind icon</span>
        <span>{details.wind_direction}</span>
      </div>
    </div>
  );
};
