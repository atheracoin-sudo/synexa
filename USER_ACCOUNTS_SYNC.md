# User Accounts & Cloud Sync Implementation

## Overview

Synexa now has full user account support with cloud sync for workspaces and chat history. Users can sign in, and their data is persisted across devices via a backend database.

## Backend Implementation

### Database Schema (Prisma + SQLite)

**Location**: `server/prisma/schema.prisma`

**Models**:
- **User**: Stores user accounts (email, name, provider: 'demo' | 'google' | 'local')
- **Workspace**: User workspaces (linked to User via userId)
- **ChatMessage**: Chat messages (linked to Workspace and User)

### Authentication

**Files**:
- `server/src/services/authService.ts` - JWT token generation/verification
- `server/src/services/userService.ts` - User CRUD operations
- `server/src/middleware/authMiddleware.ts` - Express middleware for auth
- `server/src/routes/auth.ts` - Auth endpoints

**Endpoints**:
- `POST /auth/demo` - Demo authentication (creates/finds user, returns JWT)
- `GET /auth/me` - Get current user info (requires auth)
- `GET /auth/google` - TODO: Google OAuth (stub)
- `GET /auth/google/callback` - TODO: Google OAuth callback (stub)

### Workspace Routes

**File**: `server/src/routes/workspaces.ts`

**Endpoints** (all require auth):
- `GET /workspaces` - Get all user workspaces
- `POST /workspaces` - Create workspace
- `PATCH /workspaces/:id` - Update workspace (name, icon)
- `DELETE /workspaces/:id` - Delete workspace
- `POST /workspaces/ensure-default` - Ensure user has a default workspace

### Chat History Routes

**File**: `server/src/routes/chatHistory.ts`

**Endpoints** (all require auth):
- `GET /chat/:workspaceId` - Get chat messages for workspace
- `POST /chat/:workspaceId` - Save chat messages
- `DELETE /chat/:workspaceId` - Clear chat history

## Frontend Implementation

### Authentication

**Files**:
- `src/context/AuthContext.tsx` - Extended with:
  - `loginDemo(email?)` - Authenticate with demo account
  - `token` state - JWT token storage
  - `refreshUser()` - Refresh user info from backend
  - `getAuthToken()` - Get token for API calls
  - Auto-load token on app start
  - Token verification via `/auth/me`

- `src/screens/LoginScreen.tsx` - New login screen with:
  - Email input (optional)
  - Continue button (calls `loginDemo`)
  - Google sign-in button (TODO stub)
  - Full i18n support (EN/TR)

- `src/utils/apiClient.ts` - Authenticated fetch wrapper:
  - Automatically adds `Authorization: Bearer <token>` headers
  - Handles 401/403 globally (calls logout)
  - `getAuthHeaders()` - Helper for manual fetch calls

### Navigation

**File**: `src/navigation/AppNavigator.tsx`

- Updated to show `LoginScreen` when `user === null`
- Shows main app when `user` exists
- Removed old AuthScreen/Onboarding flow in favor of simple LoginScreen

### Workspace Sync

**File**: `src/context/WorkspaceContext.tsx`

**Changes**:
- Injects `useAuth()` to access `user` and `token`
- `loadWorkspacesFromBackend()` - Loads workspaces from `/workspaces` on login
- `createWorkspace()` - POSTs to `/workspaces`, updates local state on success
- `renameWorkspace()` - PATCHes `/workspaces/:id`, updates local state
- `deleteWorkspace()` - DELETEs `/workspaces/:id`, updates local state
- All operations fall back to local storage if backend unavailable
- Local storage used as cache/backup

**Sync Flow**:
1. On auth state change (login): Trigger `loadWorkspacesFromBackend()`
2. On logout: Reset to local workspaces only
3. On create/rename/delete: Call backend first, update local on success

### Chat Sync

**File**: `src/screens/ChatScreen.tsx`

