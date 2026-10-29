@echo off
:: Check for administrative rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~fn0' -Verb RunAs"
    exit /b
)

echo ===================================================
echo Disabling Jenkins Login and Restarting Service...
echo ===================================================

powershell -Command "(Get-Content 'C:\ProgramData\Jenkins\.jenkins\config.xml') -replace '<useSecurity>true</useSecurity>', '<useSecurity>false</useSecurity>' | Set-Content 'C:\ProgramData\Jenkins\.jenkins\config.xml'"

echo.
echo Restarting Jenkins service...
net stop Jenkins
net start Jenkins

echo.
echo ===================================================
echo SUCCESS! Jenkins login requirement is now DISABLED.
echo You will NOT be asked for any username or password.
echo.
echo Now open in your browser:
echo http://localhost:8080/job/Pipeline%%20script/
echo ===================================================
pause
