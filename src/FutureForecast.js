import { ReactComponent as TempIcon } from "./assets/temp_icon.svg";
import { ReactComponent as UmbrellaIcon } from "./assets/umbrella_icon.svg";
import { ReactComponent as WindIcon } from "./assets/wind-icons/wind_icon.svg";
import SVGIcon from "./SVGIcon";
import { windFromDirectionPath, weatherIconPath } from "./icon_paths";
import { useState } from "react";
const round = Math.round;

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
      {futureDaysForecast.map((day) => {
        return <ForecastForFutureDay key={day.dayNumber} day={day} />;
      })}
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
    return obj.time.substring(0, 10) === todayString;
  });
};

const extractFutureDaysForecast = (futureConditions) => {
  let futureDaysForecast = [];
  const today = new Date();
  for (let i = 1; i < 8; i++) {
    const futureDateString = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + i)
    )
      .toISOString()
      .substring(0, 10);
    futureDaysForecast.push({
      dayNumber: i,
      data: futureConditions.filter((obj) => {
        return (
          obj.time.substring(0, 10) === futureDateString &&
          !parseInt(obj.time.substring(11, 13) === 18)
        );
      }),
    });
  }
  if (futureDaysForecast[1].data.length === 18) {
    futureDaysForecast[1] = futureDaysForecast[1].data.filter((obj) => {
      return obj.time.substring(11, 13) !== "18";
    });
  }
  return futureDaysForecast;
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
      precipitationAmount: round(nextOneHours.details.precipitation_amount),
      airTemperature: round(details.air_temperature),
      windFromDirection: details.wind_from_direction,
      windSpeed: round(details.wind_speed),
    };
  });
};

const DayHeader = ({ dayTitle }) => {
  return (
    <div
      className="pt-1 pb-1 pl-2 text-lg text-center text-white bg-blue-400 rounded"
      style={{ width: "100%" }}
    >
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
            <td className="w-1/5 pt-2.5 pb-2.5">{hourlyWeather.hour}</td>
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
                  {hourlyWeather.airTemperature}°
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

const ForecastForFutureDay = ({ day }) => {
  const futureDayText = formatFutureDayText(day);
  const futureDaySummary = extractFutureDayOverviewOrDetailed(day.data);
  const futureDayDetailed =
    day.dayNumber === 1 || day.dayNumber === 2
      ? extractFutureDayOverviewOrDetailed(day.data, true)
      : null;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`w-full ${futureDayDetailed ? "cursor-pointer" : ""}`}
      onClick={futureDayDetailed ? () => setIsExpanded(!isExpanded) : null}
    >
      <DayHeader dayTitle={futureDayText} />
      <FutureDayOverviewComponent
        futureDayOverview={isExpanded ? futureDayDetailed : futureDaySummary}
      />
    </div>
  );
};

function extractFutureDayOverviewOrDetailed(dayForecast, hourly = false) {
  let forecast = dayForecast;
  const hourlyInterval = 6;
  if (!hourly) {
    forecast = forecast.filter((weather) => {
      const hour = parseInt(weather.time.substring(11, 13));
      return hour % hourlyInterval === 0;
    });

    return forecast.map((weather) => {
      const details = weather.data.instant.details;
      const nextSixHours = weather.data.next_6_hours;
      return {
        hour: `${weather.time.substring(11, 13)}-${
          weather.time.substring(11, 13) === "00" ? "0" : ""
        }${parseInt(weather.time.substring(11, 13)) + 6}`,
        weatherSymbolCode: nextSixHours.summary.symbol_code,
        minAirTemperature: round(nextSixHours.details.air_temperature_min),
        maxAirTemperature: round(nextSixHours.details.air_temperature_max),
        precipitationAmount: round(nextSixHours.details.precipitation_amount),
        windFromDirection: details.wind_from_direction,
        windSpeed: round(details.wind_speed),
      };
    });
  } else if (hourly) {
    return forecast.map((weather) => {
      const details = weather.data.instant.details;
      const nextOneHours = weather.data.next_1_hours;
      return {
        hour: weather.time.substring(11, 16),
        weatherSymbolCode: nextOneHours.summary.symbol_code,
        precipitationAmount: round(nextOneHours.details.precipitation_amount),
        airTemperature: details.air_temperature,
        windFromDirection: details.wind_from_direction,
        windSpeed: round(details.wind_speed),
      };
    });
  }
}

function formatFutureDayText(day) {
  const futureDate = new Date(day.data[0].time.substring(0, 10));
  const tomorrowOrFutureString = day.dayNumber === 1 ? "Tomorrow, " : "";
  return `${tomorrowOrFutureString}${days[futureDate.getDay()]} ${
    months[futureDate.getMonth()]
  } ${futureDate.getDate()}`;
}

const FutureDayOverviewComponent = ({ futureDayOverview }) => {
  return (
    <table className="w-full border-collapse">
      <tbody>
        {futureDayOverview.map((weather, index) => (
          <tr
            key={index}
            className={`border border-l-0 border-r-0 border-gray-400 ${
              index === 0 ? "border-t-0" : ""
            } ${index === futureDayOverview.length - 1 ? "border-b-0" : ""}`}
          >
            <td className="w-1/5 pt-2.5 pb-2.5">{weather.hour}</td>
            <td className="w-1/5">
              <SVGIcon
                className="self-center"
                path={`${weatherIconPath}${weather.weatherSymbolCode}`}
                width={"30px"}
              />
            </td>
            <td className="w-1/5">
              <div className="flex">
                <TempIcon width={"25px"} />
                {weather.airTemperature ? (
                  <div
                    className={
                      weather.airTemperature > 0
                        ? "text-red-600"
                        : "text-blue-500"
                    }
                  >
                    {weather.airTemperature}°
                  </div>
                ) : (
                  <div>
                    <span
                      className={
                        weather.minAirTemperature > 0
                          ? "text-red-600"
                          : "text-blue-500"
                      }
                    >
                      {weather.minAirTemperature}°
                    </span>
                    <span className="ml-1 mr-1 text-gray-600">/</span>
                    <span
                      className={
                        weather.maxAirTemperature > 0
                          ? "text-red-600"
                          : "text-blue-500"
                      }
                    >
                      {weather.maxAirTemperature}°
                    </span>
                  </div>
                )}
              </div>
            </td>
            <td className="w-1/5 text-blue-500">
              <div className="flex">
                <UmbrellaIcon className="mr-1" width={"25px"} />
                <div>
                  {weather.precipitationAmount}
                  <span className="text">mm</span>
                </div>
              </div>
            </td>
            <td className="w-1/5">
              <div className="flex justify-end">
                <WindIcon className="mr-1" width={"25px"} />
                <span className="mr-2">{weather.windSpeed}m/s</span>
                <SVGIcon
                  className="self-end"
                  fill={"#374151"}
                  path={windFromDirectionPath(weather.windFromDirection)}
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
