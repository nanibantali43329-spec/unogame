@echo off
echo ========================================
echo   UNO Multiplayer Game Launcher
echo ========================================
echo.

REM Check if vite is installed
if not exist "node_modules\.bin\vite.cmd" (
    echo Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo Error: Failed to install dependencies!
        echo Make sure Node.js and npm are installed.
        pause
        exit /b 1
    )
    echo.
    echo Installation complete!
    echo.
) else (
    echo Dependencies already installed.
    echo.
)

echo Starting development server...
echo.
echo The game will open automatically at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Wait 3 seconds then open browser
start /B cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"

REM Start the dev server (this keeps running)
call npm run dev
