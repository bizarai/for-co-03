# Route Visualization App

This web application allows users to visualize routes between locations using natural language queries. It leverages the Mapbox API for mapping and routing, and the Google Gemini API for natural language processing.

## Features

- Natural language route queries (e.g., "Show me a route from London through Paris to Berlin avoiding tolls")
- Support for multiple waypoints
- Route preferences (avoid tolls, highways, ferries)
- Different transportation modes (driving, walking, cycling)
- Interactive map visualization

## How to Use

1. Enter your query in the search box using natural language
2. Click the Search button
3. The application will process your query and display the route on the map

## API Keys

This application requires two API keys to function:

- **Mapbox API Key**: Used for mapping and routing functionality
- **Google Gemini API Key**: Used for natural language processing

When you first load the application, you will be prompted to enter these API keys. They will be stored in your browser's local storage for future use.

### How to Get API Keys

- **Mapbox API Key**: Sign up at [Mapbox](https://www.mapbox.com/) and create a token
- **Google Gemini API Key**: Sign up for [Google AI Studio](https://makersuite.google.com/app/apikey) and create an API key

## Security Implementation

This application uses a server-side proxy approach to handle API keys securely. API keys are stored in environment variables on the server and are never exposed to the client-side code, ensuring they cannot be viewed or extracted by users.

## Setup Instructions

1. Clone this repository
2. Create a `.env` file in the root directory with the following content:
   ```
   MAPBOX_TOKEN=your_mapbox_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Install dependencies: `npm install`
4. Start the server: `npm start`
5. Access the application at http://localhost:8080

## Development

To run this project locally:

1. Clone the repository
2. Rename `config-template.js` to `config.js` and add your API keys
3. Open `index.html` in your browser or use a local server