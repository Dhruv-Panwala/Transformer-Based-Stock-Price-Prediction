@echo off
echo Starting Stock Prediction App...

:: Start Flask backend in new window
start "Backend" cmd /k "cd stock_prediction_backend && python app.py"

:: Start React frontend in new window
start "Frontend" cmd /k "cd project && npm run dev"

echo Both Backend and Frontend are starting in new windows.
pause
