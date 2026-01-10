# Backend Setup Guide

## Prerequisites

1. Install dependencies:
```bash
cd server
npm install
```

2. Install Prisma CLI (if not already installed):
```bash
npm install -g prisma
```

## Database Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your settings:
- `DATABASE_URL`: SQLite database path (default: `file:./dev.db`)
- `AUTH_JWT_SECRET`: Strong random string for JWT signing
- `AUTH_TOKEN_EXPIRY`: Token expiration (default: `30d`)
- `OPENAI_API_KEY`: Your OpenAI API key

3. Generate Prisma Client:
```bash
npm run prisma:generate
```

4. Run migrations to create database tables:
```bash
npm run prisma:migrate
```

5. (Optional) Open Prisma Studio to view database:
```bash
npm run prisma:studio
```

## Start Server

```bash
npm run dev
```

The server will start on `http://localhost:4000` (or the port specified in `.env`).

## API Endpoints

### Auth
- `POST /auth/demo` - Demo authentication
- `GET /auth/me` - Get current user (requires auth)

### Workspaces (requires auth)
- `GET /workspaces` - Get all user workspaces
- `POST /workspaces` - Create workspace
- `PATCH /workspaces/:id` - Update workspace
- `DELETE /workspaces/:id` - Delete workspace
- `POST /workspaces/ensure-default` - Ensure user has a default workspace

### Chat History (requires auth)
- `GET /chat/:workspaceId` - Get chat messages for workspace
- `POST /chat/:workspaceId` - Save chat messages
- `DELETE /chat/:workspaceId` - Clear chat history

## Testing

1. Test demo auth:
```bash
curl -X POST http://localhost:4000/auth/demo \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

2. Test with token:
```bash
# Save token from previous response
TOKEN="your_token_here"

curl http://localhost:4000/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Production Notes

- Change `AUTH_JWT_SECRET` to a strong random string
- Consider migrating to PostgreSQL for production
- Update `DATABASE_URL` to PostgreSQL connection string
- Run migrations: `npm run prisma:migrate deploy`




