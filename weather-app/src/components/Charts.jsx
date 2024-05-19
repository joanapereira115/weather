import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function Charts({ data, options, type }) {
  return (
    <div className="chart">
      {type === "line" && (
        <Line
          data={data}
          options={options}
          style={{ height: "470px", width: "100%" }}
        />
      )}
      {type === "bar" && (
        <Bar
          data={data}
          options={options}
          style={{ height: "470px", width: "100%" }}
        />
      )}
    </div>
  );
}
