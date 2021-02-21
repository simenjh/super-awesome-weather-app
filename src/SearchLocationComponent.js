import React, { useReducer, useState } from "react";

const searchLocationReducer = (state, action) => {
  switch (action.type) {
    case "LOCATION_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "LOCATION_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
      };
    case "LOCATION_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const geoNameEndpoint = "http://api.geonames.org/postalCodeSearchJSON";

const SearchLocationComponent = ({ dispatchWeather }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [searchLocations, dispatchSearchLocations] = useReducer(
    searchLocationReducer,
    {
      isLoading: false,
      isError: false,
    }
  );

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async () => {
    dispatchSearchLocations({ type: "LOCATION_FETCH_INIT" });
    try {
      const rawData = await fetch(
        `${geoNameEndpoint}?placename=${searchTerm}&maxRows=2&username=simen236`
      );
      const locations = await rawData.json();
      if (locations.postalCodes.length >= 1) {
        const postalCode = locations.postalCodes[0];
        dispatchSearchLocations({ type: "LOCATION_FETCH_SUCCESS" });

        const coordinates = {
          longitude: Math.round(postalCode.lng * 10000) / 10000,
          latitude: Math.round(postalCode.lat * 10000) / 10000,
        };
        localStorage.setItem("location", postalCode.location);
        localStorage.setItem("coordinates", JSON.stringify(coordinates));

        dispatchWeather({
          type: "SET_PLACE_COORDINATES",
          payload: {
            location: postalCode.placeName,
            coordinates,
          },
        });
      } else {
        dispatchSearchLocations({ type: "LOCATION_FETCH_FAILURE" });
      }
    } catch (err) {
      dispatchSearchLocations({ type: "LOCATION_FETCH_FAILURE" });
    }
  };

  return (
    <>
      <form onSubmit={handleSearchSubmit}>
        <label htmlFor="search"></label>
        <input id="search" type="text" onChange={handleSearchInput} />
        <button type="submit" disabled={!searchTerm}></button>
      </form>
      {searchLocations.isLoading && <p>Loading...</p>}
      {searchLocations.isError && (
        <p>No locations found... Please try again.</p>
      )}
    </>
  );
};

export default SearchLocationComponent;
