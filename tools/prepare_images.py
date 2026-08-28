"""Convert selected, rendered game captures to lossless WebP for the portfolio.

Requires Pillow and the local sibling port checkouts. No ROMs, asset packs,
sprite sheets, emulator state or game binaries are copied into this repository.
"""
from pathlib import Path
import argparse
from PIL import Image

SITE = Path(__file__).resolve().parents[1]
PROJECTS = SITE.parent
CAPTURES = {
    "nba-live-95-court.webp": "nba-live-95-c-port/.analysis/camera-presentation-proof-20260827/port-3480.bmp",
    "nba-live-95-teams.webp": "nba-live-95-c-port/.analysis/team_select_port/settled.bmp",
    "nba-live-97-rosters.webp": "nba-live-97-c-port/.local/verification/view_rosters/diffs/team_roster_reference_native_raw.png",
    "nba-live-97-player.webp": "nba-live-97-c-port/.local/verification/view_rosters/native/player_chicago_initial.ppm",
    "nba-live-97-title.webp": "nba-live-97-c-port/.local/screens/title_original.png",
}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--normalize-previews", action="store_true", help="Normalize browser screenshot output to PNG without changing dimensions or pixels")
    args = parser.parse_args()
    if args.normalize_previews:
        previews = [SITE / "assets" / "portfolio-preview.png", *(SITE / "artifacts").glob("portfolio-*-v3.png")]
        for preview in previews:
            if preview.is_file():
                with Image.open(preview) as source:
                    frame = source.copy()
                frame.save(preview, "PNG", optimize=True)
                print(f"{preview.name}: {frame.width} x {frame.height} PNG")
        raise SystemExit(0)
    missing = [source for source in CAPTURES.values() if not (PROJECTS / source).is_file()]
    if missing:
        raise SystemExit("Missing local captures: " + ", ".join(missing))
    for target, source in CAPTURES.items():
        with Image.open(PROJECTS / source) as capture:
            capture.convert("RGB").save(SITE / "assets" / target, "WEBP", lossless=True, method=6)
            print(f"{target}: {capture.width} x {capture.height}")
