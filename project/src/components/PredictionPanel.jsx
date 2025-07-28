import React from 'react';
import './PredictionPanel.css';

const PredictionPanel = ({ onGetPrediction, loading, hasData }) => {
  return (
    <div className="prediction-panel">
      <button
        onClick={onGetPrediction}
        disabled={!hasData || loading}
        className="btn btn-success prediction-btn"
      >
        {loading ? (
          <div className="btn-content">
            <div className="loading-spinner"></div>
            <span className="prediction-text">Getting Prediction...</span>
          </div>
        ) : (
          <div className="btn-content">
            <span className="prediction-icon">🔮</span>
            <span className="prediction-text">Get 5-Day Prediction</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default PredictionPanel;