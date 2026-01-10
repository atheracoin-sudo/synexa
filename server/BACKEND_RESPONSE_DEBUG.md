# Backend Response Debug - errorCode/errorType Sorunu

## Sorun

Mobil log'larda görülen sorun:
```
ERROR  [aiClient] API error: {
  "category": undefined,
  "errorCode": undefined,
  "errorType": undefined,
  "message": "API returned 401",
  "requestId": undefined,
  "status": 401
}
```

Backend'den dönen response'da `errorCode`, `errorType`, `category` alanları `undefined` görünüyor.

## Yapılan Düzeltmeler

### 1. Backend Response Format Düzeltmesi (`server/src/routes/chat.ts`)

✅ Enhanced error response format eklendi
✅ Error details top-level'de erişilebilir yapıldı
✅ Debug log eklendi

### 2. Frontend Error Parsing Düzeltmesi (`src/services/aiClient.ts`)

✅ Full error response log eklendi
✅ Error details extraction iyileştirildi

### 3. ChatService Error Extraction (`server/src/services/chatService.ts`)

✅ Error code extraction iyileştirildi
✅ Debug log eklendi

## Test Adımları

1. **Backend'i yeniden başlat:**
   ```bash
   cd server
   npm run dev
   ```

2. **Mobil uygulamadan chat isteği gönder**

3. **Backend log'larını kontrol et:**
   - `[chatService] Extracted error details:` log'unu kontrol et
   - `[chatService] Created structured error:` log'unu kontrol et
   - `[Chat/OpenAI] Sending error response:` log'unu kontrol et

4. **Mobil log'larını kontrol et:**
   - `[aiClient] Full error response from backend:` log'unu kontrol et
   - Backend'den gelen gerçek response formatını gör

## Beklenen Sonuç

Backend log'larında şunlar görünmeli:
```
[chatService] Extracted error details: {
  openaiErrorCode: "mismatched_project" (veya başka bir kod),
  openaiErrorType: "invalid_request_error",
  openaiErrorMessage: "..."
}

[Chat/OpenAI] Sending error response: {
  "error": {
    "errorCode": "mismatched_project",
    "errorType": "invalid_request_error",
    ...
  },
  "errorCode": "mismatched_project",
  "errorType": "invalid_request_error",
  "category": "AUTH_ERROR",
  ...
}
```

Mobil log'larında:
```
[aiClient] Full error response from backend: {
  "errorCode": "mismatched_project",
  "errorType": "invalid_request_error",
  "category": "AUTH_ERROR",
  ...
}
```

## Sonraki Adımlar

Eğer hala `undefined` görünüyorsa:
1. Backend log'larını paylaş
2. OpenAI'den dönen gerçek error response'unu kontrol et
3. Error extraction logic'ini gözden geçir







