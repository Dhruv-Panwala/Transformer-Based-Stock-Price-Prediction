# Stock Prediction Dashboard

A modern React-based dashboard for displaying stock data and AI-powered predictions. This application communicates with a Flask backend to fetch real-time stock information and generate 5-day price forecasts.

## Features

- **Stock Search**: Enter any stock symbol to fetch real-time data
- **Interactive Charts**: Beautiful line charts displaying historical prices and predictions
- **Real-time Data**: Current stock prices, changes, volume, and market cap
- **AI Predictions**: 5-day price forecasts with confidence levels
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UI**: Clean, modern interface with smooth animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Flask backend server running on port 5000 (or configure custom URL)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) to view the dashboard

## Flask Backend Integration

The dashboard expects your Flask backend to provide these endpoints:

### Get Stock Data
```
GET /stock/<StockTicker>
```

Expected response format:
```json
{
  "status": "success",
  "data": [
    {
      "Close_T": 26.990310668945312,
      "Date": "2025-04-28",
      "High_T": 27.000211963223194,
      "Low_T": 26.534860574556635,
      "Open_T": 26.633871628856678,
      "Volume_T": 24156000
    }
  ]
}
```

### Get Stock Predictions
```
GET /predict/<StockTicker>
```

Expected response format:
```json
{
  "status": "success",
  "ticker": "AAPL",
  "predictions": [
    {
      "date": "2025-07-28",
      "price": 213.3928435738926
    }
  ]
}
```

## Configuration

Set the Flask backend URL in your environment:

```bash
# Development
VITE_FLASK_API_URL=http://127.0.0.1:5000

# Production
VITE_FLASK_API_URL=https://your-flask-api.com
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main dashboard container
│   ├── StockChart.jsx   # Chart visualization
│   ├── StockInfo.jsx    # Stock information display
│   ├── StockSearchForm.jsx # Search functionality
│   └── PredictionPanel.jsx # Prediction controls
├── services/           # API services
│   └── stockService.js # Flask backend communication
├── utils/             # Utility functions
│   └── formatters.js  # Data formatting helpers
└── App.jsx           # Main application component
```

## Technologies Used

- **React**: Frontend framework
- **Chart.js**: Data visualization
- **CSS Grid & Flexbox**: Responsive layouts
- **Fetch API**: HTTP requests to Flask backend
- **CSS3**: Modern styling with animations

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.