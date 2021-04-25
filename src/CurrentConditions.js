import { ReactComponent as TempIcon } from "./assets/temp_icon.svg";
import { ReactComponent as UmbrellaIcon } from "./assets/umbrella_icon.svg";
import { ReactComponent as WindIcon } from "./assets/wind-icons/wind_icon.svg";
import SVGIcon from "./SVGIcon";
import { windFromDirectionPath, weatherIconPath } from "./icon_paths";
const round = Math.round;

const CurrentConditionsComponent = ({ location, currentConditions }) => {
  const details = currentConditions.instant.details;
  const precipitation_amount =
    currentConditions.next_1_hours.details.precipitation_amount;
  const tempColor =
    details.air_temperature > 0 ? "text-red-600" : "text-blue-500";

  return (
    <div className="flex flex-col items-center px-12 py-10 mb-10 bg-gray-300 rounded">
      <div className="mb-3 text-4xl text-gray-700">{location}</div>
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="text-gray-700 ml-1.5 font-medium">Current weather</div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-wrap text-5xl text-gray-700 truncate font-md">
            <SVGIcon
              className="self-center mr-4"
              path={`${weatherIconPath}${currentConditions.next_1_hours.summary.symbol_code}`}
              width={"50px"}
            />
            <div className="flex mr-7">
              <TempIcon width={"30px"} />
              <span className={`${tempColor}`}>
                {round(details.air_temperature)}°
              </span>
            </div>
            <div className="flex text-blue-500 mr-7">
              <UmbrellaIcon className="mr-1" width={"30px"} />
              <span>
                {round(precipitation_amount)}
                <span className="text-xl">mm</span>
              </span>
            </div>
            <div className="flex">
              <WindIcon className="mr-1" width={"30px"} />
              <span className="mr-2">{round(details.wind_speed)}m/s</span>
              <SVGIcon
                className="self-end"
                fill={"#374151"}
                path={windFromDirectionPath(details.wind_from_direction)}
                width={"30px"}
                height={"30px"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentConditionsComponent;
