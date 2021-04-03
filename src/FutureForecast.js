import { ReactComponent as TempIcon } from "./assets/temp_icon.svg";
import { ReactComponent as UmbrellaIcon } from "./assets/umbrella_icon.svg";
import { ReactComponent as WindIcon } from "./assets/wind-icons/wind_icon.svg";
import SVGIcon from "./SVGIcon";
import { windFromDirectionPath, weatherIconPath } from "./icon_paths";
import { useState } from "react";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const FutureForecast = ({ futureConditions }) => {
  const { todayForecast, futureDaysForecast } = extractForecasts(
    futureConditions
  );

  return (
    <div className="flex flex-col items-center" style={{ width: "100%" }}>
      <TodayForecastComponent todayForecast={todayForecast} />
      {/* {futureDaysForecast.map((day) => {
        return <ForecastForFutureDay day={day} />;
      })} */}
    </div>
  );
};

export default FutureForecast;

const extractForecasts = (futureConditions) => {
  const todayForecast = extractTodayForecast(futureConditions);
  const futureDaysForecast = extractFutureDaysForecast(futureConditions);
  return { todayForecast, futureDaysForecast };
};

const extractTodayForecast = (futureConditions) => {
  const todayString = new Date().toISOString().substring(0, 10);

  return futureConditions.filter((obj) => {
    return obj.time.substr(0, 10) === todayString;
  });
};

const extractFutureDaysForecast = (futureConditions) => {
  return 0;
};

const TodayForecastComponent = ({ todayForecast }) => {
  const todayText = formatTodayText();
  const todaySummary = extractTodayOverviewOrDetailed(todayForecast);
  const todayDetailed = extractTodayOverviewOrDetailed(todayForecast, true);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <DayHeader dayTitle={todayText} />
      <TodayOverviewComponent
        todayOverview={isExpanded ? todayDetailed : todaySummary}
      />
      {/* <TodayExpanded todayDetailed={todayDetailed} /> */}
    </div>
  );
};

const formatTodayText = () => {
  const today = new Date();
  return `Today, ${days[today.getDay()]} ${
    months[today.getMonth()]
  } ${today.getDate()}`;
};

const extractTodayOverviewOrDetailed = (todayForecast, hourly = false) => {
  let forecast = todayForecast;
  const hourlyInterval = 4;
  if (!hourly) {
    forecast = forecast.filter((weather) => {
      const hour = parseInt(weather.time.substring(11, 13));
      return hour % hourlyInterval === 0 || hour === 23;
    });
  }
  // return most important attributes
  return forecast.map((weather) => {
    const details = weather.data.instant.details;
    const nextOneHours = weather.data.next_1_hours;
    return {
      hour: weather.time.substring(11, 16),
      weatherSymbolCode: nextOneHours.summary.symbol_code,
      precipitationAmount: nextOneHours.details.precipitation_amount,
      airTemperature: details.air_temperature,
      windFromDirection: details.wind_from_direction,
      windSpeed: details.wind_speed,
    };
  });
};

const DayHeader = ({ dayTitle }) => {
  return (
    <div className="pl-4 bg-red-300" style={{ width: "100%" }}>
      {dayTitle}
    </div>
  );
};

const TodayOverviewComponent = ({ todayOverview }) => {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {todayOverview.map((hourlyWeather, index) => (
          <tr
            key={index}
            className={`border border-l-0 border-r-0 border-gray-400 ${
              index === 0 ? "border-t-0" : ""
            } ${index === todayOverview.length - 1 ? "border-b-0" : ""}`}
          >
            <td className="w-1/5">{hourlyWeather.hour}</td>
            <td className="w-1/5">
              <SVGIcon
                className="self-center"
                path={`${weatherIconPath}${hourlyWeather.weatherSymbolCode}`}
                width={"30px"}
              />
            </td>
            <td className="w-1/5">
              <div className="flex">
                <TempIcon width={"25px"} />
                <div
                  className={
                    hourlyWeather.airTemperature > 0
                      ? "text-red-600"
                      : "text-blue-500"
                  }
                >
                  {hourlyWeather.airTemperature}°C
                </div>
              </div>
            </td>
            <td className="w-1/5 text-blue-500">
              <div className="flex">
                <UmbrellaIcon className="mr-1" width={"25px"} />
                <div>
                  {hourlyWeather.precipitationAmount}
                  <span className="text">mm</span>
                </div>
              </div>
            </td>
            <td className="w-1/5">
              <div className="flex justify-end">
                <WindIcon className="mr-1" width={"25px"} />
                <span className="mr-2">{hourlyWeather.windSpeed}m/s</span>
                <SVGIcon
                  className="self-end"
                  fill={"#374151"}
                  path={windFromDirectionPath(hourlyWeather.windFromDirection)}
                  width={"30px"}
                  height={"30px"}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// const ForecastForFutureDay = ({day}) => {
//     return (

//      );
// }
