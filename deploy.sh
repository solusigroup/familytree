#!/usr/bin/env bash

# ==============================================================================
# Deployment Script untuk Shared Hosting (Tanpa Node.js / NPM)
# Project: Bani Ali Dahlan / Family Tree
# ==============================================================================
# Skenario:
# - Server shared hosting TIDAK memiliki Node.js / NPM.
# - Frontend assets (Vite / React) di-build di komputer LOKAL terlebih dahulu:
#     1. npm run build
#     2. git add public/build
#     3. git commit -m "build: update compiled assets"
#     4. git push origin main
# - Script ini dijalankan di server shared hosting (via SSH, cPanel Terminal, atau Cron)
# ==============================================================================

set -e

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}  🚀 Starting Deployment (Shared Hosting Mode)     ${NC}"
echo -e "${BLUE}====================================================${NC}"

# 1. Pastikan berada di root direktori project
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

if [ ! -f "artisan" ]; then
    echo -e "${RED}❌ Error: File 'artisan' tidak ditemukan di $PROJECT_DIR.${NC}"
    echo -e "${RED}Pastikan script dijalankan di folder root project Laravel!${NC}"
    exit 1
fi

# 2. Deteksi PHP Binary (Laravel 12 membutuhkan PHP >= 8.3)
detect_php() {
    if [ -n "$PHP_BIN" ] && [ -x "$PHP_BIN" ]; then
        echo "$PHP_BIN"
        return
    fi

    # Daftar path PHP yang umum di cPanel / Shared Hosting (prioritaskan 8.4 lalu 8.3)
    local CANDIDATES=(
        "/usr/local/bin/ea-php84"
        "/opt/cpanel/ea-php84/root/usr/bin/php"
        "/opt/alt/php84/usr/bin/php"
        "/usr/bin/php8.4"
        "/usr/local/bin/ea-php83"
        "/opt/cpanel/ea-php83/root/usr/bin/php"
        "/opt/alt/php83/usr/bin/php"
        "/usr/bin/php8.3"
        "/usr/local/php83/bin/php"
        "/usr/local/lsws/lsphp83/bin/lsphp"
        "php"
    )

    for path in "${CANDIDATES[@]}"; do
        if command -v "$path" >/dev/null 2>&1; then
            local ver
            ver=$("$path" -r 'echo PHP_VERSION_ID;' 2>/dev/null || echo "0")
            if [ "$ver" -ge 80300 ]; then
                echo "$path"
                return
            fi
        fi
    done

    # Fallback default php
    echo "php"
}

PHP_CMD=$(detect_php)
PHP_VERSION=$($PHP_CMD -r 'echo PHP_VERSION;' 2>/dev/null || echo "Unknown")
echo -e "${GREEN}✓ PHP terdeteksi:${NC} $PHP_CMD (v$PHP_VERSION)"

# 3. Aktifkan Maintenance Mode
echo -e "\n${YELLOW}🔒 Mengaktifkan Maintenance Mode...${NC}"
$PHP_CMD artisan down --retry=60 || true

# Trap error: jika gagal di tengah jalan, pastikan aplikasi tetap dinaikkan kembali
cleanup_on_error() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo -e "\n${RED}❌ Deployment gagal pada baris $1!${NC}"
        echo -e "${YELLOW}🔓 Memulihkan aplikasi (artisan up)...${NC}"
        $PHP_CMD artisan up || true
    fi
    exit $exit_code
}
trap 'cleanup_on_error $LINENO' ERR

# 4. Tarik update terbaru dari Git
BRANCH="${DEPLOY_BRANCH:-main}"
echo -e "\n${YELLOW}📥 Menarik update dari Git (origin/$BRANCH)...${NC}"
git fetch origin "$BRANCH"
git pull origin "$BRANCH"

# 5. Verifikasi Aset Frontend (karena shared hosting tidak ada Node.js)
echo -e "\n${YELLOW}🔍 Memeriksa aset frontend Vite (public/build)...${NC}"
# Pastikan file public/hot terhapus agar Laravel membaca manifest production
rm -f public/hot

if [ -f "public/build/manifest.json" ]; then
    echo -e "${GREEN}✓ public/build/manifest.json ditemukan.${NC} (Aset ter-compile sudah ada)"
else
    echo -e "${RED}⚠️ PERINGATAN: 'public/build/manifest.json' tidak ditemukan!${NC}"
    echo -e "${YELLOW}Karena server shared hosting tidak mendukung Node.js, silakan:${NC}"
    echo -e "   1. Di komputer lokal, jalankan: ${BLUE}npm run build${NC}"
    echo -e "   2. Commit & push: ${BLUE}git add public/build && git commit -m \"build assets\" && git push${NC}"
    echo -e "   3. Jalankan kembali script deploy ini di server.${NC}"
fi

# 6. Composer Dependencies (jika composer tersedia)
echo -e "\n${YELLOW}📦 Memeriksa Composer dependencies...${NC}"
if command -v composer >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Menjalankan composer install...${NC}"
    $PHP_CMD $(command -v composer) install --no-dev --prefer-dist --optimize-autoloader --no-interaction
elif [ -f "composer.phar" ]; then
    echo -e "${GREEN}✓ Menjalankan composer.phar install...${NC}"
    $PHP_CMD composer.phar install --no-dev --prefer-dist --optimize-autoloader --no-interaction
elif [ -d "vendor" ] && [ -f "vendor/autoload.php" ]; then
    echo -e "${GREEN}✓ Folder 'vendor' sudah tersedia dari repository (composer install dilewati).${NC}"
else
    echo -e "${YELLOW}⚠️ Composer tidak ditemukan dan folder vendor belum lengkap.${NC}"
fi

# 7. Database Migration
echo -e "\n${YELLOW}🗄️ Menjalankan Database Migrations...${NC}"
$PHP_CMD artisan migrate --force

# 8. Storage Link
echo -e "\n${YELLOW}🔗 Memeriksa Storage Symlink...${NC}"
$PHP_CMD artisan storage:link || true

# 9. Optimasi Cache Laravel
echo -e "\n${YELLOW}⚡ Mengoptimalkan Cache (Config, Route, View)...${NC}"
$PHP_CMD artisan optimize:clear
$PHP_CMD artisan optimize
$PHP_CMD artisan view:cache

# 10. Penyesuaian Permission Folder
echo -e "\n${YELLOW}🔑 Menyesuaikan permission direktori storage dan cache...${NC}"
chmod -R 775 storage bootstrap/cache 2>/dev/null || chmod -R 755 storage bootstrap/cache 2>/dev/null || true

# 11. Matikan Maintenance Mode
echo -e "\n${GREEN}🔓 Menonaktifkan Maintenance Mode (Aplikasi Online)...${NC}"
$PHP_CMD artisan up

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  🎉 DEPLOYMENT BERHASIL!                           ${NC}"
echo -e "${GREEN}====================================================${NC}"
