# weather-app

Path to the styled component from the task statement: `src/components/MyStyledButton.jsx`

This project displays a React Leaflet map and dynamically shows biggest cities visible to the user (via OverpassAPI) on the map and fetches weather data for each city using WeatherAPI.

## Prerequisites
1. Node.js
2. npm
3. An account on weatherapi.com to obtain an API key

## Getting started
1. Clone repository
2. Install dependencies by running:
```
npm install
```
3. Set up environment variable (see below)

## Environment variable
1. Copy `.env.example` file to a new file named `.env`
2. Replace the placeholder value with your actual WeatherAPI key, like:
```
VITE_WEATHER_API_KEY=YOUR_REAL_WEATHERAPI_KEY
```

## Running the app
After installing dependencies and setting API key run this command to boot the app
```
npm run dev
```

