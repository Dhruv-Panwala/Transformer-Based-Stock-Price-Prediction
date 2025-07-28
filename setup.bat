@echo off
echo Installing backend dependencies...
pip install -r requirements.txt

echo Installing frontend dependencies...
cd project && npm install && cd ..

echo Setup complete!
pause
