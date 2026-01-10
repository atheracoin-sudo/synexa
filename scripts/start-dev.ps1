# iOS Development Server Start Script (PowerShell)

Write-Host "🔧 Starting Metro bundler for iOS development..." -ForegroundColor Cyan

# Kill any existing Metro processes on port 8081
Write-Host "📦 Checking for existing Metro processes..." -ForegroundColor Yellow
$port = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "Killing process on port 8081..." -ForegroundColor Yellow
    Stop-Process -Id $port.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
} else {
    Write-Host "No existing Metro process found" -ForegroundColor Green
}

# Start Expo with dev client
Write-Host "🚀 Starting Expo dev server..." -ForegroundColor Cyan
npx expo start --dev-client --clear








