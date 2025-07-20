@echo off
echo ========================================
echo    CozKazan Server Restart
echo ========================================
echo.
echo Restarting server...
ssh root@91.99.187.116 "pm2 restart cozkazan-backend"
echo.
echo Server restarted!
pause 