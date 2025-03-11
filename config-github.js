// Configuration file for GitHub Pages deployment
// This version prompts users to enter their own API keys

let mapboxToken = localStorage.getItem('mapbox_token');
let geminiApiKey = localStorage.getItem('gemini_api_key');

// If keys are not in localStorage, prompt the user
if (!mapboxToken) {
  mapboxToken = prompt('Please enter your Mapbox token to use this application:', '');
  if (mapboxToken) {
    localStorage.setItem('mapbox_token', mapboxToken);
  }
}

if (!geminiApiKey) {
  geminiApiKey = prompt('Please enter your Gemini API key to use this application:', '');
  if (geminiApiKey) {
    localStorage.setItem('gemini_api_key', geminiApiKey);
  }
}

const config = {
  mapbox: {
    token: mapboxToken || ''
  },
  gemini: {
    apiKey: geminiApiKey || ''
  }
};

// Export the configuration
export default config;