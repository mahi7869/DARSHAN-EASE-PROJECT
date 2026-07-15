@echo off
setlocal enabledelayedexpansion
title DarshanEase - Automated Setup

echo =========================================
echo    DarshanEase - Automated Setup Script
echo =========================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js v16+ first.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm is not installed. Please install npm first.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
for /f "tokens=*" %%v in ('npm -v') do set NPM_VERSION=%%v
echo Node version: %NODE_VERSION%
echo npm version: %NPM_VERSION%

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%backend
set FRONTEND_DIR=%ROOT_DIR%frontend

REM ---------- Backend Setup ----------
echo.
echo Step 1: Installing backend dependencies...
cd /d "%BACKEND_DIR%"
call npm install

if not exist ".env" (
    echo Creating backend .env from .env.example...
    copy .env.example .env >nul
    echo Created backend\.env - edit it if you need a custom MongoDB URI.
) else (
    echo backend\.env already exists, skipping.
)

echo.
echo Step 2: Make sure MongoDB is running locally, or your Atlas URI in .env is correct.
pause

echo.
echo Step 3: Seeding sample temples, slots, and admin user...
call npm run seed

echo.
echo Step 4: Starting backend server in a new window (http://localhost:5000)...
start "DarshanEase Backend" cmd /k "cd /d %BACKEND_DIR% && npm run dev"

timeout /t 5 /nobreak >nul

REM ---------- Frontend Setup ----------
echo.
echo Step 5: Installing frontend dependencies...
cd /d "%FRONTEND_DIR%"
call npm install

if not exist ".env" (
    echo Creating frontend .env from .env.example...
    copy .env.example .env >nul
) else (
    echo frontend\.env already exists, skipping.
)

echo.
echo =========================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo  Admin login: admin@darshanease.com / Admin@123
echo =========================================
echo.
echo Step 6: Starting frontend (http://localhost:3000)...
call npm start

endlocal
