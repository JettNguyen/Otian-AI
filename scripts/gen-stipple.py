#!/usr/bin/env python3
"""Draw the homepage sky's clouds into assets/ as masks of dots: a bank that tiles, and one high cloud.

WHY STIPPLE. On 2026-10-05 Jack picked trajectory.ai as one of three sites to borrow from, and the
thing that site owns is a texture: every cloud on it is drawn in dots. The homepage already runs one
day, with a clock on each act (7:00 pm, 9:12 am, 1:40 pm, 4:15 pm, 2:00 am, 7:00 am), so the sky's
clouds take their colour from that clock: dusk is peach over lavender, the small hours are moonlit
grey, the morning is gold. The colour is CSS and js/home.js; this script only says where the dots go.

WHY OBJECTS AND NOT ONE PICTURE. The first version drew the whole sky as one stage-sized image, and
Jett's first look found both of its faults on the same day: covering a wide window cropped the image
from the top, so the high cloud left the screen, and a picture of a sky "feels a bit too stagnant".
So the bank is a strip that repeats sideways without a seam, which the stylesheet slides along
forever, and the high cloud is one small image the stylesheet places and drifts as often as it likes.

WHY TWO MASKS PER SHAPE. A cloud is lit from above and shaded underneath, so every dot is drawn into
one of two masks by how high it sits in its cloud. Each mask is painted one flat colour by the
stylesheet (`.day-stipple`), so the same dots can be any hour of the day without another file.

WHY 1-BIT. The dots are on or off, so each mask is a two-entry palette PNG with the first entry
transparent, drawn at twice the size it is shown. Anti-aliased dots in an alpha channel came to six
times the bytes and looked no different once the browser scaled them.

Deterministic: fixed seeds, so a rerun writes the same bytes and a diff means the shapes changed.

Usage:
  python3 scripts/gen-stipple.py            rewrite the masks
  python3 scripts/gen-stipple.py --check    exit 1 if the committed masks differ from a fresh draw
"""

import io
import math
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
X2 = 2            # drawn at twice the CSS size it is shown at
STEP, R = 2.5, 1.0  # in CSS pixels: a jittered grid of cells, a dot of about this radius per filled cell

# THE SIZES THE STYLESHEET ASSUMES. `.day-bank` tiles the bank mask at 1440 by 210 and slides it by
# exactly one tile, and `.day-cloud` keeps the cloud's 360 by 110 shape. Change one here, change it there.
BANK_W, BANK_H = 1440, 210
CLOUD_W, CLOUD_H = 360, 110


def smooth(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def bank_puffs():
    """Two rows of puffs across one tile, in CSS pixels, with tops between about 70 and 150 above
    the foot. Placed on a circle of the tile's width, so the strip has no seam where it repeats."""
    rnd = random.Random(3)
    puffs, x = [], 0.0
    while x < BANK_W:
        r = 44 + rnd.random() * 38
        top = 62 + rnd.random() * 78
        puffs.append((x, top + r, r))
        puffs.append((x + r * 0.7, top + r * 1.9, r * 1.3))
        x += r * 1.25
    return puffs


def cloud_puffs():
    """One high cloud in CSS pixels: a crown of big puffs over a row of small ones, cut flat along
    CLOUD_BASE so it has the level underside a fair-weather cloud has."""
    return [(70, 80, 22), (100, 66, 32), (140, 52, 40), (185, 48, 44), (228, 58, 36), (262, 72, 26),
            (292, 82, 16), (120, 82, 26), (165, 80, 30), (210, 82, 28), (245, 84, 22)]


CLOUD_BASE = 92


def draw(w, h, puffs, base, wrap, seed, dense):
    top = min(cy - r for _, cy, r in puffs)
    foot = min(base, h)
    rnd = random.Random(seed)
    masks = {k: Image.new("P", (w * X2, h * X2), 0) for k in ("lit", "shade")}
    pens = {k: ImageDraw.Draw(m) for k, m in masks.items()}
    gy = 0.0
    while gy < h:
        gx = 0.0
        while gx < w:
            x, y = gx + rnd.random() * STEP, gy + rnd.random() * STEP
            best, lit = 0.0, 0.0
            if y <= base:
                for cx, cy, r in puffs:
                    dx = abs(x - cx)
                    if wrap:
                        dx = min(dx, w - dx)
                    d = math.hypot(dx, y - cy) / r
                    if d < 1 and 1 - d > best:
                        best = 1 - d
                        height = smooth(foot, top, y)                 # 0 at the foot, 1 at the top
                        crown = smooth(0.2, -0.8, (y - cy) / r)       # each puff's own crown
                        lit = 0.05 + 0.75 * height + 0.2 * crown
            if best > 0 and rnd.random() < dense * smooth(0.0, 0.45, best) ** 1.3:
                rr = R * X2 * (0.75 + rnd.random() * 0.5)
                px, py = x * X2, y * X2
                kind = "lit" if rnd.random() < lit else "shade"
                pens[kind].ellipse((px - rr, py - rr, px + rr, py + rr), fill=1)
                if wrap and px < rr:            # a dot across the seam is drawn on both edges
                    pens[kind].ellipse((px + w * X2 - rr, py - rr, px + w * X2 + rr, py + rr), fill=1)
                if wrap and px > w * X2 - rr:
                    pens[kind].ellipse((px - w * X2 - rr, py - rr, px - w * X2 + rr, py + rr), fill=1)
            gx += STEP
        gy += STEP
    out = {}
    for k, m in masks.items():
        m.putpalette([0, 0, 0, 255, 255, 255])
        buf = io.BytesIO()
        m.save(buf, format="PNG", transparency=0, bits=1, optimize=True)
        out[k] = buf.getvalue()
    return out


def all_masks():
    # The bank is thinner than the cloud: it is a hundred and more pixels of solid body along
    # the foot of every act, and at the cloud's density it read as a wall rather than a sky.
    bank = draw(BANK_W, BANK_H, bank_puffs(), BANK_H + 40, True, 19, 0.72)
    cloud = draw(CLOUD_W, CLOUD_H, cloud_puffs(), CLOUD_BASE, False, 23, 0.9)
    return {ASSETS / "stipple-bank-lit.png": bank["lit"], ASSETS / "stipple-bank-shade.png": bank["shade"],
            ASSETS / "stipple-cloud-lit.png": cloud["lit"], ASSETS / "stipple-cloud-shade.png": cloud["shade"]}


def main():
    fresh = all_masks()
    if "--check" in sys.argv:
        stale = [p for p, b in fresh.items() if not p.exists() or p.read_bytes() != b]
        if stale:
            print("gen-stipple: out of date: " + ", ".join(str(p.relative_to(ROOT)) for p in stale))
            sys.exit(1)
        print("gen-stipple: clean.")
        return
    for p, b in fresh.items():
        p.write_bytes(b)
        print(f"gen-stipple: wrote {p.relative_to(ROOT)} ({len(b) // 1024} KB)")


if __name__ == "__main__":
    main()
