# Synexa Uygulamasını Çalıştırma Kılavuzu

## 📋 Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Android Studio (Android için) veya Xcode (iOS için - sadece macOS)
- Expo CLI (`npm install -g expo-cli` veya `npm install -g @expo/cli`)

---

## 🚀 Hızlı Başlangıç

### 1️⃣ Backend Hazırlığı

#### a) Backend Dependencies Kurulumu
```bash
cd server
npm install
```

#### b) Environment Variables (.env dosyası oluştur)
`server/.env` dosyası oluşturun:

```bash
# Database (SQLite için)
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret (kendi secret'ınızı oluşturun)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# AI Provider (opsiyonel - demo mode için boş bırakılabilir)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server Port
PORT=4000

# Demo Fallback (backend yoksa demo mod)
ALLOW_DEMO_FALLBACK=true
```

**Not:** Eğer OpenAI API key'iniz yoksa, backend demo mode'da çalışacak.

#### c) Database Migrate
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

#### d) Backend'i Başlat
```bash
cd server
npm run dev
```

Backend başarıyla çalışıyorsa şunu görmelisiniz:
```
✅ Server running on port 4000
✅ Database connected
```

---

### 2️⃣ Mobile App Hazırlığı

#### a) Root Dizinde Dependencies Kurulumu
```bash
# Ana dizine dönün
cd ..

# Dependencies kurun
npm install
```

#### b) Environment Variable Ayarlama

**Android Emulator için (varsayılan):**
`.env` dosyası oluşturun (root dizinde):
```bash
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:4000
```

**iOS Simulator için (macOS):**
`.env` dosyası:
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
```

**Fiziksel Cihaz için:**
1. Bilgisayarınızın LAN IP'sini bulun:
   - Windows: `ipconfig` → IPv4 Address
   - macOS/Linux: `ifconfig` veya `ip addr`
   
2. Backend'i `0.0.0.0:4000` adresine bind edin (server/src/index.ts'de kontrol edin)

3. `.env` dosyası:
```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.XXX:4000
```
(XXX yerine kendi IP'nizi yazın)

#### c) Mobile App'i Başlat

**Metro Bundler'ı başlat:**
```bash
npm start
```

**Veya doğrudan platform'u seç:**
```bash
# Android
npm run android

# iOS (sadece macOS)
npm run ios

# Web
npm run web
```

---

## 🎯 Komutlar Özeti

### Terminal 1: Backend
```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Terminal 2: Mobile App
```bash
npm install
npm start
# Sonra 'a' tuşuna basın (Android) veya 'i' tuşuna basın (iOS)
```

---

## 🔧 Sorun Giderme

### Backend çalışmıyor
- ✅ `server/.env` dosyası oluşturuldu mu?
- ✅ `npm install` çalıştırıldı mı?
- ✅ `npm run prisma:migrate` çalıştırıldı mı?
- ✅ Port 4000 kullanımda mı? (`netstat -an | findstr :4000` - Windows)

### Mobile app backend'e bağlanamıyor
- ✅ Backend çalışıyor mu? (http://localhost:4000 kontrol edin)
- ✅ `EXPO_PUBLIC_API_BASE_URL` doğru mu?
- ✅ Android Emulator kullanıyorsanız `10.0.2.2:4000` kullanın
- ✅ iOS Simulator kullanıyorsanız `localhost:4000` kullanın
- ✅ Fiziksel cihaz kullanıyorsanız bilgisayarınızın LAN IP'sini kullanın

### Metro Bundler hataları
```bash
# Cache temizle
npm start -- --reset-cache

# Veya
expo start -c
```

### Prisma hataları
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

---

## 📱 Test Etme

1. **Backend test:** http://localhost:4000/health (eğer health endpoint varsa)
2. **Mobile app:** Expo Go uygulaması ile QR kodu tarayın veya emulator'da açın
3. **Login test:** Demo account ile giriş yapın (`/auth/demo` endpoint'i)

---

## 🎨 Demo Mode

Eğer backend çalışmıyorsa veya bağlanamıyorsa, uygulama otomatik olarak **demo mode**'a geçecek. Demo mode'da:
- Gerçek AI yanıtları yerine simüle edilmiş yanıtlar gösterilir
- Krediler lokal olarak yönetilir
- Backend özellikleri devre dışıdır

---

## 📚 Daha Fazla Bilgi

- Backend API: `server/README.md`
- Backend Setup: `server/BACKEND_SETUP.md`
- Production Features: `PRODUCTION_FEATURES.md`









