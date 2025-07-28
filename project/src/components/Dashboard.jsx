import React, { useState } from 'react';
import StockSearchForm from './StockSearchForm';
import StockChart from './StockChart';
import StockInfo from './StockInfo';
import PredictionPanel from './PredictionPanel';
import { fetchStockData, fetchStockPrediction } from '../services/stockService';
import './Dashboard.css';

const Dashboard = () => {
  const [stockData, setStockData] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSymbol, setCurrentSymbol] = useState('');

  const handleStockSearch = async (symbol) => {
    setLoading(true);
    setError(null);
    setPredictionData(null);
    setCurrentSymbol(symbol.toUpperCase());
    console.log(`Searching for stock: ${symbol}`);

    try {
      const data = await fetchStockData(symbol);
      console.log('Received stock data in Dashboard:', data);
      setStockData(data);
    } catch (err) {
      console.error('Error in handleStockSearch:', err);
      setError(`Failed to fetch stock data for ${symbol.toUpperCase()}. Please check the symbol and try again.`);
      setStockData(null);
    } finally {
      setLoading(false);
    }
  };


  const handleGetPrediction = async () => {
    if (!currentSymbol) return;

    setPredictionLoading(true);
    setError(null);
    console.log(`Getting prediction for: ${currentSymbol}`);

    try {
      const prediction = await fetchStockPrediction(currentSymbol);
      console.log('Received prediction data in Dashboard:', prediction);
      setPredictionData(prediction);
    } catch (err) {
      console.error('Error in handleGetPrediction:', err);
      setError(`Failed to fetch prediction for ${currentSymbol}. Please try again.`);
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-title">Stock Prediction Dashboard</h1>
          <p className="dashboard-subtitle">
            Enter a stock symbol to view historical data and AI-powered predictions
          </p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="dashboard-grid">
            <div className="search-section">
              <StockSearchForm 
                onSearch={handleStockSearch} 
                loading={loading}
                currentSymbol={currentSymbol}
              />
            </div>

            {stockData && (
              <>
                <div className="info-section">
                  <StockInfo stockData={stockData} />
                </div>

                <div className="chart-section">
                  <div className="card">
                    <div className="card-header">
                      <h3>Price Chart</h3>
                      <PredictionPanel
                        onGetPrediction={handleGetPrediction}
                        loading={predictionLoading}
                        hasData={!!stockData}
                      />
                    </div>
                    <div className="card-body">
                      {/* console.log('Rendering StockChart with stockData:', stockData); */}
                      <StockChart 
                        stockData={stockData} 
                        predictionData={predictionData}
                        symbol={currentSymbol}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {loading && (
              <div className="loading-section">
                <div className="card">
                  <div className="card-body">
                    <div className="loading-state">
                      <div className="loading-spinner"></div>
                      <p>Fetching stock data...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;