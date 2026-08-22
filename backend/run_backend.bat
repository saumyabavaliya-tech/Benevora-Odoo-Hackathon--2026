@echo off
title GlobeTrotter Backend Server
echo ===================================================
echo   Starting GlobeTrotter FastAPI Backend Server
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking dependencies...
python -m pip install -r requirements.txt --quiet

echo [2/3] Initializing Database and Seeding Sample Data...
python app\init_db.py
python app\seed.py

echo.
echo [3/3] Starting FastAPI Server on http://localhost:8000...
echo ---------------------------------------------------
echo Swagger UI Docs: http://localhost:8000/docs
echo ReDoc UI:        http://localhost:8000/redoc
echo ---------------------------------------------------
echo Press CTRL+C to stop the server anytime.
echo.

python -m uvicorn app.main:app --reload --port 8000
pause
