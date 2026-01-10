# Synexa Backend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   PORT=4000
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:4000`

## API Endpoints

### POST /chat
Send a chat request to the AI model.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ],
  "modelId": "synexa-gpt",
  "languagePreference": "auto",
  "translationMode": "none"
}
```

**Response:**
```json
{
  "text": "AI response text"
}
```

### POST /image
Generate an AI image.

**Request:**
```json
{
  "prompt": "A beautiful sunset",
  "style": "realistic",
  "size": "square",
  "modelId": "synexa-image"
}
```

**Response:**
```json
{
  "id": "img_123456",
  "url": "https://..."
}
```

## Demo Mode

If `OPENAI_API_KEY` is not set, the server runs in **demo mode** and returns placeholder responses. This allows the mobile app to work even without a configured API key.

## Mobile App Integration

The mobile app's `aiClient.ts` is configured to:
- Default to `http://localhost:4000` in development
- Use `EXPO_PUBLIC_API_BASE_URL` if set in environment variables
- Fall back to demo mode if the backend is unreachable

### Testing with Mobile App

1. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

2. Start the mobile app:
   ```bash
   npm start
   ```

3. The mobile app will automatically connect to `http://localhost:4000`

### Production Setup

For production, set `EXPO_PUBLIC_API_BASE_URL` to your deployed backend URL:
- In `.env` file: `EXPO_PUBLIC_API_BASE_URL=https://api.yourdomain.com`
- Or in `app.config.js`: `apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL`

## Security Notes

⚠️ **Important:**
- Never commit `.env` file with real API keys
- In production, configure CORS to only allow your mobile app's origin
- TODO: Add proper authentication (JWT) for production use
- Currently, the server accepts requests from any origin (CORS: `*`)

## Troubleshooting

### Server won't start
- Check if port 4000 is already in use
- Verify Node.js version (v16+)
- Run `npm install` again

### Mobile app can't connect
- Ensure backend is running on `http://localhost:4000`
- Check firewall settings
- For physical devices, use your computer's IP address instead of `localhost`
  - Example: `EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:4000`

### OpenAI API errors
- Verify your API key is correct
- Check OpenAI account has credits
- Review OpenAI API rate limits





