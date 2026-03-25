#!/bin/bash
# ==============================================================================
# SUPER GOAT ROYALTIES - Master Build Script for Desktop Installers
# ==============================================================================
# Creates production-ready installers for Windows, macOS, and Linux
# Run on Linux with: ./build-installers.sh [platform]
# Platforms: all, win, mac, linux, portable
# ==============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="SUPER GOAT Royalties"
APP_VERSION=$(node -p "require('./package.json').version")
BUILD_DIR="dist"
BUILD_DATE=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="build-log-${BUILD_DATE}.txt"

# ==============================================================================
# UTILITY FUNCTIONS
# ==============================================================================

log() {
    echo -e "${CYAN}[BUILD]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 is not installed. Please install it first."
        return 1
    fi
    return 0
}

# ==============================================================================
# PREREQUISITE CHECKS
# ==============================================================================

check_prerequisites() {
    log "Checking build prerequisites..."
    
    local missing=0
    
    # Check Node.js
    if check_command node; then
        log "  ✓ Node.js $(node --version)"
    else
        missing=1
    fi
    
    # Check npm
    if check_command npm; then
        log "  ✓ npm $(npm --version)"
    else
        missing=1
    fi
    
    # Check for ImageMagick (for icon conversion)
    if check_command convert; then
        log "  ✓ ImageMagick installed"
        HAS_IMAGEMAGICK=true
    else
        log_warning "  ImageMagick not found - will attempt alternative icon generation"
        HAS_IMAGEMAGICK=false
    fi
    
    # Check for Wine (for Windows builds on Linux)
    if check_command wine; then
        log "  ✓ Wine installed (Windows builds enabled)"
        HAS_WINE=true
    else
        log_warning "  Wine not found - Windows builds may be limited"
        HAS_WINE=false
    fi
    
    if [ $missing -eq 1 ]; then
        log_error "Missing required prerequisites. Please install them and try again."
        exit 1
    fi
    
    log_success "All prerequisites checked!"
}

# ==============================================================================
# ICON GENERATION
# ==============================================================================

generate_icons() {
    log "Generating platform-specific icons..."
    
    mkdir -p build/icons
    
    # Generate PNG icons from ICO (for Linux)
    if [ "$HAS_IMAGEMAGICK" = true ]; then
        log "  Generating PNG icons from ICO..."
        
        # Generate multiple sizes for Linux
        convert build/icon.ico build/icon.png 2>/dev/null || true
        
        # Generate specific sizes
        for size in 16 32 48 64 128 256 512; do
            convert build/icon.ico -resize ${size}x${size} build/icons/icon-${size}.png 2>/dev/null || true
        done
        
        # Create main icon.png (256x256)
        convert build/icon.ico -resize 256x256 build/icon.png 2>/dev/null || true
        
        log_success "  PNG icons generated!"
        
        # Generate ICNS for macOS (requires png2icns or icnsutil)
        log "  Attempting ICNS generation for macOS..."
        
        # Create iconset directory
        mkdir -p build/icon.iconset
        
        # Generate all required sizes for icns
        for size in 16 32 64 128 256 512; do
            if [ -f "build/icons/icon-${size}.png" ]; then
                cp build/icons/icon-${size}.png build/icon.iconset/icon_${size}x${size}.png
            fi
        done
        
        # Generate @2x versions
        for size in 16 32 64 128 256; do
            double=$((size * 2))
            if [ -f "build/icons/icon-${double}.png" ]; then
                cp build/icons/icon-${double}.png build/icon.iconset/icon_${size}x${size}@2x.png
            fi
        done
        
        # Try to create ICNS (macOS only tool, may not work on Linux)
        if command -v iconutil &> /dev/null; then
            iconutil -c icns build/icon.iconset -o build/icon.icns
            log_success "  ICNS icon generated!"
        else
            log_warning "  iconutil not available (macOS only). Using PNG fallback for macOS builds."
            # For Linux builds, electron-builder will use PNG
        fi
    else
        log_warning "  ImageMagick not available. Using existing icons."
    fi
    
    # Verify we have at least one icon format
    if [ ! -f "build/icon.ico" ] && [ ! -f "build/icon.png" ]; then
        log_error "No icons available! Build may fail."
        exit 1
    fi
    
    log_success "Icon generation complete!"
}

# ==============================================================================
# DEPENDENCY INSTALLATION
# ==============================================================================

install_dependencies() {
    log "Installing dependencies..."
    
    # Install production dependencies
    npm install --production 2>&1 | tee -a "$LOG_FILE"
    
    # Ensure electron-builder is available
    if ! npm list electron-builder &> /dev/null; then
        log "Installing electron-builder..."
        npm install --save-dev electron-builder@latest 2>&1 | tee -a "$LOG_FILE"
    fi
    
    log_success "Dependencies installed!"
}

# ==============================================================================
# BUILD FUNCTIONS
# ==============================================================================

