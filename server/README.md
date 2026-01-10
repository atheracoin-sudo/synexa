# Synexa Backend API

Backend server for Synexa AI mobile app, providing chat and image generation endpoints.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:4000` by default.

## API Endpoints

### POST /chat

Send a chat request to the AI model.

**Request Body:**
```json
{
  "messages": [
    { "role": "system", "content": "..." },
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

**Request Body:**
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

If `OPENAI_API_KEY` is not set, the server will run in demo mode and return placeholder responses. This allows the mobile app to work even without a configured API key.

## Production

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

## Security Notes

- Never commit `.env` file with real API keys
- In production, configure CORS to only allow your mobile app's origin
- TODO: Add proper authentication (JWT) for production use





