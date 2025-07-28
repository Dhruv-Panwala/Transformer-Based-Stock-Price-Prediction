import React, { useState } from 'react';
import './StockSearchForm.css';

const StockSearchForm = ({ onSearch, loading, currentSymbol }) => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim() && !loading) {
      onSearch(symbol.trim());
    }
  };

  const popularStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];

  return (
    <div className="card">
      <div className="card-body">
        <div className="form-header">
          <h2 className="form-title">Search Stock</h2>
          <p className="form-subtitle">
            Enter any stock symbol to get real-time data and AI predictions
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="search-form">
          <div className="input-group">
            <div className="input-wrapper">
              {/* <div className="input-icon">📊</div> */}
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol (e.g., AAPL)"
                className="input search-input"
                disabled={loading}
                maxLength={10}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary search-btn"
              disabled={loading || !symbol.trim()}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {currentSymbol && (
          <div className="current-stock">
            <span>📈</span>
            <span className="current-label">Current Stock:</span>
            <span className="current-symbol">{currentSymbol}</span>
          </div>
        )}

        <div className="popular-stocks">
          <h3 className="popular-title">Quick Select</h3>
          <div className="popular-buttons">
            {popularStocks.map((stock) => (
              <button
                key={stock}
                onClick={() => !loading && onSearch(stock)}
                className={`btn-stock ${currentSymbol === stock ? 'active' : ''}`}
                disabled={loading}
              >
                {stock}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockSearchForm;