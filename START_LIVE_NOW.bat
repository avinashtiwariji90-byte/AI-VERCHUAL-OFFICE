@echo off
title 🚀 NexusAI - Go Live NOW! (PHP + Tunnel)
color 0B
cls

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║       🌐 NEXUSAI OFFICE — 1-CLICK GO LIVE SYSTEM            ║
echo  ║          Avinash Tiwari (Owner ^& CEO)                        ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo  [STEP 1] PHP Built-in Server start ho raha hai (Port 8000)...
echo.

:: Kill any existing PHP on 8000 first
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: Start PHP server in background
start "" /B "C:\xampp\php\php.exe" -S 127.0.0.1:8000 -t "C:\xampp\htdocs\ai-virtual-office" > "%~dp0server.log" 2>&1

:: Wait for PHP to start
timeout /t 2 /nobreak >nul

:: Verify PHP is running
netstat -ano | findstr ":8000" >nul
if %errorlevel% == 0 (
    echo  [✓] PHP Server STARTED on http://127.0.0.1:8000
) else (
    echo  [!] PHP Server start nahin hua. Checking XAMPP...
    "C:\xampp\php\php.exe" -S 127.0.0.1:8000 -t "C:\xampp\htdocs\ai-virtual-office" > "%~dp0server.log" 2>&1 &
    timeout /t 3 /nobreak >nul
)

echo.
echo  [STEP 2] Node.js / npx check...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  [!] Node.js nahin mila! Please install from: https://nodejs.org
    echo.
    echo  [INFO] Abhi bhi browser se access kar sakte ho:
    echo         http://127.0.0.1:8000/index.html
    echo.
    start "" "http://127.0.0.1:8000/index.html"
    pause
    exit /b
)

echo  [✓] Node.js found!
echo.

:: Check if localtunnel is available
where lt >nul 2>&1
if %errorlevel% == 0 (
    echo  [✓] localtunnel (lt) globally installed!
    set LT_CMD=lt --port 8000
) else (
    echo  [INFO] Using npx localtunnel (auto-install karein ga pehli baar)...
    set LT_CMD=npx -y localtunnel --port 8000
)

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║  [STEP 3] LOCALTUNNEL SHURU HO RAHA HAI...                  ║
echo  ║                                                              ║
echo  ║  ✅ Browser AUTOMATICALLY khul jayega:                       ║
echo  ║     http://127.0.0.1:8000/index.html                        ║
echo  ║                                                              ║
echo  ║  📋 Tunnel URL neeche dikhegi (https://xxxx.loca.lt)        ║
echo  ║     URL copy karo → Office mein "Set Live!" dabao           ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

:: Open browser automatically
start "" "http://127.0.0.1:8000/index.html"
timeout /t 1 /nobreak >nul

echo  ⏳ Localtunnel URL aa rahi hai... (30-60 seconds lag sakti hai)
echo  ─────────────────────────────────────────────────────────────────
echo.

:: Start localtunnel - URL will appear in this window
%LT_CMD%

echo.
echo  ─────────────────────────────────────────────────────────────────
echo  Tunnel band ho gaya.
pause
