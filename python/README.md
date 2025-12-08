# SMS Scam Detection API

This is a FastAPI backend for the KnightHoot SMS Scam Detection feature using Arabic BERT model.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows:
```bash
venv\Scripts\activate
```
- macOS/Linux:
```bash
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
pip install torch==2.9.1 --index-url https://download.pytorch.org/whl/cpu
pip install nltk fastapi uvicorn
```

4. Download NLTK data (if not already downloaded):
```python
python -c "import nltk; nltk.download('stopwords')"
```

## Running the API

### Development Mode

```bash
python api.py
```

Or using uvicorn directly:
```bash
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

### API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### 1. Health Check
- **GET** `/`
- Returns API status and model info

### 2. Predict SMS
- **POST** `/predict/`
- Body:
```json
{
  "text": "تحقق من رصيدك الآن!"
}
```
- Response:
```json
{
  "classification": "spam",
  "confidence": 92.5,
  "message": "⚠️ This message is classified as SPAM/SCAM"
}
```

### 3. Control Scanning
- **POST** `/scan-control/`
- Body:
```json
{
  "action": "start"
}
```
or
```json
{
  "action": "stop"
}
```

### 4. Get Scan Status
- **GET** `/scan-status/`

## Testing with curl

```bash
# Test prediction
curl -X POST "http://localhost:8000/predict/" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"تحقق من رصيدك الآن!\"}"

# Start scanning
curl -X POST "http://localhost:8000/scan-control/" \
  -H "Content-Type: application/json" \
  -d "{\"action\": \"start\"}"

# Check status
curl "http://localhost:8000/scan-status/"
```

## Model Information

- **Model**: `aubmindlab/bert-base-arabertv02`
- **Task**: Binary classification (spam vs ham)
- **Language**: Arabic
- **Accuracy**: ~92%
- **F1-Score**: ~90.5%

## Notes

- First run will download the model (~543MB)
- The API uses CPU by default, GPU if available
- CORS is enabled for all origins in development
