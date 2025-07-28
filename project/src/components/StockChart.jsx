import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './StockChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockChart = ({ stockData, predictionData, symbol }) => {
  // console.log('StockChart received stockData:', stockData);
  // console.log('StockChart received predictionData:', predictionData);

  if (!stockData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Prepare historical data from the transformed stock data
  let historicalLabels = [];
  let historicalPrices = [];
  
  if (stockData.historical_data && Array.isArray(stockData.historical_data)) {
    // console.log(`Processing ${stockData.historical_data.length} historical data points`);
    historicalLabels = stockData.historical_data.map(item => formatDate(item.date));
    historicalPrices = stockData.historical_data.map(item => item.close);
    // console.log('Historical labels:', historicalLabels);
    // console.log('Historical prices:', stockData.historical_data);
  } else {
    console.error('No historical_data found or not an array:', stockData.historical_data);
  }

  // Prepare prediction data from the transformed prediction data
  let predictionLabels = [];
  let predictionPrices = [];
  
  if (predictionData && predictionData.predictions) {
    // console.log(`Processing ${predictionData.predictions.length} prediction data points`);
    predictionLabels = predictionData.predictions.map(item => formatDate(item.date));
    predictionPrices = predictionData.predictions.map(item => item.predicted_price);
    // console.log('Prediction labels:', predictionLabels);
    // console.log('Prediction prices:', predictionPrices);
  }

  // Combine labels and ensure proper connection
  const allLabels = [...historicalLabels, ...predictionLabels];
  // console.log('All labels:', allLabels);
  
  // Create datasets
  const datasets = [
    {
      label: 'Historical Price',
      data: historicalPrices, // ← remove predictionPrices[0]
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.1,
    }
  ];

  // console.log('Historical dataset data:', datasets[0].data);
  // Add prediction dataset if available
  if (predictionData && predictionPrices.length > 0) {
    datasets.push({
      label: '5-Day Prediction',
      data: [
        ...new Array(historicalPrices.length).fill(null),
        ...predictionPrices
      ],
      borderColor: '#16a34a',
      backgroundColor: 'rgba(16, 163, 74, 0.1)',
      borderWidth: 2,
      borderDash: [5, 5],
      pointRadius: 3,
      pointHoverRadius: 6,
      fill: false,
      tension: 0.1,
    });
    // console.log('Prediction dataset data:', datasets[1].data);
  }

  const data = {
    labels: allLabels,
    datasets,
  };

  // console.log('Final chart data:', data);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: `${symbol} Stock Price ${predictionData ? '& Prediction' : ''}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price ($)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="stock-chart">
      <div className="chart-container">
        <div className="chart-wrapper">
          <Line data={data} options={options} />
        </div>
      </div>
      
      {predictionData && (
        <div className="prediction-summary">
          <h4>AI Prediction Summary</h4>
          <div className="prediction-stats">
            <div className="stat">
              <span className="stat-label">
                📊 Market Direction:
              </span>
              <span className={`stat-value ${predictionData.trend === 'up' ? 'positive' : 'negative'}`}>
                <span className="trend-indicator">
                  {predictionData.trend === 'up' ? '📈' : '📉'}
                </span>
                {predictionData.trend === 'up' ? 'Bullish' : 'Bearish'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;