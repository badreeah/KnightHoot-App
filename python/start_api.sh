#!/bin/bash

echo "===================================="
echo "SMS Scam Detection API Server"
echo "===================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo ""
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo ""

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt
echo ""

# Download NLTK data
echo "Downloading NLTK data..."
python -c "import nltk; nltk.download('stopwords')"
echo ""

# Get local IP address
echo "Your IP addresses:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    ifconfig | grep "inet " | grep -v 127.0.0.1
else
    # Linux
    hostname -I
fi
echo ""
echo "Update the API_BASE_URL in SmsScam.js with one of the IP addresses above"
echo "Example: const API_BASE_URL = 'http://192.168.1.10:8000';"
echo ""

echo "===================================="
echo "Starting API Server..."
echo "===================================="
echo "API will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""

python api.py
