#!/usr/bin/env python3
"""
Agent-007 FKD1 Local Drawing Bridge
-------------------------------
Small offline graphics endpoint with zero third-party dependencies.
It is not a diffusion model; it is a guaranteed local graphics fallback so Agent-007
can return a real image file instead of only a text description when no image
backend is wired up.

POST /api/draw
JSON: {"prompt":"...", "outputPath":"/Volumes/FKD1/example.png", "format":"png"}
Returns: {"ok": true, "path": "...", "kind": "png"}
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import struct
import sys
import time
import zlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict, Tuple


def safe_root() -> Path:
    root = (os.environ.get("AGENT_007_IMAGE_OUTPUT_DIR")
            or os.environ.get("AGENT_007_DRIVE_OUTPUTS")
            or os.environ.get("FKD1_ROOT")
            or os.environ.get("GOAT_DATA_ROOT")
            or os.getcwd())
    return Path(root).expanduser().resolve()


def within_root(path: Path, root: Path) -> bool:
    try:
        path.resolve().relative_to(root.resolve())
        return True
    except Exception:
        return False


def color_from_prompt(prompt: str) -> Tuple[int, int, int]:
    digest = hashlib.sha256(prompt.encode("utf-8", "ignore")).digest()
    return 80 + digest[0] % 140, 80 + digest[1] % 140, 80 + digest[2] % 140


def png_chunk(kind: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)


def render_png(path: Path, prompt: str, width: int = 512, height: int = 512) -> None:
    width = max(128, min(int(width or 512), 2048))
    height = max(128, min(int(height or 512), 2048))
    accent = color_from_prompt(prompt)
    rows = []
    cx, cy = width // 2, height // 2
    radius = min(width, height) // 4
    for y in range(height):
        row = bytearray([0])
        for x in range(width):
            # dark studio gradient
            r = 12 + (x * 28 // max(1, width))
            g = 18 + (y * 32 // max(1, height))
            b = 35 + ((x + y) * 24 // max(1, width + height))
            # prompt-colored halo
            dx, dy = x - cx, y - cy
            d2 = dx * dx + dy * dy
            if d2 < (radius * 2) ** 2:
                blend = max(0, 255 - int((d2 ** 0.5) * 255 / max(1, radius * 2)))
                r = min(255, r + accent[0] * blend // 420)
                g = min(255, g + accent[1] * blend // 420)
                b = min(255, b + accent[2] * blend // 420)
            # gold goat-head circle
            if d2 < radius * radius:
                r, g, b = 220, 170, 45
            if int(radius * 0.82) ** 2 < d2 < radius * radius:
                r, g, b = 255, 225, 115
            # horns
            lx1, lx2 = cx - radius, cx - radius // 3
            rx1, rx2 = cx + radius // 3, cx + radius
            top = cy - radius - radius // 2
            mid = cy - radius // 3
            if lx1 <= x <= lx2 and top <= y <= mid and y < (-1.25 * (x - lx2) + mid):
                r, g, b = 245, 210, 125
            if rx1 <= x <= rx2 and top <= y <= mid and y < (1.25 * (x - rx1) + top):
                r, g, b = 245, 210, 125
            # face marks
            if (x - (cx - radius // 3)) ** 2 + (y - (cy - radius // 12)) ** 2 < (radius // 11) ** 2:
                r, g, b = 8, 12, 20
            if (x - (cx + radius // 3)) ** 2 + (y - (cy - radius // 12)) ** 2 < (radius // 11) ** 2:
                r, g, b = 8, 12, 20
            if abs(x - cx) < radius // 8 and abs(y - (cy + radius // 3)) < radius // 14:
                r, g, b = 8, 12, 20
            row.extend([r, g, b])
        rows.append(bytes(row))
    raw = b"".join(rows)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(png_chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)))
        f.write(png_chunk(b"IDAT", zlib.compress(raw, 9)))
        f.write(png_chunk(b"IEND", b""))


def render_svg(path: Path, prompt: str, width: int = 512, height: int = 512) -> None:
    accent = color_from_prompt(prompt)
    accent_hex = f"#{accent[0]:02x}{accent[1]:02x}{accent[2]:02x}"
    text = (prompt or "Agent-007 graphic")[:90].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#111827"/>
  <circle cx="256" cy="256" r="190" fill="{accent_hex}" opacity="0.25"/>
  <circle cx="256" cy="255" r="112" fill="#d4af37" stroke="#fff1a8" stroke-width="12"/>
  <polygon points="165,158 210,68 222,184" fill="#f5d06a"/>
  <polygon points="347,158 302,68 290,184" fill="#f5d06a"/>
  <circle cx="220" cy="245" r="13" fill="#111827"/>
  <circle cx="292" cy="245" r="13" fill="#111827"/>
  <ellipse cx="256" cy="306" rx="25" ry="15" fill="#111827"/>
  <text x="256" y="445" text-anchor="middle" fill="#f9fafb" font-family="Arial" font-size="26">OSCAR LOCAL GRAPHIC</text>
  <text x="256" y="478" text-anchor="middle" fill="#d1d5db" font-family="Arial" font-size="16">{text}</text>
</svg>'''
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg, encoding="utf-8")


class Handler(BaseHTTPRequestHandler):
    server_version = "Agent007FKD1DrawingBridge/1.0"

    def _send_json(self, status: int, data: Dict[str, Any]) -> None:
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path in ("/", "/health", "/api/health"):
            self._send_json(200, {"ok": True, "service": "Agent-007 FKD1 Local Drawing Bridge", "root": str(self.server.root)})
            return
        self._send_json(404, {"ok": False, "error": "not found"})

    def do_POST(self) -> None:  # noqa: N802
        if self.path not in ("/api/draw", "/draw", "/api/goat/image-render-bridge"):
            self._send_json(404, {"ok": False, "error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
        except Exception as exc:
            self._send_json(400, {"ok": False, "error": f"invalid json: {exc}"})
            return
        prompt = str(payload.get("prompt") or payload.get("description") or "Agent-007 local graphic")
        fmt = str(payload.get("format") or "png").lower().strip().lstrip(".")
        if fmt not in ("png", "svg"):
            fmt = "png"
        output = payload.get("outputPath") or payload.get("path") or payload.get("filename")
        if output:
            out_path = Path(str(output)).expanduser()
            if not out_path.is_absolute():
                out_path = self.server.root / out_path
        else:
            out_path = self.server.root / f"oscar-local-draw-{int(time.time())}.{fmt}"
        out_path = out_path.resolve()
        if not within_root(out_path, self.server.root):
            self._send_json(403, {"ok": False, "error": "output path must stay inside FKD1 root", "root": str(self.server.root)})
            return
        width = int(payload.get("width") or 512)
        height = int(payload.get("height") or 512)
        try:
            if fmt == "svg":
                render_svg(out_path, prompt, width, height)
            else:
                render_png(out_path, prompt, width, height)
            self._send_json(200, {"ok": True, "path": str(out_path), "kind": fmt, "offline": True, "note": "local graphics fallback; not a diffusion model"})
        except Exception as exc:
            self._send_json(500, {"ok": False, "error": str(exc)})

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))


class Server(ThreadingHTTPServer):
    root: Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default=os.environ.get("AGENT_007_DRAW_HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("AGENT_007_DRAW_PORT", "3344")))
    parser.add_argument("--root", default=str(safe_root()))
    args = parser.parse_args()
    root = Path(args.root).expanduser().resolve()
    root.mkdir(parents=True, exist_ok=True)
    httpd = Server((args.host, args.port), Handler)
    httpd.root = root
    print(f"Agent-007 FKD1 Local Drawing Bridge listening on http://{args.host}:{args.port}/api/draw")
    print(f"Output root: {root}")
    httpd.serve_forever()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
