# Calorie Tracker - Android Installation Guide

This document explains how to install and use the Calorie Tracker app on your Android device.

## Building the APK

To build the Android APK for this app, follow these steps:

1. **Download the project files** from Replit (including the 'android' directory)

2. **Run the build script** (if you haven't already):
   ```
   ./android-build.sh
   ```
   This will prepare all the necessary files for the Android build.

3. **Build the APK** in one of two ways:

   a. **Using Android Studio**:
   - Open the `android` folder in Android Studio
   - Wait for the project to sync
   - Select `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - The APK will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`

   b. **Using Command Line**:
   - Navigate to the android directory
   - Run the Gradle build command:
     ```
     cd android && ./gradlew assembleDebug
     ```
   - The APK will be generated in `android/app/build/outputs/apk/debug/app-debug.apk`

## Installing on Android Device

1. **Transfer the APK** to your Android device via USB, email, or cloud storage

2. **Install the APK**:
   - Navigate to the APK file on your device
   - Tap on it to begin installation
   - If prompted about installing from unknown sources, you'll need to enable this in your device settings
   - Follow the on-screen prompts to complete installation

3. **Open the app** by finding "Calorie Tracker" in your app drawer

## App Features

- Track daily calorie intake
- Log food with support for Indian cuisine database
- Monitor water consumption
- Create custom foods
- Track macronutrients (protein, carbs, fat)
- Dark mode support
- Save and view your nutrition history

## Troubleshooting

- **App crashes on start**: Ensure your Android version is 7.0 or higher
- **Database issues**: App may take a moment to initialize on first run
- **Data not saving**: Verify you have granted storage permissions to the app

## For Developers

If you want to make changes to the app:

1. Modify the source code in the Replit project
2. Run `./android-build.sh` to rebuild the web assets
3. Run `npx cap sync android` to update the Android project
4. Rebuild the APK following the steps above

## Privacy and Data Storage

All your nutrition data is stored locally on your device. No data is sent to external servers.