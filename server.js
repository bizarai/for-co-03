// Server-side proxy for API requests
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Endpoint to provide Mapbox token securely
app.get('/api/config/mapbox', (req, res) => {
  res.json({ token: process.env.MAPBOX_TOKEN });
});

// Validate that required environment variables are set
if (!process.env.MAPBOX_TOKEN || !process.env.GEMINI_API_KEY) {
  console.error('Error: Required environment variables are not set.');
  console.error('Please create a .env file with MAPBOX_TOKEN and GEMINI_API_KEY');
  process.exit(1);
}

// Proxy endpoint for Mapbox geocoding
app.get('/api/geocode/:location', async (req, res) => {
  try {
    const location = req.params.location;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${process.env.MAPBOX_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for Mapbox directions
app.get('/api/directions/:mode/:coordinates', async (req, res) => {
  try {
    const { mode, coordinates } = req.params;
    const { exclude } = req.query;
    
    let url = `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coordinates}?geometries=geojson&access_token=${process.env.MAPBOX_TOKEN}`;
    
    if (exclude) {
      url += `&exclude=${exclude}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Directions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Proxy endpoint for Gemini API
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, functionCalling } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const requestBody = functionCalling ? {
      contents: [{
        parts: [{
          text: `Extract routing information from this text: "${prompt}"`
        }]
      }],
      tools: [{
        functionDeclarations: [{
          name: "extractRouteInfo",
          description: "Extract locations and routing preferences from natural language",
          parameters: {
            type: "OBJECT",
            properties: {
              locations: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "List of locations mentioned in order of travel"
              },
              preferences: {
                type: "OBJECT",
                properties: {
                  transportMode: {
                    type: "STRING",
                    enum: ["driving", "walking", "cycling", "transit"],
                    description: "Mode of transportation"
                  },
                  avoidTolls: {
                    type: "BOOLEAN",
                    description: "Whether to avoid toll roads"
                  },
                  avoidHighways: {
                    type: "BOOLEAN",
                    description: "Whether to avoid highways"
                  },
                  avoidFerries: {
                    type: "BOOLEAN",
                    description: "Whether to avoid ferries"
                  }
                }
              }
            },
            required: ["locations"]
          }
        }]
      }],
      generationConfig: {
        temperature: 0.1
      }
    } : {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});