# Version Information

**Current Version: 1.0.0-secure**

## Security Features

- API keys are securely handled via server-side proxy
- Map loads properly with secure token handling
- No client-side exposure of sensitive credentials

This version implements a secure architecture where all API keys are stored on the server side and accessed through proxy endpoints, ensuring they are never exposed to client-side code or visible in network requests.