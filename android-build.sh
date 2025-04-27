#!/bin/bash

# Ensure we have an icon file ready
echo "Preparing app icon..."
if [ -f "app-icon.svg" ]; then
  echo "Using existing app-icon.svg as app icon"
  # Create a copy for Capacitor to use
  mkdir -p resources
  cp app-icon.svg resources/icon.svg
else
  echo "WARNING: No app-icon.svg found. Will use default Capacitor icon."
fi

# Create config directory for assets if it doesn't exist 
mkdir -p .capacitor

# Update client/index.html to use mobile.tsx instead of main.tsx
echo "Updating entry point for mobile build..."
sed -i.bak 's|src/main.tsx|src/mobile.tsx|g' client/index.html

# Build the web app with mobile configuration
echo "Building web app..."
npx vite build --config vite.mobile.config.ts

# Restore original index.html
mv client/index.html.bak client/index.html

# Add Android platform if it doesn't exist
if [ ! -d "android" ]; then
  echo "Adding Android platform to Capacitor..."
  npx cap add android
else
  echo "Android platform already exists."
fi

# Generate Android resources
echo "Generating Android resources (icons, splash screens)..."
if [ -d "resources" ]; then
  # This will generate icons and splash screens from resources/icon.svg
  npx capacitor-assets generate --iconBackgroundColor "#10b981" --splashBackgroundColor "#10b981"
fi

# Copy web assets to Android
echo "Copying web assets to Android..."
npx cap copy android

# Update Android native project
echo "Syncing Android project..."
npx cap sync android

# Print instructions for building APK
echo ""
echo "===== ANDROID BUILD INSTRUCTIONS ====="
echo "Android project is ready. To build an APK:"
echo ""
echo "1. Download the project files from Replit"
echo "2. Open the android directory in Android Studio"
echo "3. Build the APK from Android Studio or run:"
echo "   cd android && ./gradlew assembleDebug"
echo ""
echo "The debug APK will be in android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "Note: To build a signed release APK, you'll need to configure"
echo "signing keys in Android Studio or the gradle build file."
echo "======================================="