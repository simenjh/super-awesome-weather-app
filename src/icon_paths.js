export const weatherIconPath = "weather-icons/svg/";

export const windFromDirectionPath = (windFromDirection) => {
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
