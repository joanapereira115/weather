import { useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Searchbar from "./components/Searchbar";
import DayInfo from "./components/DayInfo";
import HourInfo from "./components/HourInfo";

function App() {
  const [selectedDay, setSelectedDay] = useState("");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("No data available!");
  let hoursInfo = [];

  if (weatherInfo && !selectedDay) {
    setSelectedDay(weatherInfo["daily"][0]["date"]);
  }

  if (weatherInfo && selectedDay) {
    hoursInfo = weatherInfo["hourly"].filter((obj) => obj.date === selectedDay);
  }

  return (
    <div className="weather-app">
      <Searchbar
        setWeatherInfo={setWeatherInfo}
        setSelectedDay={setSelectedDay}
        setError={setErrorMessage}
      />
      <hr></hr>
      {weatherInfo ? (
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
      ) : (
        <div className="no-data">
          <ExclamationCircleIcon className="no-data-icon" />
          <p>{errorMessage}</p>
        </div>
      )}
      <hr></hr>
    </div>
  );
}

export default App;
