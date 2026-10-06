#!/usr/bin/env python3
"""Draw the homepage sky into assets/ as masks of dots: a bank that tiles, and nine different high clouds.

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

NINE SHAPES, NOT ONE STAMPED NINE TIMES (2026-10-06). Jack asked for more clouds and more variety,
and Jett's rule for it was that no two clouds may look copied and that depth shows as size and
fade. So all nine high clouds are grown from seeds by `cumulus()`, and a seed was kept only when it
read as one cloud at a glance, with no lobe floating loose.

ROUND UNDERNEATH, AND SOLID (the same day). Jett's next look: "some cloud shapes look too broken and
flat on the bottom". Two causes, both fixed here. A dot used to be placed by its NEAREST puff alone,
so where two puffs met the cover thinned to a seam of sparse dots; `draw_soft()` sums every puff's
falloff, so meeting puffs fill in. And each cloud was cut along a straight base line; the lobes now
hang free, so the underside is a row of rounded bottoms that rises toward both ends. The bank keeps
the old `draw()`: its foot is the bottom of the screen, where flat is right.

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
# exactly one tile. Change it here, change it there.
BANK_W, BANK_H = 1440, 210

# The high clouds: file name, box in CSS pixels, how many crowns, and the seed that was kept. Each is
# shown at its own aspect ratio by the class that places it (`.day-cloud`, then `.is-c2` and on).
GROWN = [("c1", 360, 120, 3, 0), ("c2", 320, 120, 3, 4), ("c3", 280, 104, 2, 3), ("c4", 260, 124, 2, 3),
         ("c5", 240, 92, 2, 4), ("c6", 220, 84, 3, 0), ("c7", 200, 80, 1, 3), ("c8", 180, 72, 2, 2),
         ("c9", 160, 66, 2, 1)]
# New names rather than new pixels under old ones: these masks are not under the css/js version
# stamp, so a cached "stipple-cloud-lit.png" would keep drawing the old flat-bottomed cloud for hours.


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


def cumulus(seed, w, h, crowns):
    """A cloud from a seed, round all the way round: a row of base lobes whose bottoms make a soft
    scalloped underside that rises toward both ends, crowns of different heights over it, and a body
    puff under each crown so no crown floats free of the base."""
    rnd = random.Random(seed)
    foot = h * 0.9
    puffs = []
    n = max(4, int(w / (h * 0.32)))
    for i in range(n):
        t = (i + 0.5) / n
        edge = math.sin(math.pi * t)                     # 0 at the ends, 1 in the middle
        r = h * (0.13 + 0.09 * edge + rnd.random() * 0.04)
        x = w * (0.1 + 0.8 * t)
        cy = foot - r - h * 0.12 * (1 - edge) - rnd.random() * h * 0.03
        puffs.append((x, cy, r))
    for i in range(crowns):
        cx = w * (0.26 + 0.48 * (i + 0.5) / crowns) + (rnd.random() - 0.5) * w * 0.08
        hr = h * (0.22 + rnd.random() * 0.13)
        top = h * (0.05 + rnd.random() * 0.22)
        cy = max(top + hr, hr + 3)
        puffs.append((cx, cy, hr))
        puffs.append((cx, (cy + foot - h * 0.2) / 2 + hr * 0.2, hr * 1.05))
        puffs.append((cx - hr * 0.9, cy + hr * 0.45, hr * (0.6 + rnd.random() * 0.15)))
        puffs.append((cx + hr * 0.9, cy + hr * 0.5, hr * (0.55 + rnd.random() * 0.15)))
    return puffs


def to_png(masks):
    out = {}
    for k, m in masks.items():
        m.putpalette([0, 0, 0, 255, 255, 255])
        buf = io.BytesIO()
        m.save(buf, format="PNG", transparency=0, bits=1, optimize=True)
        out[k] = buf.getvalue()
    return out


def draw_soft(w, h, puffs, seed, dense):
    """Like draw(), but a dot's chance comes from the SUM of every puff's falloff rather than the
    nearest puff's alone, so two puffs that meet fill the seam between them, and nothing cuts the
    underside flat."""
    top = min(cy - r for _, cy, r in puffs)
    foot = max(cy + r for _, cy, r in puffs)
    rnd = random.Random(seed)
    masks = {k: Image.new("P", (w * X2, h * X2), 0) for k in ("lit", "shade")}
    pens = {k: ImageDraw.Draw(m) for k, m in masks.items()}
    gy = 0.0
    while gy < h:
        gx = 0.0
        while gx < w:
            x, y = gx + rnd.random() * STEP, gy + rnd.random() * STEP
            field, best, crown = 0.0, 0.0, 0.0
            for cx, cy, r in puffs:
                d = math.hypot(x - cx, y - cy) / r
                if d < 1:
                    f = (1 - d) ** 1.4
                    field += f
                    if f > best:
                        best, crown = f, smooth(0.2, -0.8, (y - cy) / r)
            cover = min(1.0, field * 1.6)
            if cover > 0 and rnd.random() < dense * smooth(0.0, 0.5, cover) ** 1.2:
                lit = 0.05 + 0.75 * smooth(foot, top, y) + 0.2 * crown
                rr = R * X2 * (0.75 + rnd.random() * 0.5)
                px, py = x * X2, y * X2
                kind = "lit" if rnd.random() < lit else "shade"
                pens[kind].ellipse((px - rr, py - rr, px + rr, py + rr), fill=1)
            gx += STEP
        gy += STEP
    return to_png(masks)


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
    # The bank is thinner than a high cloud: it is a hundred and more pixels of solid body along
    # the foot of every act, and at a high cloud's density it read as a wall rather than a sky.
    bank = draw(BANK_W, BANK_H, bank_puffs(), BANK_H + 40, True, 19, 0.72)
    out = {ASSETS / "stipple-bank-lit.png": bank["lit"], ASSETS / "stipple-bank-shade.png": bank["shade"]}
    for name, w, h, crowns, seed in GROWN:
        m = draw_soft(w, h, cumulus(seed * 131 + w, w, h, crowns), 70 + seed, 0.9)
        out[ASSETS / f"stipple-{name}-lit.png"] = m["lit"]
        out[ASSETS / f"stipple-{name}-shade.png"] = m["shade"]
    return out


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
