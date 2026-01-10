# Expo Uygulamasını PowerShell'de Başlatma Rehberi

## 🚀 Hızlı Başlangıç

### Adım 1: Backend'i Başlatın

**Yeni bir PowerShell penceresi açın ve:**

```powershell
# Server klasörüne gidin
cd C:\yapayzakaai\Synexa\server

# Backend'i başlatın
npm run dev
```

✅ Backend başladığında şunu göreceksiniz:
```
🚀 Synexa Backend Server running
   Local: http://localhost:4000
   Network access: http://192.168.1.52:4000
```

---

### Adım 2: Expo Uygulamasını Başlatın

**YENİ bir PowerShell penceresi açın (backend'i kapatmadan) ve:**

#### Seçenek A: Expo Go Kullanıyorsanız (QR Kod ile)

```powershell
# Proje ana klasörüne gidin
cd C:\yapayzakaai\Synexa

# Önce mevcut Metro süreçlerini kapatın (eğer çalışıyorsa)
npm run kill:metro

# Expo Go ile başlatın (QR kod için)
npm run start:go
```

**veya:**

```powershell
# Direkt komut
npx expo start --clear
```

---

#### Seçenek B: LAN Sorunları Varsa (Tunnel Mode)

```powershell
cd C:\yapayzakaai\Synexa
npm run kill:metro
npm run start:go:tunnel
```

---

#### Seçenek C: Development Build Kullanıyorsanız

```powershell
cd C:\yapayzakaai\Synexa
npm run kill:metro
npm run start:dev
```

---

## 📱 Mobil Cihazda Açma

### Expo Go ile:

1. **Expo Go uygulamasını açın** (App Store'dan indirin)
2. **QR kodu tarayın** (Metro terminalinde görünür)
3. **veya manuel URL girin:**
   - Expo Go'da "Enter URL manually"
   - URL: `exp://192.168.1.52:8081`

---

## 🔧 Tüm PowerShell Komutları (Özet)

### Backend İşlemleri

```powershell
# Backend'i başlat
cd C:\yapayzakaai\Synexa\server
npm run dev

# Backend'i durdur
# Terminal'de Ctrl+C tuşlarına basın
```

### Metro/Expo İşlemleri

```powershell
# Ana klasöre git
cd C:\yapayzakaai\Synexa

# Metro süreçlerini kapat
npm run kill:metro

# Expo Go ile başlat (QR kod için)
npm run start:go

# Expo Go + Tunnel (LAN sorunları için)
npm run start:go:tunnel

# Development Build ile başlat
npm run start:dev

# Development Build + Tunnel
npm run start:tunnel
```

---

## 🎯 Hangi Komutu Kullanmalıyım?

| Durum | Komut |
|-------|-------|
| **İlk kez başlatıyorum** | `npm run start:go` |
| **QR kod okutmuyor** | `npm run start:go:tunnel` |
| **Development Build kullanıyorum** | `npm run start:dev` |
| **Port çakışması var** | `npm run kill:metro` sonra `npm run start:go` |

---

## ⚠️ Önemli Notlar

1. **İki Terminal Pencere Gerekli:**
   - **Terminal 1:** Backend (`npm run dev`)
   - **Terminal 2:** Expo (`npm run start:go`)

2. **Aynı Wi-Fi Ağı:**
   - PC ve mobil cihaz aynı Wi-Fi ağında olmalı

3. **Firewall:**
   - Port 4000 (backend) ve 8081 (Metro) açık olmalı

4. **Backend Çalışmalı:**
   - Expo'yu başlatmadan önce backend'in çalıştığından emin olun

---

## 🐛 Sorun Giderme

### Metro başlamıyor:

```powershell
# Metro süreçlerini zorla kapat
npm run kill:metro

# Cache temizleyerek başlat
npx expo start --clear
```

### QR kod görünmüyor:

```powershell
# Tunnel mode kullan
npm run start:go:tunnel

# Veya tarayıcıda aç:
# http://localhost:19002
```

### Backend'e bağlanamıyor:

1. Backend'in çalıştığını kontrol edin: `http://localhost:4000/health`
2. Mobil cihazdan test edin: `http://192.168.1.52:4000/health`
3. Aynı Wi-Fi ağında olduğunuzdan emin olun

---

## ✅ Başarı Kontrol Listesi

- [ ] Backend çalışıyor (`npm run dev`)
- [ ] Backend URL: `http://192.168.1.52:4000`
- [ ] Metro çalışıyor (`npm run start:go`)
- [ ] QR kod görünüyor
- [ ] Mobil cihaz aynı Wi-Fi'da
- [ ] Expo Go uygulaması yüklü

---

## 📞 Hızlı Komutlar (Kopyala-Yapıştır)

### İlk Başlatma (Expo Go):

```powershell
# Terminal 1 - Backend
cd C:\yapayzakaai\Synexa\server
npm run dev
```

```powershell
# Terminal 2 - Expo
cd C:\yapayzakaai\Synexa
npm run kill:metro
npm run start:go
```

### Yeniden Başlatma:

```powershell
# Metro'yu kapat ve yeniden başlat
cd C:\yapayzakaai\Synexa
npm run kill:metro
npm run start:go
```

---

## 🎉 Başarılı Başlatma

Expo başarıyla başladığında şunu göreceksiniz:

```
Metro waiting on exp://192.168.1.52:8081
Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

Artık QR kodu tarayarak uygulamayı açabilirsiniz!







