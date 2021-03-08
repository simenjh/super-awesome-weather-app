import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as TempIcon } from "./assets/temp_icon.svg";
import { ReactComponent as UmbrellaIcon } from "./assets/umbrella_icon.svg";
import { ReactComponent as WindIcon } from "./assets/wind-icons/wind_icon.svg";

const CurrentConditionsComponent = ({ location, currentConditions }) => {
  const details = currentConditions.instant.details;
  const weatherIconPath = `weather-icons/svg/${currentConditions.next_1_hours.summary.symbol_code}`;
  const precipitation_amount =
    currentConditions.next_1_hours.details.precipitation_amount;

  return (
    <div className="flex flex-col items-center bg-gray-50 px-12 py-10 rounded">
      <div className="font-md text-3xl mb-3">{location}</div>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="text-gray-700 ml-1.5">Current weather</div>
        <div className="px-4 py-5 sm:p-6">
          <dt className="flex text-5xl font-md text-gray-700 truncate flex-wrap">
            <SVGIcon
              className="self-center mr-4"
              path={weatherIconPath}
              width={"50px"}
            />
            <div className="flex mr-7">
              <TempIcon width={"30px"} />
              <span className="text-red-600">{details.air_temperature}°C</span>
            </div>
            <div className="text-blue-500 flex mr-7">
              <UmbrellaIcon className="mr-1" width={"30px"} />
              <span>
                {precipitation_amount}
                <span className="text-xl">mm</span>
              </span>
            </div>
            <div className="flex">
              <WindIcon className="mr-1" width={"30px"} />
              <span className="mr-2">{details.wind_speed}m/s</span>
              <SVGIcon
                className="self-end"
                fill={"#374151"}
                path={windFromDirectionPath(details.wind_from_direction)}
                width={"30px"}
                height={"30px"}
              />
            </div>
          </dt>
        </div>
      </div>
    </div>
  );
};

export default CurrentConditionsComponent;

const SVGIcon = ({ path, ...rest }) => {
  const ImportedIconRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const importIcon = async () => {
      try {
        ImportedIconRef.current = (
          await import(
            `!!@svgr/webpack?-svgo,+titleProp,+ref!./assets/${path}.svg`
          )
        ).default;
      } catch (err) {
        // Your own error handling logic, throwing error for the sake of
        // simplicity
        throw err;
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [path]);

  if (!loading && ImportedIconRef.current) {
    const { current: ImportedIcon } = ImportedIconRef;
    return <ImportedIcon {...rest} />;
  }

  return null;
};

const windFromDirectionPath = (windFromDirection) => {
  const beginningOfPath = "wind-icons/";
  let fileName = "";

  if (windFromDirection >= 337.5 && windFromDirection < 22.5)
    fileName = "wind_north";
  else if (windFromDirection >= 22.5 && windFromDirection < 67.5)
    fileName = "wind_northeast";
  else if (windFromDirection >= 67.5 && windFromDirection < 112.5)
    fileName = "wind_east";
  else if (windFromDirection >= 112.5 && windFromDirection < 157.5)
    fileName = "wind_southeast";
  else if (windFromDirection >= 157.5 && windFromDirection < 202.5)
    fileName = "wind_south";
  else if (windFromDirection >= 202.5 && windFromDirection < 247.5)
    fileName = "wind_southwest";
  else if (windFromDirection >= 247.5 && windFromDirection < 292.5)
    fileName = "wind_west";
  else if (windFromDirection >= 292.5 && windFromDirection < 337.5)
    fileName = "wind_northwest";

  return beginningOfPath + fileName;
};
