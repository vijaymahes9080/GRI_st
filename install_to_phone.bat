@echo off
echo ===================================================
echo   GRI Mobile - Push APK to Connected Phone (USB)
echo ===================================================
echo.

set ANDROID_HOME=C:\Users\vijay\AppData\Local\Android\Sdk

echo [1/4] Setting up USB reverse port forwarding (8081)...
adb reverse tcp:8081 tcp:8081
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] ADB reverse failed. Please check USB connection and unlock your phone.
)

echo.
echo [2/4] Aligning and Signing APK for 16KB Page Size (ELF Check)...
"%ANDROID_HOME%\build-tools\34.0.0\zipalign.exe" -f -p 16 "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%~dp0android\app\build\outputs\apk\debug\app-debug-16kb.apk"
call "%ANDROID_HOME%\build-tools\34.0.0\apksigner.bat" sign --ks "%~dp0android\app\debug.keystore" --ks-pass pass:android --key-pass pass:android "%~dp0android\app\build\outputs\apk\debug\app-debug-16kb.apk"

echo.
echo [3/4] Installing 16KB-aligned APK onto connected Android phone...
adb install -r "%~dp0android\app\build\outputs\apk\debug\app-debug-16kb.apk"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [4/4] Starting Metro bundler server and launching GRI Mobile App...
    start "GRI Metro Bundler" cmd /k "npx expo start --localhost"
    ping 127.0.0.1 -n 4 > nul
    adb shell monkey -p in.ac.ruraluniv.gri -c android.intent.category.LAUNCHER 1 > nul 2>&1
    echo.
    echo SUCCESS: Application installed! 
    echo TIP: If phone shows "Unable to load script", wait 3 seconds for Metro bundler to finish loading and tap "RELOAD" on your phone.
) else (
    echo.
    echo [ERROR] Installation failed. Ensure phone is unlocked and USB Debugging is enabled.
)

echo.
pause
