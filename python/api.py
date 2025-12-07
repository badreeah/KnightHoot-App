from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import re
import nltk
from nltk.corpus import stopwords
from typing import Dict
import uvicorn

# Download NLTK stopwords if not already downloaded
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Initialize FastAPI app
app = FastAPI(title="SMS Scam Detection API", version="1.0")

# CORS middleware to allow React Native app to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and tokenizer
MODEL_NAME = "aubmindlab/bert-base-arabertv02"
model = None
tokenizer = None
device = None
arabic_stopwords = None
is_scanning = False

# Pydantic models for request/response
class MessageRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    classification: str
    confidence: float
    message: str

class ScanControlRequest(BaseModel):
    action: str  # "start" or "stop"

class ScanControlResponse(BaseModel):
    status: str
    message: str

# Text cleaning function (same as in notebook)
def clean_text(text: str) -> str:
    """Clean and normalize Arabic text"""
    text = str(text).lower()
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = re.sub(r'\s+', ' ', text)  # Remove extra spaces
    text = re.sub(r'[إأآا]', 'ا', text)  # Normalize Arabic letters
    text = re.sub(r'[ًٌٍَُِّ]', '', text)  # Remove diacritics

    # Remove stopwords
    if arabic_stopwords:
        text_tokens = [word for word in text.split() if word not in arabic_stopwords]
        text = ' '.join(text_tokens)

    return text.strip()

@app.on_event("startup")
async def load_model():
    """Load model and tokenizer on startup"""
    global model, tokenizer, device, arabic_stopwords

    print("Loading model and tokenizer...")
    try:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device: {device}")

        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=2)
        model.to(device)
        model.eval()

        # Load Arabic stopwords
        arabic_stopwords = set(stopwords.words('arabic'))

        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "SMS Scam Detection API is active",
        "model": MODEL_NAME,
        "device": str(device)
    }

@app.post("/predict/", response_model=PredictionResponse)
async def predict_sms(message: MessageRequest):
    """
    Predict if an SMS message is spam or not
    """
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    try:
        # Clean the input text
        cleaned_text = clean_text(message.text)

        if not cleaned_text:
            return PredictionResponse(
                classification="ham",
                confidence=50.0,
                message="Message appears to be empty after cleaning"
            )

        # Tokenize and encode
        encoding = tokenizer(
            [cleaned_text],
            truncation=True,
            padding=True,
            return_tensors="pt"
        )

        # Move to device
        encoding = {key: val.to(device) for key, val in encoding.items()}

        # Make prediction
        with torch.no_grad():
            outputs = model(**encoding)
            probs = torch.softmax(outputs.logits, dim=1)
            pred_class = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred_class].item()

        # Determine classification
        if pred_class == 1:  # spam
            classification = "spam"
            user_message = "⚠️ This message is classified as SPAM/SCAM"
        else:  # ham (legitimate)
            classification = "ham"
            user_message = "✓ This message appears to be legitimate"

        # If confidence is low, provide warning
        if confidence < 0.6:
            user_message = "⚠️ This message is suspected to be a scam (low confidence)"

        return PredictionResponse(
            classification=classification,
            confidence=round(confidence * 100, 2),
            message=user_message
        )

    except Exception as e:
        print(f"Error during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/scan-control/", response_model=ScanControlResponse)
async def control_scanning(request: ScanControlRequest):
    """
    Control the SMS scanning service (start/stop)
    """
    global is_scanning

    if request.action == "start":
        is_scanning = True
        return ScanControlResponse(
            status="scanning",
            message="SMS scanning started. Monitoring incoming messages..."
        )
    elif request.action == "stop":
        is_scanning = False
        return ScanControlResponse(
            status="stopped",
            message="SMS scanning stopped."
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'start' or 'stop'")

@app.get("/scan-status/")
async def get_scan_status():
    """Get current scanning status"""
    return {
        "is_scanning": is_scanning,
        "status": "scanning" if is_scanning else "stopped"
    }

@app.post("/classify-sms/")
async def classify_sms(request: dict):
    """
    Classify an SMS and save to database
    This endpoint is called from the React Native app when SMS is received
    """
    try:
        sender_id = request.get("sender_id")
        message_content = request.get("message_content")

        # Classify the message
        cleaned_text = clean_text(message_content)

        if not cleaned_text:
            classification = "ham"
            confidence = 0.5
        else:
            # Tokenize and encode
            encoding = tokenizer(
                [cleaned_text],
                truncation=True,
                padding=True,
                return_tensors="pt"
            )

            # Move to device
            encoding = {key: val.to(device) for key, val in encoding.items()}

            # Make prediction
            with torch.no_grad():
                outputs = model(**encoding)
                probs = torch.softmax(outputs.logits, dim=1)
                pred_class = torch.argmax(probs, dim=1).item()
                confidence = probs[0][pred_class].item()

            classification = "spam" if pred_class == 1 else "ham"

        # Return the result (database insertion happens on the client side)
        return {
            "sender_id": sender_id,
            "message_content": message_content,
            "classification_response": classification,
            "confidence_score": round(confidence, 4)
        }

    except Exception as e:
        print(f"Error in classify-sms: {e}")
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
