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
    <div className="flex flex-col items-center py-10 mb-10 bg-gray-300 rounded">
      <div className="mb-3 text-4xl text-gray-700">{location}</div>
      <div className="w-3/5 bg-white rounded-lg shadow md:w-4/5 ">
        <div className="text-gray-700 ml-1.5 font-medium">Current weather</div>
        <div className="px-2 py-5">
          <div className="flex flex-col text-5xl text-gray-700 md:flex-row font-md">
            <div className="md:flex-auto">
              <SVGIcon
                className="w-14"
                path={`${weatherIconPath}${currentConditions.next_1_hours.summary.symbol_code}`}
              />
            </div>
            <div className="flex md:flex-auto">
              <TempIcon width={"30px"} />
              <span className={`${tempColor}`}>
                {round(details.air_temperature)}°
              </span>
            </div>
            <div className="flex text-blue-500 md:flex-auto">
              <UmbrellaIcon className="mr-1" width={"30px"} />
              <span>
                {round(precipitation_amount)}
                <span className="text-xl">mm</span>
              </span>
            </div>
            <div className="flex md:flex-auto">
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
