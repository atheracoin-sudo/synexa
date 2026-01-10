# QR Kod Sorun Giderme Rehberi

## iOS'ta QR Kod Okutunca Uygulama Açılmıyor

### Hızlı Çözüm

1. **Expo Go kullanıyorsanız:**
   ```bash
   # Metro'yu Expo Go modunda başlatın (--dev-client OLMADAN)
   npm run start:go
   ```

2. **QR kod hala çalışmıyorsa:**
   ```bash
   # Tunnel mode deneyin
   npm run start:go:tunnel
   ```

### Detaylı Sorun Giderme

#### Sorun 1: "Development build required" hatası

**Sebep:** `--dev-client` flag'i kullanılıyor ama Expo Go ile açılmaya çalışılıyor.

**Çözüm:**
```bash
# Expo Go için (QR kod ile açmak için)
npm run start:go

# Development build için
npm run start:dev
```

#### Sorun 2: QR kod okunmuyor

**Çözümler:**

1. **Tunnel mode kullan:**
   ```bash
   npm run start:go:tunnel
   ```
   Bu, ngrok benzeri bir tunnel kullanır ve QR kod daha güvenilir çalışır.

2. **Manuel URL girin:**
   - Expo Go uygulamasını açın
   - "Enter URL manually" seçeneğini tıklayın
   - Metro terminalinde görünen URL'i girin (örn: `exp://192.168.1.52:8081`)

3. **QR kod kalitesini artırın:**
   - Terminal'deki QR kod çok küçükse, tarayıcıda `http://localhost:19002` açın
   - Oradaki QR kod daha büyük ve net olacaktır

#### Sorun 3: "Could not connect to development server"

**Çözümler:**

1. **Wi-Fi kontrolü:**
   - PC ve iOS cihaz aynı Wi-Fi ağında olmalı
   - Firewall Metro portunu (8081) engelliyor olabilir

2. **Tunnel mode kullan:**
   ```bash
   npm run start:go:tunnel
   ```
   Bu, LAN sorunlarını aşar.

3. **Metro'yu yeniden başlat:**
   ```bash
   npm run kill:metro
   npm run start:go -- --clear
   ```

#### Sorun 4: Expo Go uygulaması yüklü değil

**Çözüm:**
1. iOS App Store'dan "Expo Go" uygulamasını indirin
2. Uygulamayı açın
3. QR kodu tarayın

#### Sorun 5: QR kod okunuyor ama uygulama açılmıyor

**Kontrol listesi:**

1. ✅ Expo Go uygulaması yüklü mü?
2. ✅ Metro çalışıyor mu? (Terminal'de "Metro waiting on..." görünüyor mu?)
3. ✅ `npm run start:go` komutu kullanıldı mı? (`--dev-client` OLMADAN)
4. ✅ PC ve iOS cihaz aynı Wi-Fi'da mı?
5. ✅ Firewall Metro portunu engelliyor mu?

**Alternatif çözümler:**

1. **Tunnel mode:**
   ```bash
   npm run start:go:tunnel
   ```

2. **Manuel bağlantı:**
   - Expo Go'da "Enter URL manually"
   - URL: `exp://[PC_IP_ADDRESS]:8081`
   - PC IP adresini bulmak için:
     - Windows: `ipconfig` → IPv4 Address
     - Mac/Linux: `ifconfig` veya `ip addr`

3. **iOS Simulator kullan:**
   ```bash
   npm run ios
   ```
   Bu, iOS Simulator'ı otomatik açar ve bağlanır.

### Hangi Komutu Kullanmalıyım?

| Durum | Komut |
|-------|-------|
| Expo Go ile QR kod okutmak | `npm run start:go` |
| Expo Go + Tunnel (LAN sorunları) | `npm run start:go:tunnel` |
| Development Build kullanıyorum | `npm run start:dev` |
| Development Build + Tunnel | `npm run start:tunnel` |

### Test Adımları

1. Metro'yu başlatın:
   ```bash
   npm run start:go
   ```

2. Terminal'de QR kod görünmeli

3. iOS cihazda Expo Go'yu açın

4. QR kodu tarayın

5. Uygulama açılmalı

Eğer hala çalışmıyorsa, tunnel mode deneyin:
```bash
npm run start:go:tunnel
```

