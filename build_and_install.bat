@echo off
echo ===================================================
echo   GRI Mobile - Full Build and Push to Phone (USB)
echo ===================================================
echo.

set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.20.8-hotspot
set ANDROID_HOME=C:\Users\vijay\AppData\Local\Android\Sdk

echo [1/3] Building Standalone Release APK with Gradle...
cd /d "%~dp0android"
call .\gradlew.bat assembleRelease

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed! Check errors above.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/3] Performing 16KB Page Alignment and Signing...
"%ANDROID_HOME%\build-tools\34.0.0\zipalign.exe" -f -p 16 "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0android\app\build\outputs\apk\release\app-release-16kb.apk"
call "%ANDROID_HOME%\build-tools\34.0.0\apksigner.bat" sign --ks "%~dp0android\app\debug.keystore" --ks-pass pass:android --key-pass pass:android "%~dp0android\app\build\outputs\apk\release\app-release-16kb.apk"

echo.
echo [3/3] Installing 16KB-aligned Standalone APK onto connected phone...
adb install --user 0 -r -g "%~dp0android\app\build\outputs\apk\release\app-release-16kb.apk"

if %ERRORLEVEL% EQU 0 (
    echo.
    adb shell am start -n in.ac.ruraluniv.gri/.MainActivity
    echo.
    echo SUCCESS: Standalone Release APK build and USB deployment completed!
    echo App will now launch and run 100% offline on any phone without requiring Metro!
) else (
    echo.
    echo [ERROR] Installation failed. Ensure phone is connected with USB Debugging enabled.
)

echo.
pause
