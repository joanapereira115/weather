import { useState } from "react";
import Charts from "./Charts";
import Table from "./Table";
import "./HourInfo.css";
import { getWindDirection } from "../utils/logic";

const charts = ["Temperature", "Precipitation", "Wind"];

const temperatureOptions = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#A39FA9",
      },
    },
    y: {
      ticks: {
        stepSize: 1,
        color: "#A39FA9",
      },
      grid: {
        color: "#A39FA9",
      },
    },
  },
};

const precipitationOptions = {
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#A39FA9",
      },
    },
    y: {
      ticks: {
        color: "#A39FA9",
      },
      grid: {
        color: "#A39FA9",
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
};

const windColumns = [
  {
    name: "Time",
    selector: (row) => row.time,
    sortable: true,
    center: "true",
  },
  {
    name: "Wind Speed",
    selector: (row) => row.wind_speed,
    format: (row) => `${row.wind_speed} km/h`,
    sortable: true,
    center: "true",
  },
  {
    name: "Wind Direction",
    selector: (row) => getWindDirection(row.wind_direction),
    center: "true",
  },
];

export default function HourInfo({ hoursInfo }) {
  const [selectedChart, setSelectedChart] = useState("Temperature");

  const temperatureData = {
    labels: hoursInfo.map((obj) => obj["time"]),
    datasets: [
      {
        label: "Temperature (ºC)",
        data: hoursInfo.map((obj) => obj["temperature"]),
        fill: false,
        borderColor: "#00C3FF",
      },
      {
        label: "Apparent Temperature (ºC)",
        data: hoursInfo.map((obj) => obj["apparent_temperature"]),
        fill: false,
        borderColor: "#FCDE17",
      },
    ],
  };

  const precipitationData = {
    labels: hoursInfo.map((obj) => obj["time"]),
    datasets: [
      {
        label: "Rain (mm)",
        data: hoursInfo.map((obj) => obj["rain"]),
        backgroundColor: "#00C3FF",
      },
      {
        label: "Snow (cm)",
        data: hoursInfo.map((obj) => obj["snow"]),
        backgroundColor: "#FCDE17",
      },
    ],
  };

  return (
    <div className="chart-container">
      <div className="input-radio-container">
        {charts.map((chart) => (
          <div className="input-radio" key={chart}>
            <input
              type="radio"
              id={chart}
              name="chart"
              value={chart}
              checked={selectedChart === chart}
              onChange={(e) => setSelectedChart(e.target.value)}
            />
            <label htmlFor={chart}>{chart}</label>
          </div>
        ))}
      </div>

      {selectedChart === "Temperature" && (
        <Charts
          data={temperatureData}
          options={temperatureOptions}
          type="line"
        />
      )}
      {selectedChart === "Precipitation" && (
        <Charts
          data={precipitationData}
          options={precipitationOptions}
          type="bar"
        />
      )}
      {selectedChart === "Wind" && (
        <Table data={hoursInfo} columns={windColumns} />
      )}
    </div>
  );
}
