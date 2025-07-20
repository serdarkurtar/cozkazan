@echo off
echo ========================================
echo    CozKazan Server Status Check
echo ========================================
echo.
echo Checking server status...
ssh root@91.99.187.116 "pm2 status"
echo.
pause 