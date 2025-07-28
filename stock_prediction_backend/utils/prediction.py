import numpy as np
from tensorflow.keras.models import load_model
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import yfinance as yf
import pandas as pd
from pandas.tseries.offsets import BDay
import joblib
from datetime import datetime, timedelta
from flask import Flask, jsonify
import sys


# Utility functions
def squeeze_axis_1(x):
    return tf.squeeze(x, axis=1)

def compute_rsi(series, period=14):
    delta = series.diff()
    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi

def get_predictions(ticker):
    try:
        stocks = ticker if isinstance(ticker, list) else [ticker]
        data = []
        
        for stock in stocks:
            stock_history = yf.download(stock, period="12mo", interval="1d")
            
            # Technical indicators
            stock_history['SMA_50'] = stock_history['Close'].rolling(window=50).mean()
            stock_history['SMA_200'] = stock_history['Close'].rolling(window=200).mean()
            stock_history['RSI'] = compute_rsi(stock_history['Close'])
            
            ema_12 = stock_history['Close'].ewm(span=12, adjust=False).mean()
            ema_26 = stock_history['Close'].ewm(span=26, adjust=False).mean()
            stock_history['MACD'] = ema_12 - ema_26
            stock_history['MACD_Signal'] = stock_history['MACD'].ewm(span=9, adjust=False).mean()
            
            low_14 = stock_history['Low'].rolling(window=14).min()
            high_14 = stock_history['High'].rolling(window=14).max()
            stock_history['%K'] = 100 * ((stock_history['Close'] - low_14) / (high_14 - low_14))
            stock_history['%D'] = stock_history['%K'].rolling(window=3).mean()
            stock_history['Volatility_14'] = stock_history['Close'].rolling(window=14).std()

            # Lag features
            for lag in [1, 2, 3]:
                stock_history[f'Close_lag_{lag}'] = stock_history['Close'].shift(lag)
                stock_history[f'Volume_lag_{lag}'] = stock_history['Volume'].shift(lag)

            # Rolling features
            for window in [5, 20]:
                stock_history[f'RollingMean_{window}'] = stock_history['Close'].rolling(window).mean()
                stock_history[f'RollingStd_{window}'] = stock_history['Close'].rolling(window).std()
                stock_history[f'RollingVol_{window}'] = stock_history['Volume'].rolling(window).mean()

            stock_history['Ticker'] = stock
            stock_history['sentiment_score'] = 0
            stock_history.dropna(inplace=True)
            data.append(stock_history)

        df = pd.concat(data)
        df.reset_index(inplace=True)

        # Load model and scalers
        model = load_model(
            "models/stock_model_multi_US_2022_sentiment_score.keras",
            custom_objects={'squeeze_axis_1': squeeze_axis_1},
            safe_mode=False
        )
        X_series_scaler = joblib.load("models/X_series_scaler_multistock_US_New1.joblib")
        y_scaler = joblib.load("models/stock_model_orcl_aapl_amzn_googl2022_New1.joblib")

        test_data = df.tail(35).copy()
        time_steps = 30
        
        if len(test_data) < time_steps:
            raise ValueError("Not enough data points for prediction")

        results_price = []
        result_date=[]
        results=[]
        
        # Make 5 sequential predictions
        for _ in range(5):
            sequence = test_data.iloc[-time_steps:]
            
            # Prepare input data
            features = sequence.drop(['Date', 'Ticker'], axis=1)
            features_2d = np.array(features).reshape(-1, features.shape[-1])
            features_scaled = X_series_scaler.transform(features_2d)
            features_scaled = features_scaled.reshape(1, time_steps, features.shape[-1])

            # Make prediction
            y_pred_scaled = model.predict([np.array([[0]]), features_scaled])
            y_pred_log_return = y_scaler.inverse_transform(y_pred_scaled.reshape(-1, 1)).flatten()[0]

            # Calculate predicted price
            current_close = test_data.iloc[-1]['Close']
            predicted_close = current_close * np.exp(y_pred_log_return)
            
            # Calculate next trading day
            last_date = test_data['Date'].iloc[-1]  # This gets a single Timestamp object
            next_trading_day = last_date + BDay(1)
            
            # Store results - now this will work
            results.append({
                'date': next_trading_day.strftime('%Y-%m-%d'),  # Now works with single datetime
                'price': float(predicted_close)
            })
            
            # # Update test_data with new prediction
            new_row = test_data.iloc[-1].copy()
            new_row['Close'] = predicted_close
            new_row['Date'] = next_trading_day
            test_data = pd.concat([test_data, pd.DataFrame([new_row])], ignore_index=True)

        return results

    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise  # Re-raise the exception for the Flask handler

# Flask routes
# print(get_predictions(["AAPL"]))