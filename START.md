# Synexa AI Studio - Başlatma Talimatları

## Hızlı Başlangıç

### 1. Backend Server (Terminal 1)
```powershell
cd server
npm run dev
```

Backend `http://localhost:4000` üzerinde çalışacak.

### 2. Mobile App (Terminal 2)
```powershell
# Root klasörde
npm start
```

Veya direkt Android emulator için:
```powershell
npm run android
```

## Önemli Ayarlar

### API Base URL
- **Android Emulator**: `http://10.0.2.2:4000` (varsayılan)
- **iOS Simulator**: `http://localhost:4000`
- **Fiziksel Cihaz**: Makinenizin LAN IP'si (örn: `http://192.168.1.23:4000`)

Fiziksel cihaz için root klasörde `.env` dosyası oluşturun:
```
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.23:4000
```

### Database
Database migration'ı zaten uygulandı. Backend ilk çalıştırıldığında `server/prisma/dev.db` dosyası otomatik oluşturulur.

## İlk Kullanım
1. Uygulama açıldığında Login Screen görünür
2. Email (opsiyonel) girip "Continue" butonuna basın
3. Demo hesap oluşturulur ve otomatik giriş yapılır
4. Home Screen'e yönlendirilirsiniz

## Test Endpoints
- Backend Health: http://localhost:4000/health
- Backend Status: http://localhost:4000/status

## Sorun Giderme

### Backend başlamıyorsa
```powershell
cd server
npm install
npx prisma generate
npm run dev
```

### Mobile app backend'e bağlanamıyorsa
1. Backend'in çalıştığını kontrol edin: `http://localhost:4000/health`
2. `src/config/appConfig.ts` içindeki `apiBaseUrl` ayarını kontrol edin
3. Firewall'ın port 4000'i engellemediğinden emin olun




