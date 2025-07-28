# Transformer-Based Stock Price Prediction  

This project presents an advanced stock forecasting system that combines **technical indicators**, **news sentiment analysis**, and a **Transformer deep learning model** to predict short-term market trends.  

The system is built with:  
- **React frontend** for an interactive user dashboard  
- **Flask backend** to serve real-time stock data and predictions  
- **Transformer training pipeline** using enriched technical + sentiment features  

---

## Key Features
- **Ticker Lookup:** Search by stock symbol and fetch detailed insights  
- **Dynamic Visualization:** Historical and predicted prices via React & Chart.js  
- **Forecasting Power:** Generates 5-day predictions using a Transformer model  
- **Technical Analytics:** Moving averages, RSI, Bollinger Bands, volatility measures  
- **Sentiment Integration:** Scores from Kaggle news dataset to capture market psychology  
- **Performance Snapshot:**  
  - MAE: **0.02**  
  - RMSE: **0.03**  
  - Threshold Accuracy:  
    - ±1% → 40% success (Coca-Cola, Procter & Gamble, Johnson & Johnson)  
    - ±2% → 70% success on the same stocks  

---

## Installation

 - Clone the Repository
 - Use the provided batch script to set up the backend and frontend requirements:
    - setup.bat
    - If you want to retrain the model:
        - pip install -r requirements-train.txt

## Running and using the app

- run start.bat
- Enter a stock ticker (e.g., AAPL, KO, PG) in the search form
- You will be able to View:
    - Current stock info (price, change, volume)
    - Historical prices
    - 5-day predictions

## Evaluation

- Error Metrics:
    - MAE: 0.02
    - RMSE: 0.03
- Threshold Accuracy Tests:
    - ±1% margin → Average 40% correct predictions
    - ±2% margin → Average 70% correct predictions

## Acknowledgments
    ("https://finance.yahoo.com/")Yahoo Finance — Source of stock market data.
    ("https://www.kaggle.com/datasets/elsabetyemane/financial-news-and-stock-price-integration-dataset")Kaggle Financial News Dataset — Sentiment features.
    ("https://huggingface.co/")Hugging Face & TensorFlow — Transformer framework support