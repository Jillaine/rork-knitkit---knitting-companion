@echo off
REM Ensure dist exists
if not exist dist mkdir dist
if not exist dist\icons mkdir dist\icons

REM Copy manifest + icons + service worker (adjust paths if needed)
copy /Y web\manifest.json dist\manifest.json
copy /Y web\icons\icon-192.png dist\icons\icon-192.png
copy /Y web\icons\icon-512.png dist\icons\icon-512.png
copy /Y web\sw.js dist\sw.js

REM Optional (iOS)
if exist web\apple-touch-icon.png copy /Y web\apple-touch-icon.png dist\apple-touch-icon.png

echo PWA assets copied into dist
