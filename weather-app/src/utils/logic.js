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

const getWeatherInfo = async (lat, lng, start, end) => {
  try {
    const response = await fetch(
      `http://localhost:3000/weather?latitude=${lat}&longitude=${lng}&start_date=${start}&end_date=${end}`
    );
    console.log(response);
    const weather = await response.json();
    return weather;
  } catch (error) {
    throw error;
  }
};

function getWindDirection(degrees) {
  const wind_directions = require("./wind_directions.json");
  let wind_i = Math.round(+degrees / 22.5) + 1;
  return wind_directions[wind_i];
}

function validate_input(latitude, longitude, startDate, endDate, yesterdayDate) {
  if (!latitude || !longitude) {
    return { disabled: true, errorMessage: "Please, select a location!" };
  }
  if (!startDate || !endDate) {
    return { disabled: true, errorMessage: "Mandatory date range!" };
  }
  if (endDate < startDate) {
    return {
      disabled: true,
      errorMessage: "The start date can't be higher that the end date!",
    };
  }
  if (endDate > yesterdayDate || startDate > yesterdayDate) {
    return {
      disabled: true,
      errorMessage: "The range date must be in the past!",
    };
  }
  return { disabled: false, errorMessage: "" };
}

export { searchCities, getWeatherInfo, getWindDirection, validate_input };
