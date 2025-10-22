@echo off
echo ========================================
echo   Deploying UNO Game to GitHub
echo ========================================
echo.

REM Set Git path
set "GIT_PATH=C:\Program Files\Git\cmd\git.exe"

REM Check if Git exists
if not exist "%GIT_PATH%" (
    echo Looking for Git in alternate location...
    set "GIT_PATH=C:\Program Files (x86)\Git\cmd\git.exe"
)

if not exist "%GIT_PATH%" (
    echo Git not found! Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Git found at: %GIT_PATH%
echo.

REM Initialize git repository
echo Initializing Git repository...
"%GIT_PATH%" init

REM Configure Git user (required for commits)
echo Configuring Git user...
"%GIT_PATH%" config user.email "player@unogame.com"
"%GIT_PATH%" config user.name "UNO Player"

REM Add all files
echo Adding files...
"%GIT_PATH%" add .

REM Create commit
echo Creating commit...
"%GIT_PATH%" commit -m "Deploy UNO multiplayer game"

REM Add remote
echo Setting up remote repository...
"%GIT_PATH%" remote remove origin 2>nul
"%GIT_PATH%" remote add origin https://github.com/nanibantali43329-spec/unogame.git

REM Set branch to main
echo Setting branch to main...
"%GIT_PATH%" branch -M main

REM Push to GitHub
echo Pushing to GitHub...
"%GIT_PATH%" push -u origin main --force

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Your site will be available at:
echo https://nanibantali43329-spec.github.io/unogame/
echo.
echo Go to Settings -^> Pages and set Source to "GitHub Actions"
echo.

pause
