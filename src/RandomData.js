import React, { useEffect, useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Ensure Chart.js is loaded

const generateRandomData = () => {
  const labels = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'];
  return {
    barData: labels.map(() => Math.floor(Math.random() * 100)),
    lineData: labels.map(() => Math.floor(Math.random() * 100)),
    pieData: labels.map(() => Math.floor(Math.random() * 100)),
    labels,
  };
};

const RandomData = () => {
  const [barData, setBarData] = useState({});
  const [lineData, setLineData] = useState({});
  const [pieData, setPieData] = useState({});
  
  useEffect(() => {
    const { barData, lineData, pieData, labels } = generateRandomData();

    setBarData({
      labels,
      datasets: [
        {
          label: 'Bar Chart',
          data: barData,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });

    setLineData({
      labels,
      datasets: [
        {
          label: 'Line Chart',
          data: lineData,
          borderColor: 'rgba(153, 102, 255, 1)',
          fill: false,
        },
      ],
    });

    setPieData({
      labels,
      datasets: [
        {
          label: 'Pie Chart',
          data: pieData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
          ],
        },
      ],
    });
  }, []);
  
  return (
    <div className="dashboard">
      <h2>Random Data Dashboard</h2>
      <div className="chart-container">
        <div className="chart">
          <h3>Bar Chart</h3>
          <Bar data={barData} />
        </div>
        <div className="chart">
          <h3>Line Chart</h3>
          <Line data={lineData} />
        </div>
        <div className="chart">
          <h3>Pie Chart</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default RandomData;
