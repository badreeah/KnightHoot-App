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
9. [Note](#note)


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
- **Home**: Main dashboard with quick access to features
- **URL Scanner**: Scan and analyze suspicious URLs
- **Call Analyzer**: Record and analyze phone calls
- **Device Radar**: Monitor network and connected devices
- **Safe Browsing**: Secure web browsing interface
- **Profile**: User settings and preferences
- **Statistics**: View scan history and analytics

---

**Note**: This application requires active internet connection for most features, including URL scanning, call analysis, and real-time threat detection.
