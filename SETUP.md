# Nova AI - Setup Guide

## OpenAI API Key Kurulumu

### 1. API Key Alma

1. [OpenAI Platform](https://platform.openai.com/) adresine gidin
2. Hesap oluşturun veya giriş yapın
3. [API Keys](https://platform.openai.com/api-keys) sayfasına gidin
4. "Create new secret key" butonuna tıklayın
5. Key'i kopyalayın (bir daha gösterilmeyecek!)

### 2. API Key'i Projeye Ekleme

#### Yöntem 1: Environment Variable (Önerilen)

Terminal'de proje klasöründe:

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-your-key-here"
npm start
```

**Windows (CMD):**
```cmd
set OPENAI_API_KEY=sk-your-key-here
npm start
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY=sk-your-key-here
npm start
```

#### Yöntem 2: .env Dosyası

1. Proje root klasöründe `.env` dosyası oluşturun
2. İçine şunu ekleyin:
```
OPENAI_API_KEY=sk-your-key-here
```

**Not:** `.env` dosyası `.gitignore`'da olduğu için git'e commit edilmeyecek.

### 3. Doğrulama

Uygulamayı başlattıktan sonra:
- Chat ekranında bir mesaj gönderin
- Image generation'da bir görsel oluşturun

Eğer hata alırsanız, API key'in doğru olduğundan emin olun.

## Sorun Giderme

### "OpenAI API key is not configured" hatası

- API key'in doğru set edildiğinden emin olun
- Uygulamayı yeniden başlatın
- Terminal'de `echo $OPENAI_API_KEY` (Linux/Mac) veya `echo %OPENAI_API_KEY%` (Windows) ile kontrol edin

### API Rate Limit hatası

- OpenAI hesabınızda kredi olduğundan emin olun
- [OpenAI Usage](https://platform.openai.com/usage) sayfasından kontrol edin

### Network hatası

- İnternet bağlantınızı kontrol edin
- VPN kullanıyorsanız kapatmayı deneyin






