from flask import Flask, jsonify
from utils.data_loader import get_stock_data
from utils.prediction import get_predictions
import sys
import tensorflow as tf
import datetime
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/stock/<ticker>', methods=['GET'])
def stock_data(ticker):
    try:
        # Implement your stock data endpoint logic here
        data = get_stock_data(ticker)
        return jsonify({'status': 'success', 'data': data})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/predict/<ticker>', methods=['GET'])
def predict(ticker):
    predictions = []
    old_recursion_limit = sys.getrecursionlimit()
    
    try:
        sys.setrecursionlimit(10000)
        raw_predictions = get_predictions([ticker])
        
        return jsonify({
            'status': 'success',
            'ticker': ticker,
            'predictions': raw_predictions
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e),
            'ticker': ticker,
            'predictions': predictions
        }), 500
        
    finally:
        sys.setrecursionlimit(old_recursion_limit)
        tf.keras.backend.clear_session()

if __name__ == '__main__':
    app.run(debug=True)
