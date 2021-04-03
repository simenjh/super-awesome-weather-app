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

const resetWeather = (dispatchWeather) => {
  localStorage.clear();
  dispatchWeather({ type: "RESET_WEATHER" });
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

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    resetWeather(dispatchWeather);
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
        localStorage.setItem("location", postalCode.placeName);
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
        <SearchFieldButton
          handleSearchInput={handleSearchInput}
          searchTerm={searchTerm}
        />
      </form>
      {searchLocations.isLoading && <p>Loading...</p>}
      {searchLocations.isError && (
        <p>No locations found... Please try again.</p>
      )}
    </>
  );
};

export default SearchLocationComponent;

const SearchFieldButton = ({ handleSearchInput, searchTerm }) => {
  return (
    <div className="relative pt-2 mx-auto mb-10 text-gray-600">
      <input
        className="h-10 px-5 pr-16 text-sm bg-white border-2 border-gray-300 rounded-lg focus:outline-none"
        type="search"
        name="search"
        placeholder="Search"
        onChange={handleSearchInput}
      />
      <button
        type="submit"
        className="absolute top-0 right-0 mt-5 mr-4"
        disabled={!searchTerm}
      >
        <svg
          className="w-4 h-4 text-gray-600 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          viewBox="0 0 56.966 56.966"
          style={{ enableBackground: "new 0 0 56.966 56.966" }}
          xmlSpace="preserve"
          width="512px"
          height="512px"
        >
          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
        </svg>
      </button>
    </div>
  );
};
