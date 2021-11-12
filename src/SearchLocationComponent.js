import React, { useState } from "react";
import { useFetch } from "./Datafetching";

const resetWeather = (setState) => {
  localStorage.clear();
  setState((state) => ({
    ...state,
    location: null,
    coordinates: { longitude: null, latitude: null },
    currentConditions: null,
    futureConditions: null,
  }));
};

const SearchLocationComponent = ({ setState }) => {
  const transformData = (data) => {
    if (data.postalCodes.length >= 1) {
      const postalCode = data.postalCodes[0];

      const coordinates = {
        longitude: Math.round(postalCode.lng * 10000) / 10000,
        latitude: Math.round(postalCode.lat * 10000) / 10000,
      };
      localStorage.setItem("location", postalCode.placeName);
      localStorage.setItem("coordinates", JSON.stringify(coordinates));

      setState((state) => ({
        ...state,
        location: postalCode.placeName,
        coordinates,
      }));
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const { isLoading, isError, refetch } = useFetch(
    "location-coordinates",
    transformData,
    { enabled: false, searchTerm }
  );

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    resetWeather(setState);
    refetch();
  };

  return (
    <>
      <form onSubmit={handleSearchSubmit}>
        <SearchFieldButton
          handleSearchInput={handleSearchInput}
          searchTerm={searchTerm}
        />
      </form>
      {isLoading && <p>Loading...</p>}
      {isError && <p>No locations found... Please try again.</p>}
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
        placeholder="Search location"
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
