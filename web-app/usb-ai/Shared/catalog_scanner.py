#!/usr/bin/env python3
"""Read-only GOAT catalog scanner — hashes + optional ffprobe/ffmpeg fingerprints."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import subprocess
import sys
import time
from pathlib import Path

AUDIO_EXT = {
    ".wav", ".aiff", ".aif", ".flac", ".mp3", ".m4a", ".aac", ".ogg", ".wma",
}
VIDEO_EXT = {".mov", ".mp4", ".m4v", ".webm", ".mkv"}
SCAN_EXT = AUDIO_EXT | VIDEO_EXT | {".mid", ".midi", ".logicx", ".ptx", ".als", ".flp"}


def sha256_file(path: Path, chunk: int = 1024 * 1024) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        while True:
            block = fh.read(chunk)
            if not block:
                break
            h.update(block)
    return h.hexdigest()


def run_cmd(cmd: list[str], text: bool = True) -> tuple[str | bytes, str]:
    try:
        proc = subprocess.run(cmd, capture_output=True, text=text, check=False)
        out = proc.stdout.strip() if text else proc.stdout
        err = proc.stderr.strip() if proc.stderr else ""
        if isinstance(err, bytes):
            err = err.decode("utf-8", errors="replace")
        return out, err
    except Exception as exc:
        return ("" if text else b""), str(exc)


def ffprobe_meta(path: Path) -> dict:
    out, err = run_cmd([
        "ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", "-show_streams", str(path),
    ])
    if not out:
        return {"error": err or "ffprobe unavailable"}
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return {"error": "invalid ffprobe json"}


def audio_fingerprint(path: Path) -> dict:
    out, err = run_cmd([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(path),
        "-ac", "1", "-ar", "16000", "-f", "s16le", "-",
    ], text=False)
    if not out and err:
        return {"error": err}
    digest = hashlib.sha256(out).hexdigest()
    return {"audioFingerprint": digest, "method": "pcm-16k-mono-sha256"}


def scan_root(root: Path, max_files: int | None = None) -> list[dict]:
    rows: list[dict] = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for name in sorted(filenames):
            if name.startswith("."):
                continue
            path = Path(dirpath) / name
            ext = path.suffix.lower()
            if ext not in SCAN_EXT:
                continue
            stat = path.stat()
            row = {
                "path": str(path),
                "relativePath": str(path.relative_to(root)),
                "extension": ext,
                "sizeBytes": stat.st_size,
                "modifiedUtc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(stat.st_mtime)),
                "sha256": sha256_file(path),
            }
            if ext in AUDIO_EXT | VIDEO_EXT:
                row["ffprobe"] = ffprobe_meta(path)
            if ext in AUDIO_EXT:
                row.update(audio_fingerprint(path))
            rows.append(row)
            if max_files and len(rows) >= max_files:
                return rows
    return rows


def default_output_dir() -> Path:
    home = Path.home()
    candidates = [
        home / "Library/Application Support/BackupVault/Agent007-Studio/Catalog",
        home / "GOAT-FORCE/BackupVault/Agent007-Studio/Catalog",
    ]
    for candidate in candidates:
        candidate.mkdir(parents=True, exist_ok=True)
        return candidate
    out = home / "Agent007-Catalog-Scans"
    out.mkdir(parents=True, exist_ok=True)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Read-only GOAT catalog scanner")
    parser.add_argument("root", help="Owner-approved catalog folder")
    parser.add_argument("--max-files", type=int, default=0)
    parser.add_argument("--out-dir", default="")
    args = parser.parse_args()

    root = Path(args.root).expanduser().resolve()
    if not root.is_dir():
        print(f"✗ Not a directory: {root}", file=sys.stderr)
        return 1

    rows = scan_root(root, max_files=args.max_files or None)
    stamp = time.strftime("%Y%m%d-%H%M%S")
    safe = "".join(ch if ch.isalnum() else "-" for ch in root.name)[:40] or "catalog"
    out_dir = Path(args.out_dir).expanduser() if args.out_dir else default_output_dir()
    out_dir.mkdir(parents=True, exist_ok=True)

    json_path = out_dir / f"{safe}-{stamp}.json"
    csv_path = out_dir / f"{safe}-{stamp}.csv"
    manifest = {
        "scannedAtUtc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "root": str(root),
        "fileCount": len(rows),
        "files": rows,
    }
    json_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    fieldnames = ["relativePath", "extension", "sizeBytes", "sha256", "modifiedUtc"]
    with csv_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

    print(f"✓ Scanned {len(rows)} files")
    print(f"  JSON: {json_path}")
    print(f"  CSV:  {csv_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())