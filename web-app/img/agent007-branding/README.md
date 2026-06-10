# Agent-007 — GOAT Force Branding Kit

Custom icon + promo assets for Agent-007, the GOAT Royalty Force local AI engine.

## Files

| File | Use |
|------|-----|
| `agent007-icon.svg` | Master vector icon (gold spy + goat horns + crosshair + "GOAT FORCE ISSUED") |
| `agent007-icon-minimal.svg` | Simplified icon for tiny sizes (menu bar / tray / favicon) |
| `agent007-wordmark.svg` | Horizontal "AGENT-007" wordmark logo |
| `agent007-icon-{16..1024}.png` | Rasterized icon at standard sizes |
| `agent007.ico` | Windows app icon (multi-size) |
| `agent007-wordmark.png` | Wordmark raster (1600×400) |

## Theme
- Gold gradient: `#FFD700 → #D4A03C → #B8860B`
- Dark base: `#1a1a2e → #0a0a0f`
- Fonts: Georgia (007 numerals), Arial Black (AGENT)

## Generate macOS .icns (run on a Mac)
```bash
mkdir agent007.iconset
for s in 16 32 128 256 512; do
  cp agent007-icon-$s.png agent007.iconset/icon_${s}x${s}.png
  d=$((s*2)); cp agent007-icon-$d.png agent007.iconset/icon_${s}x${s}@2x.png 2>/dev/null
done
iconutil -c icns agent007.iconset
```

## Regenerate PNGs from SVG
```bash
for s in 16 32 48 64 128 256 512 1024; do
  python3 -c "import cairosvg; cairosvg.svg2png(url='agent007-icon.svg', write_to='agent007-icon-$s.png', output_width=$s, output_height=$s)"
done
```
