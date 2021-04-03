import { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import SearchLocationComponent from "./SearchLocationComponent";
import CurrentConditionsComponent from "./CurrentConditions";
import FutureForecast from "./FutureForecast";

export const weatherReducer = (state, action) => {
  switch (action.type) {
    case "WEATHER_FETCH_LOCALSTORAGE":
      return {
        ...state,
        isLoading: false,
        isError: false,
        location: action.payload.location,
        coordinates: action.payload.coordinates,
        currentConditions: action.payload.currentConditions,
        futureConditions: action.payload.futureConditions,
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
        futureConditions: action.payload.futureConditions,
        expires: action.payload.expires,
      };
    case "WEATHER_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "SET_COORDINATES":
      return {
        ...state,
        coordinates: action.payload.coordinates,
      };
    case "SET_PLACE_COORDINATES":
      return {
        ...state,
        location: action.payload.location,
        coordinates: action.payload.coordinates,
      };
    case "RESET_WEATHER":
      return {
        isLoading: false,
        isError: false,
        location: null,
        coordinates: { longitude: null, latitude: null },
        currentConditions: null,
        futureConditions: null,
        expires: null,
      };
    default:
      throw new Error();
  }
};

const locationForecastEndpoint =
  "https://api.met.no/weatherapi/locationforecast/2.0/complete?";

const extractCurrentConditions = (rawData) => {
  const timeseries = rawData.properties.timeseries;
  const nowString = new Date().toISOString().substring(0, 13);
  const currentWeather = timeseries.find(
    (weather) => weather.time.substring(0, 13) === nowString
  );
  return currentWeather.data;
};

const extractFutureConditions = (rawData) => {
  return rawData.properties.timeseries;
};

const updateLocalStorage = (currentConditions, futureConditions, expires) => {
  localStorage.setItem("currentConditions", JSON.stringify(currentConditions));
  localStorage.setItem("futureConditions", JSON.stringify(futureConditions));
  localStorage.setItem("expires", expires);
};

const App = () => {
  const [weather, dispatchWeather] = useReducer(weatherReducer, {
    isLoading: false,
    isError: false,
    location: null,
    coordinates: { longitude: null, latitude: null },
    currentConditions: null,
    futureConditions: null,
    expires: null,
  });

  // console.log(weather);

  // Fetch weather when coordinates are updated
  const fetchWeatherData = async () => {
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
      const futureConditions = extractFutureConditions(rawData);
      const expires = res.headers.get("expires");
      updateLocalStorage(currentConditions, futureConditions, expires);
      dispatchWeather({
        type: "WEATHER_FETCH_SUCCESS",
        payload: { currentConditions, futureConditions, expires },
      });
    } catch (err) {
      dispatchWeather({ type: "WEATHER_FETCH_FAILURE" });
    }
  };

  // Cases
  // 1. A user enters a location and clicks search. The coordinates should be set in weather, triggering a redefine of fetchWeather. This triggers useEffect.
  // 2. The program has no state, but has non-expired weather data in localstorage. Set localstorage data as the weather state.
  // 3. The program has no state, and localstorage data has expired. Pass coordinates from localstorage to weather.
  // 4.
  useEffect(() => {
    // console.log("Run useeffect");
    const localstorageExpires = localStorage.getItem("expires");
    const localStorageCoordinates = JSON.parse(
      localStorage.getItem("coordinates")
    );
    const localStorageLocation = localStorage.getItem("location");
    if (
      localStorage.location &&
      localStorage.coordinates &&
      localStorage.currentConditions &&
      localStorage.futureConditions &&
      localStorage.expires &&
      new Date(localstorageExpires) > new Date() &&
      localstorageExpires !== weather.expires
    ) {
      // console.log("Pass weather data from localstorage to weather");
      dispatchWeather({
        type: "WEATHER_FETCH_LOCALSTORAGE",
        payload: {
          location: localStorage.getItem("location"),
          coordinates: JSON.parse(localStorage.getItem("coordinates")),
          currentConditions: JSON.parse(
            localStorage.getItem("currentConditions")
          ),
          futureConditions: JSON.parse(
            localStorage.getItem("futureConditions")
          ),
          expires: localStorage.getItem("expires"),
        },
      });
      setInterval(() => {
        fetchWeatherData();
      }, 1800000);
    } else if (weather.coordinates.longitude && !weather.currentConditions) {
      // console.log("fetch weather data");
      fetchWeatherData();
      setInterval(() => {
        fetchWeatherData();
      }, 1800000);
    } else if (localStorageCoordinates && !weather.currentConditions) {
      // console.log("Dispatch SET_PLACE_COORDINATES");
      dispatchWeather({
        type: "SET_PLACE_COORDINATES",
        payload: {
          location: localStorageLocation,
          coordinates: localStorageCoordinates,
        },
      });
    }
  }, [
    weather.coordinates.longitude,
    weather.coordinates.latitude,
    weather.expires,
  ]);

  return (
    <div className="App">
      <div className="outerContainer" style={{ paddingTop: "10px" }}>
        <SearchLocationComponent dispatchWeather={dispatchWeather} />

        {weather.isError && <p>Something went wrong...</p>}

        {weather.isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {weather.currentConditions && (
              <CurrentConditionsComponent
                location={weather.location}
                currentConditions={weather.currentConditions}
              />
            )}
            {weather.futureConditions && (
              <FutureForecast futureConditions={weather.futureConditions} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
