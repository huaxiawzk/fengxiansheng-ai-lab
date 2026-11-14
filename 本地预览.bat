@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   本地预览：即将打开 http://localhost:8123/
echo   关闭此窗口即停止预览。
echo.
start "" "http://localhost:8123/"
python -m http.server 8123 2>nul || py -m http.server 8123
pause
