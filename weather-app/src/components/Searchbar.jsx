import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import "./Searchbar.css";
import { searchCities, getWeatherInfo, validate_input } from "../utils/logic";
import Input from "./Input";

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const yesterdayDate = yesterday.toISOString().split("T")[0];

export default function Searchbar({
  setWeatherInfo,
  setSelectedDay,
  setError,
}) {
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showCities, setShowCities] = useState(false);
  const [cities, setCities] = useState([]);

  let { disabled, errorMessage } = validate_input(
    latitude,
    longitude,
    startDate,
    endDate,
    yesterdayDate
  );
  console.log(errorMessage); /* if we want to give some feedbak to the user */

  useEffect(() => {
    const fetchCitiesData = async (search) => {
      setCities(await searchCities(search));
    };

    if (location && location.length > 1 && showCities) {
      fetchCitiesData(location);
    }
  }, [location, showCities]);

  const selectLocation = (loc) => {
    setLocation(loc.name);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setWeatherInfo(
        await getWeatherInfo(latitude, longitude, startDate, endDate)
      );
    } catch (error) {
      setError("An error occurred while trying to fetch the data!");
    }
    setSelectedDay("");
  };

  const setLocationHandler = (value) => {
    setLocation(value);
    if (!value) {
      setLatitude("");
      setLongitude("");
      setCities([]);
    }
  };

  const locationBlur = () => {
    setTimeout(() => {
      setShowCities(false);
    }, 200);
  };

  return (
    <div className="searchbar">
      <form onSubmit={handleSearch} className="search-form">
        <Input
          id="location"
          type="text"
          label="Location"
          value={location}
          onChangeHandler={setLocationHandler}
          onFocus={() => {
            setShowCities(true);
          }}
          onBlur={locationBlur}
        >
          {cities?.length > 1 && showCities && (
            <div className="dropdown-values">
              {cities?.map((loc, index) => (
                <p key={index} onClick={() => selectLocation(loc)}>
                  {loc.name}, {loc.country}
                  <br></br>
                  <span id="coordinates">
                    {loc.latitude} · {loc.longitude}
                  </span>
                </p>
              ))}
            </div>
          )}
        </Input>
        <Input
          id="start"
          type="date"
          label="Start Date"
          value={startDate}
          onChangeHandler={setStartDate}
          max={endDate ? endDate : yesterdayDate}
        />
        <Input
          id="end"
          type="date"
          label="End Date"
          value={endDate}
          onChangeHandler={setEndDate}
          min={startDate}
          max={yesterdayDate}
        />
        <button id="searchButton" type="submit" disabled={disabled}>
          <MagnifyingGlassIcon id="search-icon" />
        </button>
      </form>
    </div>
  );
}
