# IP Adresi Güncelleme Özeti

## ✅ Tamamlanan İşlemler

### Değiştirilen Dosyalar

1. **IOS_DEV_SETUP.md**
   - Eski: `exp://192.168.1.4:8081`
   - Yeni: `exp://192.168.1.52:8081`

2. **QR_CODE_TROUBLESHOOTING.md**
   - Eski: `exp://192.168.1.4:8081`
   - Yeni: `exp://192.168.1.52:8081`

### Zaten Yeni IP'yi Kullanan Dosyalar

Aşağıdaki dosyalar zaten `http://192.168.1.52:4000` adresini kullanıyordu:

- `src/config/appConfig.ts` - Ana yapılandırma dosyası
- `src/components/ConnectionSettings.tsx` - Bağlantı ayarları
- `src/components/ConnectionErrorScreen.tsx` - Hata ekranı
- `server/.env` - Sunucu ortam değişkenleri
- `server/src/index.ts` - Sunucu yapılandırması

## 🔗 Yeni Backend URL

```
http://192.168.1.52:4000
```

## 📝 Komutlar

### Backend'i Başlatma
```bash
cd server
npm run dev
```

### Expo'yu Cache Temizleyerek Başlatma

**Windows (PowerShell):**
```powershell
.\scripts\start-expo-clear.ps1
```

**veya direkt komut:**
```powershell
npx expo start --clear
```

**Linux/Mac:**
```bash
chmod +x scripts/start-expo-clear.sh
./scripts/start-expo-clear.sh
```

**veya direkt komut:**
```bash
npx expo start --clear
```

## ⚠️ Önemli Notlar

1. **Backend Sunucusu:** Backend'in `npm run dev` ile çalıştığından emin olun
2. **Aynı Ağ:** Mobil cihaz ve PC aynı Wi-Fi ağında olmalı
3. **Firewall:** Port 4000'in firewall tarafından engellenmediğinden emin olun

## 🧪 Bağlantı Testi

Backend'in çalıştığını test etmek için:

- **Mobil cihazdan:** `http://192.168.1.52:4000/health`
- **PC'den:** `http://localhost:4000/health`

Her iki durumda da `{"status":"ok"}` benzeri bir JSON yanıtı görmelisiniz.







