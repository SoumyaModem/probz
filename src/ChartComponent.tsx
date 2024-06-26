import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import './ChartComponent.css';

// Register the required components
ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  timestamp: string;
  value: number;
}

const ChartComponent: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const chartRef = useRef<ChartJSOrUndefined<'line'>>(null);

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const chartData = {
    labels: data.map((d) => new Date(d.timestamp)),
    datasets: [
      {
        label: 'Values',
        data: data.map((d) => d.value),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `Value: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: timeframe,
        },
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const { index } = elements[0];
        alert(`Timestamp: ${data[index].timestamp}, Value: ${data[index].value}`);
      }
    },
  };

  const exportChart = (type: string) => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.href = chartRef.current.toBase64Image();
      link.download = `chart.${type}`;
      link.click();
    }
  };

  return (
    <div className="chart-container">
      <div className="button-group">
        <button onClick={() => setTimeframe('day')}>Daily</button>
        <button onClick={() => setTimeframe('week')}>Weekly</button>
        <button onClick={() => setTimeframe('month')}>Monthly</button>
        <button onClick={() => exportChart('png')}>Export PNG</button>
        <button onClick={() => exportChart('jpg')}>Export JPG</button>
      </div>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
