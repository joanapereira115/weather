import { useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Searchbar from "./components/Searchbar";
import DayInfo from "./components/DayInfo";
import HourInfo from "./components/HourInfo";
import { useHttp } from "./hooks/use-http";

function App() {
  const [selectedDay, setSelectedDay] = useState("");
  let hoursInfo = [];

  const {
    sendRequest: getWeatherInfo,
    data: weatherInfo,
    isLoading,
    error,
  } = useHttp();

  if (weatherInfo && !selectedDay) {
    setSelectedDay(weatherInfo["daily"][0]["date"]);
  }

  if (weatherInfo && selectedDay) {
    hoursInfo = weatherInfo["hourly"].filter((obj) => obj.date === selectedDay);
  }

  return (
    <div className="weather-app">
      <Searchbar
        getWeatherInfo={getWeatherInfo}
        setSelectedDay={setSelectedDay}
      />
      <hr></hr>
      {weatherInfo && (
        <>
          <div className="daily-info-container">
            {weatherInfo?.daily?.map((day) => (
              <DayInfo
                key={day.date}
                day={day}
                selected={selectedDay === day.date ? true : false}
                setSelectedDay={setSelectedDay}
              />
            ))}
          </div>
          <hr></hr>
          <div className="hourly-info-container">
            <HourInfo hoursInfo={hoursInfo} />
          </div>
        </>
      )}
      {error && (
        <div className="no-data">
          <ExclamationCircleIcon className="no-data-icon" />
          <p>{error}</p>
        </div>
      )}
      {isLoading && (
        <div className="no-data">
          <div class="loader"></div>
        </div>
      )}
      <hr></hr>
    </div>
  );
}

export default App;
