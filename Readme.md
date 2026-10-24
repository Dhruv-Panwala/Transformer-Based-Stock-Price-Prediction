# Transformer-Based Stock Forecasting Platform

A full-stack research prototype that combines historical market data, technical indicators, financial-news sentiment and a Transformer model to generate five-day stock-price forecasts.

The repository demonstrates an end-to-end machine-learning workflow: data preparation, model experimentation, API delivery and an interactive web interface. It is not a trading system or financial advice.

## Features

- Stock-symbol lookup with current and historical market data.
- Five-day model forecasts exposed through a Flask API.
- Interactive React and Chart.js visualisations.
- Technical features including moving averages, RSI, Bollinger Bands and volatility.
- Sentiment features derived from a financial-news dataset.
- Separate notebooks and dependencies for model experimentation and training.

## Architecture

```text
React + Chart.js dashboard
            |
            | HTTP
            v
Flask prediction API
            |
      +-----+------+
      |            |
market data    trained model
and features   inference
```

API endpoints:

- `GET /stock/<ticker>` — retrieve stock data.
- `GET /predict/<ticker>` — generate forecasts for a ticker.

## Technology

- **Machine learning:** Python, TensorFlow, PyTorch, Transformers and scikit-learn
- **Data:** pandas, NumPy and yfinance
- **Backend:** Flask and Flask-CORS
- **Frontend:** React, Vite and Chart.js

## Evaluation

The recorded experiment evaluated Coca-Cola, Procter & Gamble and Johnson & Johnson and produced:

- Normalised MAE: **0.02**
- Normalised RMSE: **0.03**
- Forecasts within a ±1% tolerance: **40%**
- Forecasts within a ±2% tolerance: **70%**

These figures come from a small historical experiment. They are not directional accuracy, trading returns or evidence that the model generalises to other securities or market periods. A production evaluation would require walk-forward validation, stronger baselines, transaction-cost modelling and testing across a larger universe.

## Setup

Prerequisites: Python 3.10+, Node.js and npm.

On Windows, install the backend and frontend dependencies with:

```powershell
.\setup.bat
```

Or install them manually:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

cd project
npm install
cd ..
```

To install the additional training dependencies:

```powershell
pip install -r requirements_train.txt
```

## Run locally

On Windows:

```powershell
.\start.bat
```

Or start each component separately.

Backend:

```powershell
cd stock_prediction_backend
python app.py
```

Frontend:

```powershell
cd project
npm run dev
```

Open the URL displayed by Vite.

## Repository layout

```text
notebooks/                 Model experiments and training analysis
project/                   React frontend
stock_prediction_backend/ Flask API and prediction utilities
requirements.txt           Runtime Python dependencies
requirements_train.txt     Training dependencies
```

## Limitations

- Results depend on the selected stocks, period, feature preparation and data source.
- Financial markets are non-stationary; historical performance may not persist.
- The application does not model trading costs, liquidity or execution.
- Live behaviour can change when upstream market-data services change.
