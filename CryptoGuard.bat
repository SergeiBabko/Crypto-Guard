@echo off
chcp 65001

set "app_name=CryptoGuard"
set "app_path=CryptoGuardApp"

:run_or_install
if exist "%app_path%\node_modules" (
    echo Running %app_name%...
    node "%app_path%\app\index.mjs"
) else (
    echo Installing dependencies...
    pushd %app_path%
    call npm install --verbose
    popd
    goto run_or_install
)

pause
