from utils.data_loader import get_stock_data
import json

data = get_stock_data("AAPL")
print(json.dumps(data, indent=2))  # print last 5 days' data

