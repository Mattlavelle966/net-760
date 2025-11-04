#!/usr/bin/env bash
# ------------------------------------------------------------------
# net-760 project sync script
# Copies the current live configuration and sites into this repo.
# ------------------------------------------------------------------

set -e

# Base destination (repo root)
DEST_DIR=~/repos/net-760

echo "[+] Syncing project files into $DEST_DIR"

# --- Backend (Express + llama.cpp API) ---
echo "→ Copying backend..."
mkdir -p "$DEST_DIR/backend"
# Clean out the old backend copy
rm -rf "$DEST_DIR/backend"/*

# Copy directly from the running container
docker cp pod-760:/llama.cpp/api/. "$DEST_DIR/backend/" || {
    echo "⚠️  Failed to copy from pod-760 — is the container running?"
    exit 1
}

# --- NGINX config ---
echo "→ Copying NGINX config..."
mkdir -p "$DEST_DIR/nginx"
cp /srv/nginx-proxy/conf/nginx.conf "$DEST_DIR/nginx/nginx.conf"

# --- Static sites ---
echo "→ Copying sites..."
mkdir -p "$DEST_DIR/sites"
rsync -a --delete /srv/sites/site1/ "$DEST_DIR/sites/site1/"
rsync -a --delete /srv/sites/site2/ "$DEST_DIR/sites/site2/"

# --- Clean unneeded stuff (optional) ---
echo "→ Cleaning transient files..."
rm -rf "$DEST_DIR/backend/node_modules" || true
rm -f "$DEST_DIR/backend/package-lock.json" || true

echo "[✓] Sync complete!"

