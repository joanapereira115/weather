const searchCities = async (search) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${search}`
    );
    const cities = await response.json();
    return cities?.results;
  } catch (error) {
    return {};
  }
};

function getWindDirection(degrees) {
  const wind_directions = require("./wind_directions.json");
  let wind_i = Math.round(+degrees / 22.5) + 1;
  return wind_directions[wind_i];
}

function validate_input(
  latitude,
  longitude,
  startDate,
  endDate,
  yesterdayDate
) {
  if (!latitude || !longitude) {
    /* errorMessage = "Please, select a location!"; */
    return true;
  }
  if (!startDate || !endDate) {
    /* errorMessage = "Mandatory date range!"; */
    return true;
  }
  if (endDate < startDate) {
    /* errorMessage = "The start date can't be higher that the end date!"; */
    return true;
  }
  if (endDate > yesterdayDate || startDate > yesterdayDate) {
    /* errorMessage = "The range date must be in the past!"; */
    return true;
  }
  /* errorMessage = ""; */
  return false;
}

export { searchCities, getWindDirection, validate_input };
