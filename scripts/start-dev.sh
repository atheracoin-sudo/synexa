#!/bin/bash
# iOS Development Server Start Script

echo "🔧 Starting Metro bundler for iOS development..."

# Kill any existing Metro processes on port 8081
echo "📦 Checking for existing Metro processes..."
npx kill-port 8081 2>/dev/null || echo "No existing Metro process found"

# Wait a moment for port to be released
sleep 2

# Start Expo with dev client
echo "🚀 Starting Expo dev server..."
npx expo start --dev-client --clear








