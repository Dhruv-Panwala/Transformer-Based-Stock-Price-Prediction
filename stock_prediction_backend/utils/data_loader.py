import yfinance as yf
import pandas as pd

def get_stock_data(ticker):
    print(f"[DEBUG] Fetching data for ticker: {repr(ticker)}")
    df = yf.download(ticker.strip(), period="3mo", interval="1d")

    if df.empty:
        raise ValueError(f"No data found for ticker '{ticker}'.")

    # If columns are multi-index, flatten them
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = ['_'.join(col).strip() for col in df.columns.values]

    df.reset_index(inplace=True)
    df['Date'] = df['Date'].astype(str)

    # Handle dynamic column names if they include ticker
    cols = [col for col in df.columns if any(key in col for key in ['Open', 'High', 'Low', 'Close', 'Volume', 'Date'])]
    df = df[cols]

    return df.to_dict(orient='records')
