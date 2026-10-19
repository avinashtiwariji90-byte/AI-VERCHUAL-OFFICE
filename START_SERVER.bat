@echo off
title AI Virtual Office - Local Server
color 0A
echo ===================================================
echo     AI VIRTUAL OFFICE - LOCAL SERVER LAUNCHER
echo ===================================================
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: 1. Try PHP Built-in Server (Most reliable & fast)
if exist "C:\xampp\php\php.exe" (
    set "PHP_BIN=C:\xampp\php\php.exe"
    goto :run_php
)
if exist "D:\xampp\php\php.exe" (
    set "PHP_BIN=D:\xampp\php\php.exe"
    goto :run_php
)
where php >nul 2>&1
if %errorlevel% == 0 (
    set "PHP_BIN=php"
    goto :run_php
)

:: 2. Try Python if PHP not found
where python >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Starting Python HTTP Server on port 8000...
    start "" "http://127.0.0.1:8000/index.html"
    python -m http.server 8000
    goto :end
)

:: If neither found, open directly
echo [!] PHP/Python not found. Opening directly in default browser...
start "" "%SCRIPT_DIR%index.html"
goto :end

:run_php
echo [OK] Starting PHP Server on http://127.0.0.1:8000 ...
start "" "http://127.0.0.1:8000/index.html"
"%PHP_BIN%" -S 127.0.0.1:8000 -t "%SCRIPT_DIR%"

:end
pause
