# AI Client Auth Token Fix - Tamamlandı

## Sorun

`aiClient.ts` yanlış API client kullanıyordu:
- `utils/apiClient.ts`'den `getAuthHeaders()` kullanıyordu
- Bu lazy import kullanıyor ve `setAuthHelpers` ile register edilmesi gerekiyordu
- Ama `AuthContext.tsx`'de `setAuthHelpers` çağrısı yoktu
- Bu yüzden token gönderilmiyordu

## Yapılan Düzeltme

✅ `aiClient.ts` artık `services/apiClient.ts`'den token alıyor
✅ `getAuthToken()` direkt import edildi
✅ `getAuthHeaders()` helper fonksiyonu eklendi (token'ı `services/apiClient.ts`'den alıyor)
✅ Tüm fetch çağrıları bu helper'ı kullanıyor

## Test

Backend'i yeniden başlatıp test edin:
```bash
cd server
npm run dev
```

Artık `/chat/openai` endpoint'ine istek gönderilirken auth token gönderilecek.







