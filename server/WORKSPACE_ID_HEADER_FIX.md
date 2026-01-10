# Workspace ID Header Fix

## Sorun

Backend'den "Workspace not found" hatası geliyordu çünkü frontend chat request'lerinde workspace ID göndermiyordu.

## Yapılan Düzeltmeler

### 1. Frontend - ChatRequestOptions Interface (`src/services/aiClient.ts`)

✅ `ChatRequestOptions` interface'ine `workspaceId?: string` eklendi

### 2. Frontend - Header'a Workspace ID Ekleme (`src/services/aiClient.ts`)

✅ `sendChatRequest` fonksiyonunda workspace ID header'a eklendi: `x-workspace-id`

### 3. Frontend - ChatScreen'de Workspace ID Gönderme (`src/screens/ChatScreen.tsx`)

✅ Tüm `sendChatRequest` çağrılarına `workspaceId: activeWorkspaceId || undefined` eklendi

## Test

Backend'i ve mobil uygulamayı yeniden başlatıp test edin.







