import { useState, useEffect } from "react";
import moment from "moment";
import SearchLocationComponent from "./SearchLocationComponent";
import CurrentConditionsComponent from "./CurrentConditions";
import FutureForecast from "./FutureForecast";
import { useFetch } from "./Datafetching";

const extractCurrentConditions = (rawData) => {
  const timeseries = rawData.properties.timeseries;
  const nowString = moment().format().substring(0, 13);
  const currentWeather = timeseries.find(
    (weather) => weather.time.substring(0, 13) === nowString
  );
  return currentWeather.data;
};

const extractFutureConditions = (rawData) => {
  return rawData.properties.timeseries;
};

const MainWeatherComponent = () => {
  const [state, setState] = useState({
    queryEnabled: false,
    location: null,
    coordinates: { longitude: null, latitude: null },
    currentConditions: null,
    futureConditions: null,
  });

  const extractData = (data) => {
    const currentConditions = extractCurrentConditions(data);
    const futureConditions = extractFutureConditions(data);
    setState({ ...state, currentConditions, futureConditions });
  };

  const { isLoading, isError, refetch } = useFetch(
    "weather-data",
    extractData,
    { enabled: state.queryEnabled, state }
  );

  useEffect(() => {
    const localStorageCoordinates = JSON.parse(
      localStorage.getItem("coordinates")
    );
    const localStorageLocation = localStorage.getItem("location");

    if (state.coordinates.longitude && state.coordinates.latitude) {
      if (!state.queryEnabled) setState({ ...state, queryEnabled: true });
      else refetch();
    } else if (localStorageCoordinates && localStorageLocation) {
      setState({
        ...state,
        coordinates: localStorageCoordinates,
        location: localStorageLocation,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.coordinates.longitude, state.coordinates.latitude]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center w-full">
        <SearchLocationComponent state={state} setState={setState} />

        {isError && <p>Something went wrong...</p>}

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="w-11/12 mb-5 md:w-4/5 lg:w-3/5 xl:w-2/5">
            {state.currentConditions && (
              <CurrentConditionsComponent
                location={state.location}
                currentConditions={state.currentConditions}
              />
            )}
            {state.futureConditions && (
              <FutureForecast futureConditions={state.futureConditions} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainWeatherComponent;
