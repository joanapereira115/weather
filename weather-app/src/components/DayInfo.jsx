import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import "./DayInfo.css";
import { getWindDirection } from "../utils/logic";
import { FaWind, FaSnowflake, FaCloudRain } from "react-icons/fa";
import { NoSymbolIcon } from "@heroicons/react/24/outline";

const weatherCodes = require("../utils/weather_codes.json");

export default function DayInfo({ day, selected, setSelectedDay }) {
  const cardClassName = selected ? "day-card selected-card" : "day-card";
  let weatherCode = "";
  let windDir = "";
  let altText = "";
  if (day.weather_code) {
    weatherCode = weatherCodes[day.weather_code]["day"]["image"];
    altText = weatherCodes[day.weather_code]["day"]["description"];
  }
  if (day.wind_direction) {
    windDir = getWindDirection(day.wind_direction);
  }
  let formattedDate = new Date(day.date).toDateString();

  return (
    <div className="card-container">
      <div className={cardClassName} onClick={() => setSelectedDay(day.date)}>
        <p className="date">{formattedDate}</p>
        {weatherCode ? (
          <img className="weather-img" src={weatherCode} alt={altText}></img>
        ) : (
          <NoSymbolIcon className="no-weather-code-icon" />
        )}

        <p className="temperature-container">
          <span className="temperature max-temp">
            {Math.round(day.max_temp)}ºC
          </span>{" "}
          <span className="temperature min-temp">
            {Math.round(day.min_temp)}ºC
          </span>
        </p>
        <p className="rain-container">
          <FaCloudRain className="rain-icon" />
          {day.rain}mm
          <FaSnowflake className="snow-icon" />
          {day.snow}cm
        </p>

        <p className="wind-container">
          <FaWind className="wind-icon" />
          {day.wind_speed}km/h<span className="wind-direction">{windDir}</span>
        </p>

        <p className="daylight-container">
          <SunIcon className="sunrise-icon" />
          {day.sunrise}
          <MoonIcon className="sunset-icon" />
          {day.sunset}
        </p>
      </div>
    </div>
  );
}
