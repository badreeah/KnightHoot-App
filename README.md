<p align="center">
  <img src="https://github.com/badreeah/KnightHoot-App/blob/main/assets/icons/logo.png" alt="KnightHoot Logo" width="180">
</p>

<h1 align="center">KnightHoot App</h1>


<p align="center">
A comprehensive mobile security application built with React Native and Expo, designed to protect users from scam calls, malicious URLs, and suspicious SMS messages or emails.
</p>

# Table of Contents

2. [Features](#features)
3. [Technologies](#technologies)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Running the Application](#running-the-application)
   - [Start the Mobile App](#start-the-mobile-app)
   - [Start the Backend Server](#start-the-backend-server)
7. [Configuration](#configuration)
8. [Main Screens](#main-screens)
9. [Feature Guides](#feature-guides)
    - [Email Scanning](#email-scanning)
10. [Note](#note)


## Features

- **Call Analysis**: Transcribe and analyze phone calls for potential scam indicators
- **URL Scanning**: Analyze and detect malicious websites before visiting them
- **Safe Browsing**: Protected web browsing experience
- **Device Radar**: Monitor connected devices .
- **Scam Reporting**: Report and track suspicious activities and protecting user privacy by not storing user data but asking them to provied it to us through a form.
- **Multi-language Support**: Interface available in 2 languages
- **Dark/Light Theme**: Customizable appearance settings
- **User Authentication**: Secure sign-in, sign-up, and password recovery

## Technologies

- **Frontend**: React Native with Expo
- **Backend**: Express.js server
- **Database**: Supabase
- **Authentication**: Supabase
- **Speech Recognition**: Google Cloud Speech-to-Text API
- **Navigation**: React Navigation (Stack & Tab navigators)

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Expo CLI** (install globally with `npm install -g expo-cli`)
- **Expo Go** app on an android emulator or your mobile device (for testing)
- **Google Cloud Service Account** (for speech recognition features)
- **SDK** 54

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/badreeah/KnightHoot-App.git
   cd KnightHoot-App
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   - Ensure `service-account.json` file is present in the root directory (matching your Google Cloud credentials)
   - Configure your Supabase credentials in `supabase.js`

## Running the Application

### Start the Mobile App

1. **Start the Expo development server**

   ```bash
   npm start
   ```

2. **Run on your device**
   - press `a` for Android emulator

### Start the Backend Server

In a separate terminal, run the Express server for audio transcription:

```bash
node server.js
```

The server will start on port 3000 .

## Configuration

1. **Supabase**: Update credentials in `supabase.js`
2. **Google Cloud**: Place your service account JSON file in the root directory

## Main Screens

- **Welcome/Onboarding**: First-time user introduction
- **Authentication**: Sign in, sign up, password recovery
- **Home**: Main Homepage with quick access to features
- **URL Scanner**: Scan and analyze suspicious URLs
- **Call Analyzer**: Record and analyze phone calls audios
- **Device Radar**: Monitor connected devices
- **Safe Browsing**: Secure web browsing interface
- **Profile**: User settings and preferences
- **Statistics**: View scan history and analytics

## Feature Guides

### Email Scanning

To scan your emails for phishing attempts:

1. Navigate to the **Profile** screen from the app menu.
2. Tap on **Email Scanning** in the settings section.
3. If not connected, enter your email address and a 16-character app password (generated from your email provider's security settings, e.g., Gmail App Passwords).
4. Connect your email account.
5. Once connected, the app will automatically scan your emails for phishing indicators.
6. View email statistics and alerts in the **Statistics** screen or **Manage Alerts** section.

To disconnect your email account, return to the **Profile** screen and tap on **Email Scanning** again, then confirm the disconnection.

---

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
  
----

**Note**: This application requires active internet connection for most features, including URL scanning, call analysis, and real-time threat detection.
