# IP Adresi Güncelleme Özeti

## Değiştirilen Dosyalar

### 1. ✅ IOS_DEV_SETUP.md
- **Eski:** `exp://192.168.1.4:8081`
- **Yeni:** `exp://192.168.1.52:8081`
- **Satır:** 102

### 2. ✅ QR_CODE_TROUBLESHOOTING.md
- **Eski:** `exp://192.168.1.4:8081`
- **Yeni:** `exp://192.168.1.52:8081`
- **Satır:** 47

## Zaten Yeni IP'yi Kullanan Dosyalar

Aşağıdaki dosyalar zaten yeni IP adresini (`http://192.168.1.52:4000`) kullanıyor:

1. ✅ **src/config/appConfig.ts**
   - Varsayılan API URL: `http://192.168.1.52:4000`
   - Satırlar: 35, 42, 107, 132

2. ✅ **src/components/ConnectionSettings.tsx**
   - Placeholder: `http://192.168.1.52:4000`
   - Satır: 211

3. ✅ **src/components/ConnectionErrorScreen.tsx**
   - Varsayılan URL: `http://192.168.1.52:4000`
   - Satırlar: 42, 167

4. ✅ **server/.env**
   - LOCAL_NETWORK_IP: `192.168.1.52`
   - Satır: 10

5. ✅ **server/src/index.ts**
   - Fallback IP: `192.168.1.52`
   - Satır: 136

## Backend URL Konfigürasyonu

### Aktif Backend URL:
```
http://192.168.1.52:4000
```

### Kullanıldığı Yerler:
- Development mode varsayılan API base URL
- iOS Simulator ve gerçek cihazlar için
- Android gerçek cihazlar için (emulator için 10.0.2.2 kullanılıyor)

## Önemli Notlar

1. **Environment Variable Override:**
   - `EXPO_PUBLIC_API_BASE_URL` environment variable ile override edilebilir
   - Öncelik sırası:
     1. Dynamic base URL (AsyncStorage'den)
     2. EXPO_PUBLIC_API_BASE_URL env var
     3. Platform-specific defaults

2. **Backend Sunucusu:**
   - Backend'in `npm run dev` ile çalıştığından emin olun
   - Backend port: 4000
   - Backend `0.0.0.0` üzerinden dinliyor (tüm ağ arayüzleri)

## Sonraki Adımlar

1. Backend'i başlatın:
   ```bash
   cd server
   npm run dev
   ```

2. Expo uygulamasını cache temizleyerek başlatın:
   ```bash
   npx expo start --clear
   ```

3. Bağlantıyı test edin:
   - Mobil cihazınızdan: `http://192.168.1.52:4000/health`
   - Tarayıcıdan: `http://localhost:4000/health`







