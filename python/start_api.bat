@echo off
echo ====================================
echo SMS Scam Detection API Server
echo ====================================
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate
echo.

REM Install requirements
echo Installing dependencies...
pip install -r requirements.txt
echo.

REM Download NLTK data
echo Downloading NLTK data...
python -c "import nltk; nltk.download('stopwords')"
echo.

REM Get local IP address
echo Your IP addresses:
ipconfig | findstr /i "IPv4"
echo.
echo Update the API_BASE_URL in SmsScam.js with one of the IP addresses above
echo Example: const API_BASE_URL = 'http://192.168.1.10:8000';
echo.

echo ====================================
echo Starting API Server...
echo ====================================
echo API will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.

python api.py
