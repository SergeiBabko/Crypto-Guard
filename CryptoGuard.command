#!/bin/bash

app_name="CryptoGuard"
app_path="CryptoGuardApp"

run_or_install() {
    if [ -d "$app_path/node_modules" ]; then
        echo "Running $app_name..."
        node "$app_path/app/index.mjs"
    else
        echo "Installing dependencies..."
        pushd "$app_path" || exit
        npm install --verbose
        popd || exit
        run_or_install
    fi
}

run_or_install

read -rp "Press any key to continue..."
