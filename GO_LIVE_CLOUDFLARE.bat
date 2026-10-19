@echo off
title 🚀 NexusAI - GO LIVE (Cloudflare Tunnel)
color 0A
cls

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║   🌐 NEXUSAI OFFICE — CLOUDFLARE LIVE TUNNEL                ║
echo  ║      Real HTTPS Link - Mobile + PC Dono par Kaam karta hai  ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

:: ── STEP 1: Start Apache if not running ────────────────────────────────
echo  [1/3] Apache (Port 80) check kar raha hai...
netstat -ano | findstr ":80 " | findstr "LISTENING" >nul 2>&1
if %errorlevel% == 0 (
    echo  [✓] Apache pehle se chal raha hai Port 80 par!
) else (
    echo  [!] Apache band hai — shuru kar raha hai...
    start "" /B "C:\xampp\apache\bin\httpd.exe"
    timeout /t 4 /nobreak >nul
    netstat -ano | findstr ":80 " | findstr "LISTENING" >nul 2>&1
    if %errorlevel% == 0 (
        echo  [✓] Apache successfully started on Port 80!
    ) else (
        echo  [!] Apache start fail — XAMPP Control Panel se manually start karo!
        echo.
        start "" "C:\xampp\xampp-control.exe"
        echo  XAMPP khul gaya — Apache "Start" button dabao, phir yeh file dobara run karo.
        pause
        exit /b
    )
)
echo.

:: ── STEP 2: Find cloudflared ────────────────────────────────────────────
echo  [2/3] Cloudflare Tunnel tool check kar raha hai...
set CF_PATH=

:: Check current folder first
if exist "%~dp0cloudflared.exe" (
    set CF_PATH="%~dp0cloudflared.exe"
    echo  [✓] cloudflared found in project folder!
    goto :start_tunnel
)

:: Check PATH
where cloudflared >nul 2>&1
if %errorlevel% == 0 (
    set CF_PATH=cloudflared
    echo  [✓] cloudflared found in PATH!
    goto :start_tunnel
)

:: Download it
echo  [!] cloudflared nahi mila — abhi download ho raha hai (~30MB)...
echo  [!] Internet connection chahiye - 1-2 minute wait karo...
echo.
powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol='Tls12'; Invoke-WebRequest -Uri 'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe' -OutFile '%~dp0cloudflared.exe' -UseBasicParsing}" 2>nul
if exist "%~dp0cloudflared.exe" (
    set CF_PATH="%~dp0cloudflared.exe"
    echo  [✓] cloudflared download ho gaya!
) else (
    echo  [ERROR] Download fail ho gaya. Internet check karo.
    pause
    exit /b
)

:start_tunnel
echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║  [3/3] CLOUDFLARE TUNNEL SHURU HO RAHI HAI...               ║
echo  ║                                                              ║
echo  ║  📱 Real HTTPS URL neeche aayegi — aise dikhegi:             ║
echo  ║     https://word-word-word.trycloudflare.com                 ║
echo  ║                                                              ║
echo  ║  ✅ Woh URL copy karo                                         ║
echo  ║  ✅ Kisi ko bhi WhatsApp/SMS mein bhejo                       ║
echo  ║  ✅ Unke phone mein seedha khulega — koi password nahi!       ║
echo  ║                                                              ║
echo  ║  ⚠️  Yeh window BAND MAT KARO — tunnel tab tak chalti hai    ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.
echo  Office browser mein bhi khul raha hai...
start "" "http://localhost/ai-virtual-office/index.html"
echo.
echo  ════════════════════════════════════════════════════════════════
echo  TUNNEL URL (aapki live website):
echo  ════════════════════════════════════════════════════════════════
echo.

%CF_PATH% tunnel --url http://localhost:80

echo.
echo  ════════════════════════════════════════════════════════════════
echo  Tunnel band ho gayi. Dobara run karne ke liye file double-click karo.
pause
