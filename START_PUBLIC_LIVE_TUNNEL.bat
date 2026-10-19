@echo off
title NexusAI Office - 1-Click Free Public Live Web Tunnel
color 0B
cls
echo ====================================================================
echo        NEXUSAI CORPORATE OFFICE - 1-CLICK FREE LIVE SERVER
echo              (Avinash Tiwari - Owner & CEO)
echo ====================================================================
echo.
echo  [INFO] This tool instantly exposes your local AI Virtual Office
echo         to the entire worldwide internet with SSL (HTTPS)!
echo         Anyone on mobile, tablet, or PC worldwide can open it.
echo.
echo  Checking active local port (Checking Port 8000 & Port 80)...
echo.

set "TARGET_PORT=8000"

:: Check if port 8000 is open
netstat -ano | findstr ":8000" >nul
if %errorlevel% == 0 (
    set "TARGET_PORT=8000"
    echo  [OK] Found Local Server running on Port 8000 (PHP/Python)!
) else (
    netstat -ano | findstr ":80" >nul
    if %errorlevel% == 0 (
        set "TARGET_PORT=80"
        echo  [OK] Found Apache Server running on Port 80 (XAMPP)!
    ) else (
        echo  [!] No active server found on port 8000 or 80.
        echo  [!] Defaulting to port 8000. Make sure START_SERVER.bat is running!
        set "TARGET_PORT=8000"
    )
)

echo.
echo ====================================================================
echo  SELECT A FREE LIVE TUNNEL PROVIDER:
echo ====================================================================
echo  [1] Localtunnel (Fast, Free, No Account Needed, Instant HTTPS URL)
echo  [2] Cloudflare Quick Tunnel (Free, Highly Secure, Edge CDN)
echo  [3] Ngrok (If you have ngrok installed)
echo ====================================================================
set /p CHOICE="Choose an option (1, 2, or 3) [Default=1]: "

if "%CHOICE%"=="2" goto :cloudflare
if "%CHOICE%"=="3" goto :ngrok

:localtunnel
echo.
echo  [OK] Starting Localtunnel on port %TARGET_PORT%...
echo  (Requires Node.js / npx - automatically installs temporarily)
echo.
npx -y localtunnel --port %TARGET_PORT%
goto :end

:cloudflare
echo.
echo  [OK] Starting Cloudflare Quick Tunnel on port %TARGET_PORT%...
where cloudflared >nul 2>&1
if %errorlevel% == 0 (
    cloudflared tunnel --url http://127.0.0.1:%TARGET_PORT%
) else (
    echo  [!] cloudflared not found in PATH. Using npx localtunnel instead...
    npx -y localtunnel --port %TARGET_PORT%
)
goto :end

:ngrok
echo.
echo  [OK] Starting ngrok on port %TARGET_PORT%...
ngrok http %TARGET_PORT%
goto :end

:end
echo.
echo Tunnel closed.
pause
