@echo off
title Vibhath 3D Portfolio Dev Server
echo ========================================================
echo   LAUNCHING VIBHATH'S IMMERSIVE 3D WEBGL PORTFOLIO
echo ========================================================
echo.

:: Step 1: Verify Node/NPM installation
echo [1/4] Verifying Node.js and NPM installation...
where npm >nul 2>nul
if %errorlevel% neq 0 goto :no_npm
echo Node.js/NPM detected.

:: Step 2: Navigate to directory
cd /d "%~dp0"

:: Step 3: Start Vite Dev Server in the background of this terminal
echo [2/4] Starting local development server...
start /b cmd /c "npm run dev"

:: Step 4: Poll Port 3050 to wait for initialization
echo [3/4] Waiting for server to initialize on port 3050...
set /a attempt=0
:loop
set /a attempt+=1
if %attempt% gtr 15 goto :timeout_error

:: Use powershell to check if port 3050 is listening
powershell -Command "try { $t = New-Object System.Net.Sockets.TcpClient('127.0.0.1', 3050); $t.Close(); exit 0 } catch { exit 1 }" >nul 2>nul
if %errorlevel% neq 0 (
    ping 127.0.0.1 -n 2 > nul
    goto loop
)

:: Step 5: Launch the web browser
echo [4/4] Server detected! Opening browser uplink...
start http://localhost:3050

echo.
echo ========================================================
echo   PORTFOLIO SERVER ACTIVE AT http://localhost:3050
echo ========================================================
echo.
echo   [KEEP THIS WINDOW OPEN] to keep the portfolio running.
echo   Press [Ctrl+C] or close this window to stop the server.
echo.

:: Keep script running to host the background server process
:wait_loop
ping 127.0.0.1 -n 10 > nul
goto wait_loop


:no_npm
echo.
echo ========================================================
echo ERROR: Node.js and NPM were not found!
echo Please install Node.js (LTS version recommended)
echo from https://nodejs.org/ and try again.
echo ========================================================
echo.
pause
exit /b 1


:timeout_error
echo.
echo ========================================================
echo ERROR: Dev server failed to start within 15 seconds.
echo Please check if port 3050 is already in use.
echo ========================================================
echo.
pause
exit /b 1
