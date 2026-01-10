# Expo Start with Clear Cache Script
# This script clears Expo cache and starts the development server

Write-Host "🧹 Clearing Expo cache..." -ForegroundColor Cyan
npx expo start --clear

Write-Host "`n✅ Expo development server started with cleared cache!" -ForegroundColor Green
Write-Host "📱 Make sure your backend server is running on http://192.168.1.52:4000" -ForegroundColor Yellow







