@echo off
echo ========================================
echo    CozKazan Admin Panel Logs
echo ========================================
echo.
echo Getting admin panel logs...
ssh root@91.99.187.116 "pm2 logs cozkazan-backend --lines 10"
echo.
pause 