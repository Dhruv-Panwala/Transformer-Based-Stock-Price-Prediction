import React from 'react';
import './StockInfo.css';

const StockInfo = ({ stockData }) => {
  if (!stockData) return null;

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const {
    symbol,
    company_name,
    current_price,
    change,
    change_percent,
    volume,
    market_cap,
    last_updated
  } = stockData;

  const isPositive = (change || 0) >= 0;

  return (
    <div className="card stock-info">
      <div className="card-body">
        <div className="stock-header">
          <div className="stock-title">
            <h2 className="company-name">{company_name}</h2>
            <span className="stock-symbol">{symbol}</span>
          </div>
          <div className="last-updated">
            {new Date(last_updated).toLocaleString()}
          </div>
        </div>

        <div className="price-section">
          <div className="current-price">{formatCurrency(current_price)}</div>
          <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            <div className="change-icon">
              {isPositive ? '📈' : '📉'}
            </div>
            <div className="change-details">
              <span className="change-amount">{formatCurrency(Math.abs(change))}</span>
              <span className="change-percent">({formatPercentage(change_percent)})</span>
            </div>
          </div>
        </div>

        <div className="stock-metrics">
          <div className="metric">
            <span className="metric-label">Volume</span>
            <span className="metric-value">{volume?.toLocaleString() || 'N/A'}</span>
          </div>
          </div>
        </div>
      </div>
  );
};

export default StockInfo;