import { useQuery } from "react-query";

const locationForecastEndpoint =
  "https://api.met.no/weatherapi/locationforecast/2.0/complete?";

const geoNameEndpoint = "https://secure.geonames.org/postalCodeSearchJSON";

const fetchLocationForecast = ({ state }) => {
  return async () => {
    const res = await fetch(
      `${locationForecastEndpoint}lat=${state.coordinates.latitude}&lon=${state.coordinates.longitude}`,
      {
        headers: {
          "User-Agent": "https://github.com/simenjh/super-awesome-weather-app",
        },
      }
    );
    return await res.json();
  };
};

const fetchLocationCoordinates = ({ searchTerm }) => {
  return async () => {
    const res = await fetch(
      `${geoNameEndpoint}?placename=${searchTerm}&maxRows=2&username=simen236&countryBias=NO`,
      {
        headers: {
          "User-Agent": "https://github.com/simenjh/super-awesome-weather-app",
        },
      }
    );
    return await res.json();
  };
};

const fetcherFunction = (queryName, options) => {
  switch (queryName) {
    case "weather-data":
      return fetchLocationForecast(options);
    case "location-coordinates":
      return fetchLocationCoordinates(options);
    default:
      break;
  }
};

export const useFetch = (
  queryName,
  transformData,
  options = { enabled: false, handleSuccess: null, handleFailure: null }
) => {
  return useQuery(queryName, fetcherFunction(queryName, options), {
    enabled: options.enabled,
    staleTime: 900000,
    refetchInterval: 900000,
    // select: transformData,
    onSuccess: transformData,
    onError: options.handleFailure,
  });
};
