# iOS Development Server Setup

## Hızlı Başlangıç

### 1. Metro'yu Başlatma

**Expo Go kullanıyorsanız (Önerilen - QR kod ile açmak için):**

**Windows (PowerShell):**
```powershell
# Mevcut Metro süreçlerini kapat
npm run kill:metro

# Expo Go ile başlat (QR kod için)
npm run start:go

# Veya tunnel mode (LAN sorunları varsa)
npm run start:go:tunnel
```

**Mac/Linux:**
```bash
# Mevcut Metro süreçlerini kapat
npm run kill:metro

# Expo Go ile başlat (QR kod için)
npm run start:go

# Veya tunnel mode (LAN sorunları varsa)
npm run start:go:tunnel
```

**Development Build kullanıyorsanız:**

**Windows (PowerShell):**
```powershell
# Mevcut Metro süreçlerini kapat
npm run kill:metro

# Dev client ile başlat
npm run start:dev

# Veya tunnel mode (LAN sorunları varsa)
npm run start:tunnel
```

**Mac/Linux:**
```bash
# Mevcut Metro süreçlerini kapat
npm run kill:metro

# Dev client ile başlat
npm run start:dev

# Veya tunnel mode (LAN sorunları varsa)
npm run start:tunnel
```

### 2. iOS Cihazda Bağlanma

1. **Expo Go kullanıyorsanız (QR kod ile açmak için):**
   - App Store'dan **Expo Go** uygulamasını indirin (eğer yoksa)
   - Metro'yu `npm run start:go` ile başlatın
   - Expo Go uygulamasını açın
   - QR kodu tarayın (Metro terminalinde veya `http://localhost:19002` sayfasında görünür)
   - Veya Expo Go'da "Enter URL manually" ile Metro'nun gösterdiği URL'i girin
   - **ÖNEMLİ:** `--dev-client` flag'i kullanırsanız Expo Go çalışmaz!

2. **Development Build kullanıyorsanız:**
   - Önce development build'i cihaza yüklemelisiniz: `npx expo run:ios`
   - Uygulamayı açın
   - Metro bundler'a otomatik bağlanacaktır
   - Bağlanamazsa, Expo dev tools'da "Connection" → "Tunnel" seçin

### 3. Bağlantı Sorunları

**"Could not connect to development server" hatası alıyorsanız:**

1. **Wi-Fi Kontrolü:**
   - PC ve iOS cihaz aynı Wi-Fi ağında olmalı
   - Firewall Metro portunu (8081) engelliyor olabilir

2. **Tunnel Mode Kullan:**
   ```bash
   npm run start:tunnel
   ```
   Bu, ngrok benzeri bir tunnel kullanır ve LAN sorunlarını aşar.

3. **Metro'yu Yeniden Başlat:**
   ```bash
   npm run kill:metro
   npm run start:dev -- --clear
   ```

4. **iOS Simulator Kullanıyorsanız:**
   - Simulator'da `Cmd + D` → "Reload"
   - Veya `Cmd + R` ile yeniden yükle

5. **Fiziksel Cihaz Kullanıyorsanız:**
   - iOS cihazda Settings → Developer → "Allow HTTP connections" açık olmalı
   - Metro'nun gösterdiği IP adresini kontrol edin
   - Manuel olarak URL girin: `exp://192.168.1.52:8081`

### 4. Port Kontrolü

Port 8081 kullanılıyorsa:
```bash
# Windows
netstat -ano | findstr :8081

# Mac/Linux
lsof -i :8081

# Kapatmak için
npm run kill:metro
```

### 5. Expo Dev Tools

Metro başladığında:
- Tarayıcıda `http://localhost:19002` açılır
- Buradan:
  - Connection → Tunnel/LAN seçebilirsiniz
  - QR kod görebilirsiniz
  - Logları takip edebilirsiniz

## Troubleshooting

### Metro başlamıyor
- Node.js versiyonunu kontrol edin: `node --version` (v16+ olmalı)
- `npm install` çalıştırın
- `npx expo install --fix` çalıştırın

### iOS cihaz bağlanamıyor
- Tunnel mode kullanın: `npm run start:tunnel`
- Firewall'u kontrol edin
- VPN kullanıyorsanız kapatın

### Bundle yüklenmiyor
- Metro cache'i temizleyin: `npm run start:dev -- --clear`
- iOS cihazda uygulamayı kapatıp yeniden açın
- Simulator'da `Cmd + Shift + H` → "Shake" → "Reload"