build_linux() {
    log "=========================================="
    log "Building LINUX packages..."
    log "=========================================="
    
    log "  Creating AppImage..."
    npm run electron:build:linux -- --x64 2>&1 | tee -a "$LOG_FILE"
    
    # List generated files
    if [ -d "$BUILD_DIR" ]; then
        log_success "Linux build complete! Generated files:"
        ls -lh dist/*.AppImage 2>/dev/null | tee -a "$LOG_FILE" || true
        ls -lh dist/*.deb 2>/dev/null | tee -a "$LOG_FILE" || true
    fi
}

build_windows() {
    log "=========================================="
    log "Building WINDOWS packages..."
    log "=========================================="
    
    log "  Creating NSIS installer and Portable..."
    
    # Build for Windows (may require Wine on Linux)
    npm run electron:build:win -- --x64 2>&1 | tee -a "$LOG_FILE"
    
    # List generated files
    if [ -d "$BUILD_DIR" ]; then
        log_success "Windows build complete! Generated files:"
        ls -lh dist/*.exe 2>/dev/null | tee -a "$LOG_FILE" || true
    fi
}

build_macos() {
    log "=========================================="
    log "Building macOS packages..."
    log "=========================================="
    
    log_warning "macOS builds from Linux have limitations."
    log "  Creating DMG (unsigned)..."
    
    # Build for macOS
    npm run electron:build:mac -- --x64 --arm64 2>&1 | tee -a "$LOG_FILE"
    
    # List generated files
    if [ -d "$BUILD_DIR" ]; then
        log_success "macOS build complete! Generated files:"
        ls -lh dist/*.dmg 2>/dev/null | tee -a "$LOG_FILE" || true
    fi
}

build_portable() {
    log "=========================================="
    log "Building PORTABLE version..."
    log "=========================================="
    
    # Build portable for all platforms
    log "  Creating Windows Portable..."
    npm run electron:build:win -- --x64 --config.win.target=portable 2>&1 | tee -a "$LOG_FILE"
    
    # Linux portable is the AppImage
    log "  Creating Linux AppImage (portable)..."
    npm run electron:build:linux -- --x64 --config.linux.target=AppImage 2>&1 | tee -a "$LOG_FILE"
    
    log_success "Portable builds complete!"
}

build_all() {
    log "=========================================="
    log "Building ALL platforms..."
    log "=========================================="
    
    build_linux
    build_windows
    build_macos
    
    log_success "All builds complete!"
}

# ==============================================================================
# BUILD SUMMARY
# ==============================================================================

show_summary() {
    log "=========================================="
    log "BUILD SUMMARY"
    log "=========================================="
    
    echo ""
    echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}           ${GREEN}SUPER GOAT ROYALTIES${NC} - Build Results           ${PURPLE}║${NC}"
    echo -e "${PURPLE}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${PURPLE}║${NC}  Version: $APP_VERSION                                        ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}  Build Date: $BUILD_DATE                            ${PURPLE}║${NC}"
    echo -e "${PURPLE}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${PURPLE}║${NC}  Generated Installers:                                      ${PURPLE}║${NC}"
    echo -e "${PURPLE}╠════════════════════════════════════════════════════════════╣${NC}"
    
    if [ -d "$BUILD_DIR" ]; then
        for file in dist/*.*; do
            if [ -f "$file" ]; then
                size=$(du -h "$file" | cut -f1)
                name=$(basename "$file")
                printf "${PURPLE}║${NC}  %-50s %6s ${PURPLE}║${NC}\n" "$name" "$size"
            fi
        done
    fi
    
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log "Build log saved to: $LOG_FILE"
    log "Output directory: $BUILD_DIR/"
}

# ==============================================================================
# CLEAN BUILD
# ==============================================================================

clean_build() {
    log "Cleaning previous builds..."
    rm -rf dist/ 2>/dev/null || true
    rm -f build-log-*.txt 2>/dev/null || true
    log_success "Clean complete!"
}

# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

main() {
    echo ""
    echo -e "${PURPLE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC}      ${GREEN}SUPER GOAT ROYALTIES${NC} - Installer Build System      ${PURPLE}║${NC}"
    echo -e "${PURPLE}║${NC}                    Version: $APP_VERSION                         ${PURPLE}║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Parse arguments
    PLATFORM=${1:-all}
    
    case "$PLATFORM" in
        all)
            clean_build
            check_prerequisites
            generate_icons
            install_dependencies
            build_all
            ;;
        win|windows)
            clean_build
            check_prerequisites
            generate_icons
            install_dependencies
            build_windows
            ;;
        mac|macos|darwin)
            clean_build
            check_prerequisites
            generate_icons
            install_dependencies
            build_macos
            ;;
        linux)
            clean_build
            check_prerequisites
            generate_icons
            install_dependencies
            build_linux
            ;;
        portable)
            clean_build
            check_prerequisites
            generate_icons
            install_dependencies
            build_portable
            ;;
        clean)
            clean_build
            exit 0
            ;;
        *)
            echo "Usage: $0 [platform]"
            echo "Platforms: all, win, mac, linux, portable, clean"
            exit 1
            ;;
    esac
    
    show_summary
}

# Run main function
main "$@"