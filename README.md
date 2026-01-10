# Synexa Studio

All-in-one AI Studio: Chat, Code, Design. Next.js 14 App Router, TypeScript ve Tailwind CSS ile geliştirilmiştir.

## ✨ Özellikler

### 🎨 Modern UI/UX
- **Design System**: Tutarlı Button, Input, Card, Badge, Toast bileşenleri
- **Dark Mode**: Sistem tercihine uyumlu tema desteği
- **Responsive**: Mobil ve desktop cihazlarda mükemmel görünüm
- **Accessibility**: Focus states, aria-labels, keyboard navigation

### 💬 AI Chat
- **Gerçek Zamanlı Streaming**: OpenAI API'den gelen yanıtlar canlı görüntülenir
- **Markdown Desteği**: Kod blokları, tablolar, listeler
- **Code Copy**: Kod bloklarında tek tıkla kopyalama
- **Prompt Örnekleri**: Boş durumda 6 başlangıç kartı
- **Error Handling**: Retry, timeout, rate limit bildirimleri

### 💻 Code Studio
- **Monaco Editor**: VS Code kalitesinde kod editörü
- **File Tree**: Arama, yeniden adlandırma, silme
- **AI Panel**: Kod değişiklikleri için AI asistan
- **Diff Preview**: Değişiklikleri önizleme ve uygulama
- **Undo**: Geri alma desteği
- **Shortcuts**: Ctrl+S kaydet, Ctrl+Enter AI generate

### 🎨 Design Studio
- **Canvas**: Zoom, grid, snap desteği
- **Tools**: Select, Rectangle, Circle, Text araçları
- **Properties**: Renk, boyut, döndürme düzenleme
- **Layers**: Z-order, yeniden adlandırma, silme
- **Export**: PNG 1x/2x export seçenekleri

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

### 2. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun:

```env
# Backend API URL (önerilen)
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# OpenAI API Key (backend kullanılmıyorsa gerekli)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

**Not:** Backend API kullanıyorsanız sadece `NEXT_PUBLIC_API_BASE_URL` yeterlidir. OpenAI API key'i backend'de yapılandırılmalıdır.

### 3. Backend Sunucusunu Başlatın (Önerilen)

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev
```

Backend [http://localhost:4000](http://localhost:4000) adresinde çalışacaktır.

### 4. Web Uygulamasını Başlatın

```bash
# Terminal 2 - Web App
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

**Not:** Backend çalışmıyorsa, web uygulaması direkt OpenAI API'yi kullanacaktır (OPENAI_API_KEY gerekli).

## 📁 Proje Yapısı

```
├── app/
│   ├── (studio)/           # Studio layout
│   │   ├── chat/           # AI Chat modu
│   │   ├── code/           # Code Editor modu
│   │   └── design/         # Design Studio modu
│   ├── api/                # API routes
│   ├── globals.css         # Global CSS
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Design System atomları
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Separator.tsx
│   │   ├── Tooltip.tsx
│   │   └── Toast.tsx
│   ├── chat/               # Chat bileşenleri
│   ├── code/               # Code bileşenleri
│   ├── design/             # Design bileşenleri
│   ├── shell/              # Sidebar, Topbar
│   └── providers/          # ThemeProvider
├── lib/
│   ├── types.ts            # TypeScript tip tanımları
│   ├── utils.ts            # Yardımcı fonksiyonlar
│   └── fs/                 # Virtual file system
└── README.md
```

## ⌨️ Klavye Kısayolları

| Kısayol | Açıklama |
|---------|----------|
| `Ctrl + Enter` | AI Generate / Send |
| `Ctrl + S` | Kaydet |
| `Ctrl + N` | Yeni dosya/chat |
| `Escape` | İptal / Kapat |
| `V` | Select tool (Design) |
| `R` | Rectangle tool (Design) |
| `C` | Circle tool (Design) |
| `T` | Text tool (Design) |
| `Delete` | Seçili öğeyi sil |

## 🛠️ Geliştirme

### Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

### ⚠️ Windows EPERM Hatası

Windows'ta `next build` veya `next dev` sırasında `.next/trace` dosyası kilitlenebilir. Bu durumda:

```powershell
# 1. Tüm node süreçlerini durdurun:
taskkill /F /IM node.exe

# 2. .next klasörünü silin:
Remove-Item -Recurse -Force .next

# Veya CMD'de:
rmdir /s /q .next

# 3. Tekrar başlatın:
npm run dev
# veya
npm run build
```

> **Not:** Eğer `EPERM: operation not permitted` hatası almaya devam ederseniz, Terminal/PowerShell'i yönetici olarak çalıştırın veya bilgisayarı yeniden başlatın.

## 🔧 Yapılandırma

### OpenAI Modeli Değiştirme

`app/api/chat/route.ts` dosyasında model ayarını değiştirebilirsiniz:

```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini', // veya 'gpt-4o', 'gpt-3.5-turbo'
  // ...
})
```

### Tema Özelleştirme

- **Renkler**: `app/globals.css` dosyasında CSS değişkenlerini düzenleyin
- **Components**: `components/ui/` klasöründeki dosyaları özelleştirin
- **Dark Mode**: ThemeProvider üzerinden kontrol edilir

## 🔒 Güvenlik

- API anahtarları server-side'da tutulur
- Client-side'da hassas bilgi saklanmaz
- Input validation API seviyesinde yapılır
- Rate limiting desteklenir

## 📱 Responsive Tasarım

- **Mobil**: Hamburger menü, tam ekran modlar
- **Tablet**: Adaptive layout
- **Desktop**: Yan panel ve geniş canvas

## 🚀 Production Deployment

### Vercel (Önerilen)

1. GitHub'a push edin
2. Vercel'e import edin
3. Environment variables ekleyin
4. Deploy edin

### Build Kontrol

```bash
npm run build
npm run start
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Synexa Studio** - All-in-one AI Studio 🚀