**Changes**:
- Added `loadChatHistoryFromBackend()` - Loads messages from `/chat/:workspaceId`
- Added `saveChatMessagesToBackend()` - Saves new messages to backend (non-blocking)
- Added `loadChatHistoryFromLocal()` - Fallback to local storage
- Loads history on mount/workspace change when authenticated
- Saves messages after AI response (user + assistant messages)
- Local storage used as cache/backup

**Sync Flow**:
1. On mount/workspace change: Load from backend if authenticated, else local
2. After user sends message: Save to local immediately
3. After AI response: Save both messages to local + backend (non-blocking)

### Account Section in Settings

**File**: `src/screens/SettingsScreen.tsx`

**Added**:
- New "Account" section at top of settings
- Displays:
  - Email
  - Sign-in type (Demo / Google / Email)
  - Demo account note (if provider === 'demo')
  - Sign out button
- Sign out confirmation dialog
- Full i18n support (EN/TR)

**i18n Keys Added**:
- `screens.settings.account.*` (title, email, provider, demoNote, signOut, etc.)

## Setup Instructions

### Backend Setup

1. **Install dependencies**:
```bash
cd server
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your settings:
# - DATABASE_URL (SQLite: file:./dev.db)
# - AUTH_JWT_SECRET (strong random string)
# - AUTH_TOKEN_EXPIRY (default: 30d)
```

3. **Initialize database**:
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Start server**:
```bash
npm run dev
```

### Frontend Setup

No additional setup required. The frontend automatically:
- Shows LoginScreen if not authenticated
- Includes auth headers in all API calls
- Syncs workspaces and chat on login

## Usage Flow

1. **First Launch**:
   - App shows LoginScreen
   - User enters email (optional) or leaves blank
   - Taps "Continue"
   - Backend creates/finds user, returns JWT
   - Workspaces loaded from backend
   - User sees main app

2. **Using Workspaces**:
   - Creating workspace: Saved to backend immediately
   - Renaming workspace: Updated on backend
   - Deleting workspace: Removed from backend
   - Switching workspace: Chat history loads from backend

3. **Using Chat**:
   - Opening chat: Messages load from backend (if authenticated)
   - Sending message: Saved to local immediately, then backend
   - AI response: Both messages saved to backend

4. **Signing Out**:
   - Tap "Sign out" in Settings
   - Confirm
   - Token cleared, user state reset
   - App returns to LoginScreen

## Edge Cases Handled

- **Backend unavailable**: Falls back to local storage gracefully
- **Auth token expired**: Auto-logout on 401/403
- **Workspace not found**: Error handling with user-friendly messages
- **Network errors**: Non-blocking, doesn't break UI
- **Offline mode**: Local storage works independently

## Security Notes

- JWT tokens stored in AsyncStorage (TODO: Use secure storage for production)
- Tokens never logged in analytics/events
- Export JSON excludes auth tokens
- All backend routes verify user ownership of resources

## Future Enhancements

- [ ] Google OAuth implementation
- [ ] Email/password authentication
- [ ] Secure token storage (Keychain/Keystore)
- [ ] Offline message queue with conflict resolution
- [ ] Full two-way sync with timestamps
- [ ] Image/video metadata sync
- [ ] Search history sync
- [ ] Migration tool for existing local data

## Testing

1. **Test login**: Enter email or leave blank, verify token received
2. **Test workspace sync**: Create/rename/delete, verify persists on reload
3. **Test chat sync**: Send messages, reload app, verify history loads
4. **Test sign out**: Sign out, verify returns to login
5. **Test offline**: Disable backend, verify local fallback works

## Troubleshooting

- **"Authentication required" errors**: Check AUTH_JWT_SECRET is set
- **Workspaces not loading**: Check backend is running and DATABASE_URL is correct
- **Chat history not saving**: Check workspace belongs to user
- **401 errors**: Token may be expired, try signing out and back in




