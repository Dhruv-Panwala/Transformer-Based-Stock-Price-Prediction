// Service to communicate with Flask backend for stock data and predictions

// Service to fetch stock data from Flask backend
export const fetchStockData = async (symbol) => {
  try {
    console.log(`Fetching stock data for: ${symbol}`);
    const response = await fetch(`http://127.0.0.1:5000/stock/${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Raw keys from first item:", Object.keys(data.data[0]));
    
    // Check if the response has the expected structure
    if (data.status !== 'success' || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid data structure:', data);
      throw new Error('Invalid data format received from server');
    }

    // Check if data array is empty
    if (data.data.length === 0) {
      console.error('Empty data array received');
      throw new Error('No stock data available for this symbol');
    }

    // console.log(`Processing ${data.data.length} data points`);

    // Transform the data to match our component expectations
    const transformedData = {
      symbol: symbol.toUpperCase(),
      company_name: `${symbol.toUpperCase()} Stock`,
      current_price: data.data[data.data.length - 1]?.[`Close_${symbol}`] || 0,
      change: 0, // Will be calculated below
      change_percent: 0, // Will be calculated below
      volume: data.data[data.data.length - 1]?.[`Volume_${symbol}`] || 0,
      market_cap: null, // Not provided in the response
      last_updated: data.data[data.data.length - 1]?.Date || new Date().toISOString(),
      historical_data: data.data.map(item => ({
      date: item.Date,
      close: item[`Close_${symbol}`],
      open: item[`Open_${symbol}`],
      high: item[`High_${symbol}`],
      low: item[`Low_${symbol}`],
      volume: item[`Volume_${symbol}`],
      }))
    };
    // console.log('Transformed stock data:', transformedData);
    
    // Calculate change and change percentage
    if (data.data.length >= 2) {
      const currentPrice = data.data[data.data.length - 1].Close_T;
      const previousPrice = data.data[data.data.length - 2].Close_T;
      transformedData.change = currentPrice - previousPrice;
      transformedData.change_percent = ((currentPrice - previousPrice) / previousPrice) * 100;
    }

    return transformedData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

// Service to fetch stock predictions from Flask backend
export const fetchStockPrediction = async (symbol) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/predict/${symbol}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if the response has the expected structure
    if (data.status !== 'success' || !data.predictions || !Array.isArray(data.predictions)) {
      throw new Error('Invalid prediction data format received from server');
    }

    // Transform the prediction data to match our component expectations
    const transformedPrediction = {
      symbol: data.ticker || symbol.toUpperCase(),
      predictions: data.predictions.map(item => ({
        date: item.date,
        predicted_price: item.price
      })),
      trend: 'up', // Will be calculated below
      // confidence: 75 // Default confidence since it's not provided
    };
    // console.log('Transformed Prediction Data:', transformedPrediction);
    // Calculate trend based on first and last prediction
    if (data.predictions.length >= 2) {
      const firstPrice = data.predictions[0].price;
      const lastPrice = data.predictions[data.predictions.length - 1].price;
      transformedPrediction.trend = lastPrice > firstPrice ? 'up' : 'down';
    }

    return transformedPrediction;
  } catch (error) {
    console.error('Error fetching stock prediction:', error);
    throw error;
  }
};