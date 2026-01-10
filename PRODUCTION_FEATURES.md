# Production Features Documentation

This document describes the production-grade features added to Synexa AI Studio.

## 1. Environment-Based Configuration

### Overview
Synexa now supports multiple deployment environments (development, staging, production) with environment-specific configurations.

### Configuration File
Located at: `src/config/appConfig.ts`

### Environment Variables
Set the environment using:
```
EXPO_PUBLIC_ENVIRONMENT=development|staging|production
```

### Configuration Properties
- **env**: Current environment
- **apiBaseUrl**: API endpoint URL (defaults vary by environment)
- **enableDebugTools**: Enable debug features (true in dev/staging)
- **enableMockFlags**: Enable mock/demo flags (true only in dev)
- **logLevel**: Logging verbosity ('debug' | 'info' | 'warn' | 'error')

### Usage
```typescript
import { appConfig, getApiBaseUrl, log } from '../config/appConfig';

// Use API base URL
const baseUrl = getApiBaseUrl();

// Log with environment-aware level
log('Debug message', 'debug');
log('Info message', 'info');
```

### Integration
- `aiClient.ts` - Uses `getApiBaseUrl()` for API calls
- `SystemStatusCard.tsx` - Uses config for status checks
- `ProviderStatusCard.tsx` - Uses config for status checks

---

## 2. In-App Feedback & Support Flow

### Overview
Users can submit feedback, bug reports, ideas, or questions directly from the app.

### Location
- **Screen**: `src/screens/FeedbackScreen.tsx`
- **Settings Entry**: Settings → Experience → "Send feedback"

### Features
- **Categories**: Bug, Idea, Question, Other
- **Subject & Message**: Required fields
- **Technical Info Toggle**: Optionally include device info, app version, environment
- **Backend Integration**: Sends via `/events` endpoint (fallback to local logging)

### Analytics
- Tracks `feedback_submitted` event on successful submission

### i18n
- Fully internationalized (EN/TR)
- Keys: `feedback.*`

---

## 3. Data Export (Backup)

### Overview
Allows users to export their Synexa data (workspaces, chats, images, videos, search history) as a JSON backup file.

### Location
- **Service**: `src/services/exportService.ts`
- **Types**: `src/types/export.ts`
- **Settings Entry**: Settings → Data & Privacy → "Export data"

### Export Format
```typescript
interface SynexaExport {
  version: 1;
  exportedAt: string; // ISO timestamp
  workspaces: Workspace[];
  chats: { [workspaceId: string]: ChatMessage[] };
  images: GeneratedImage[];
  videos: GeneratedVideo[];
  searchHistory: SearchHistoryItem[];
}
```

### Dependencies
Requires `expo-file-system` and `expo-sharing`:
```bash
npm install expo-file-system expo-sharing
```

The service gracefully handles missing dependencies with user-friendly error messages.

### Usage Flow
1. User taps "Export data" in Settings
2. Confirmation dialog appears
3. Export builds JSON file from AsyncStorage
4. File is shared via native share sheet
5. User can save or send the backup file

### Analytics
- Tracks `data_exported` event with metadata:
  - `workspacesCount`
  - `totalChats`
  - `totalImages`
  - `totalVideos`

### Limitations
- **v1**: Export only (no import yet)
- **Local-only**: Exports from device storage
- **File size**: No limits, but large exports may take time

---

## 4. Accessibility & Dynamic Text Size

### Overview
Improved accessibility by respecting system font scaling and adding screen reader support.

### Font Scaling
Key text components now use `allowFontScaling`:
- Chat messages (`ChatScreen.tsx`)
- Main buttons (Generate, Send, etc.)
- Settings labels
- Paywall and Plans screen text
- Tour overlay text

### Accessibility Labels
Added `accessibilityLabel` and `accessibilityHint` to:
- **Mic button** (`VoiceChatScreen.tsx`) - Different states: idle, recording, processing, disabled
- **Generate buttons** (`CreateScreen.tsx`) - Image and video generation
- **Search button** (`SynexaSearchScreen.tsx`)
- **Workspace selector** (`TopBar.tsx`)
- **Paywall primary CTA** (`PaywallModal.tsx`)
- **Chat send button** (`ChatScreen.tsx`)
- **Voice mode button** (`ChatScreen.tsx`)

### Accessibility States
Components properly declare:
- `accessibilityState.disabled` for disabled buttons
- `accessibilityRole` for semantic roles
- `accessibilityHint` for action descriptions

### i18n Support
All accessibility labels are internationalized (EN/TR).

### Color Contrast
- Reviewed main text vs background
- Disabled states use readable mid-gray instead of ultra-low opacity
- Body text on dark backgrounds meets contrast requirements

### Future Improvements
- TODO: Deeper accessibility testing on physical devices
- TODO: Keyboard navigation improvements
- TODO: Focus order optimization for overlay components

---

## Implementation Checklist

### ✅ Completed
- [x] Environment-based config system
- [x] Config integration in `aiClient.ts`
- [x] Feedback screen implementation
- [x] Feedback integration in Settings
- [x] Export service and types
- [x] Export UI in Settings
- [x] Accessibility labels for key components
- [x] Font scaling improvements
- [x] i18n keys for all new features
- [x] Analytics integration

### 🔄 Optional Future Enhancements
- [ ] Debug screen (tap app version 7 times)
- [ ] Dedicated `/feedback` backend endpoint
- [ ] Data import functionality
- [ ] Enhanced accessibility testing
- [ ] VoiceOver/TalkBack specific optimizations

---

## Environment Setup Guide

### Development
```bash
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
```

### Staging
```bash
EXPO_PUBLIC_ENVIRONMENT=staging
EXPO_PUBLIC_API_BASE_URL=https://staging-api.synexa-ai.com
```

### Production
```bash
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_API_BASE_URL=https://api.synexa-ai.com
```

---

## Notes

- All features follow existing architecture patterns (contexts, services, theming, i18n)
- Analytics events are non-blocking and fire-and-forget
- Error handling is graceful with user-friendly messages
- i18n keys follow existing naming conventions
- Theme integration ensures consistent design system usage




