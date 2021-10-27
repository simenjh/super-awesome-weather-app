import { useQuery } from "react-query";

const locationForecastEndpoint =
  "https://api.met.no/weatherapi/locationforecast/2.0/complete?";

const geoNameEndpoint = "https://secure.geonames.org/postalCodeSearchJSON";

const fetchLocationForecast = ({ state }) => {
  return () => {
    fetch(
      `${locationForecastEndpoint}lat=${state.coordinates.latitude}&lon=${state.coordinates.longitude}`,
      {
        headers: {
          "User-Agent": "https://github.com/simenjh/super-awesome-weather-app",
        },
      }
    );
  };
};

const fetchLocationCoordinates = ({ searchTerm }) => {
  return () => {
    fetch(
      `${geoNameEndpoint}?placename=${searchTerm}&maxRows=2&username=simen236&countryBias=NO`,
      {
        headers: {
          "User-Agent": "https://github.com/simenjh/super-awesome-weather-app",
        },
      }
    );
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
  handleSuccess,
  handleFailure,
  options = {}
) => {
  return useQuery(queryName, fetcherFunction(queryName, options), {
    staleTime: 900000,
    refetchInterval: 900000,
    select: transformData,
    onSuccess: handleSuccess,
    onError: handleFailure,
  });
};
