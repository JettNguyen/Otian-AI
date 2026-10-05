#!/usr/bin/env python3
"""Draw the homepage sky's clouds into assets/: two masks of dots, stipple-lit.png and stipple-shade.png.

WHY STIPPLE. On 2026-10-05 Jack picked trajectory.ai as one of three sites to borrow from, and the
thing that site owns is a texture: every cloud on it is drawn in dots. The homepage already runs one
day, with a clock on each act (7:00 pm, 9:12 am, 1:40 pm, 4:15 pm, 2:00 am, 7:00 am), so the sky's
clouds take their colour from that clock: dusk is peach over lavender, the small hours are moonlit
grey, the morning is gold. The colour is CSS and js/home.js; this script only says where the dots go.

WHY TWO MASKS AND NOT ONE PICTURE. A cloud is lit from above and shaded underneath, so every dot is
drawn into one of two masks, by how high it sits in its own cloud: the top of a cloud is mostly lit
dots and the base mostly shaded ones, with the two mixed in between. Each mask is painted one flat
colour by the stylesheet (`.day-stipple`), so the same dots can be any hour of the day without a
second file.

WHY 1-BIT. The dots are on or off, so each mask is a two-entry palette PNG with the first entry
transparent: about 30KB each at twice the 1440 by 900 stage they are drawn for. Anti-aliased dots
in an alpha channel came to six times that and looked no different once the browser scaled them.

Deterministic: fixed seeds, so a rerun writes the same bytes and a diff means the shapes changed.

Usage:
  python3 scripts/gen-stipple.py            rewrite both masks
  python3 scripts/gen-stipple.py --check    exit 1 if the committed masks differ from a fresh draw
"""

import io
import math
import random
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = {"lit": ROOT / "assets" / "stipple-lit.png", "shade": ROOT / "assets" / "stipple-shade.png"}

# Twice the stage's design size, so a dot stays crisp on a 2x screen. The stylesheet covers the
# stage with it from the bottom edge, so the bank always sits on the floor of the screen.
W, H = 2880, 1800
ASP = W / H
STEP, R = 5, 2.0   # a jittered grid of 5px cells, a dot of about 2px radius in each cell it fills


def smooth(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def bank():
    """Puffs along the bottom edge, rising higher toward the sides than in the middle, where the
    scene stands and a tall cloud would only be hidden behind it."""
    rnd = random.Random(3)
    puffs, x = [], -0.05
    while x < 1.06:
        side = abs(x - 0.55) / 0.55
        r = 0.04 + 0.045 * side + rnd.random() * 0.025
        top = 0.975 - 0.12 * side ** 1.3 - rnd.random() * 0.03
        puffs.append((x, top + r, r))
        puffs.append((x + r * 0.6, top + r * 1.9, r * 1.25))
        x += r * 1.15
    return {"puffs": puffs, "base": 1.2}


def cloud(cx, cy, s):
    """A small high cloud: a row of puffs, biggest in the middle, cut flat along its base."""
    shape = [(-0.075, 0.006, 0.026), (-0.045, -0.006, 0.034), (-0.012, -0.02, 0.042), (0.028, -0.016, 0.04),
             (0.062, -0.002, 0.03), (0.088, 0.008, 0.02), (0.0, 0.008, 0.036), (-0.035, 0.012, 0.03), (0.045, 0.012, 0.028)]
    return {"puffs": [(cx + px * s, cy + py * s, pr * s) for px, py, pr in shape], "base": cy + 0.02 * s}


# The bank, one cloud in the gap between the menu and the caption column's first line, and one
# standing off the right edge beside the phone. Neither crosses a caption or the window.
CLOUDS = [bank(), cloud(0.255, 0.125, 0.9), cloud(0.985, 0.43, 0.85)]
for c in CLOUDS:
    c["top"] = min(cy - r for _, cy, r in c["puffs"])
    # Lit from the top of the cloud down to its base, or the bottom of the screen if the base is
    # below it, so the part of the bank anybody sees still has a shaded underside.
    c["bottom"] = min(c["base"], max(cy + r for _, cy, r in c["puffs"]), 1.0)


def sample(u, v):
    """How likely a dot is here, and how likely that dot is lit."""
    best, lit = 0.0, 0.0
    for c in CLOUDS:
        if v > c["base"]:
            continue
        for cx, cy, r in c["puffs"]:
            d = math.hypot((u - cx) * ASP, v - cy) / r
            if d < 1 and 1 - d > best:
                best = 1 - d
                height = smooth(c["bottom"], c["top"], v)            # 0 at the base, 1 at the top
                ridge = smooth(0.2, -0.8, (v - cy) / r)              # each puff's own crown
                lit = 0.05 + 0.75 * height + 0.2 * ridge
    if best <= 0:
        return 0.0, 0.0
    return 0.9 * smooth(0.0, 0.45, best) ** 1.3, min(1.0, lit)


def draw():
    rnd = random.Random(19)
    masks = {k: Image.new("P", (W, H), 0) for k in OUT}
    pens = {k: ImageDraw.Draw(m) for k, m in masks.items()}
    for gy in range(0, H, STEP):
        for gx in range(0, W, STEP):
            x, y = gx + rnd.random() * STEP, gy + rnd.random() * STEP
            dens, lit = sample(x / W, y / H)
            if dens and rnd.random() < dens:
                r = R * (0.75 + rnd.random() * 0.5)
                pens["lit" if rnd.random() < lit else "shade"].ellipse((x - r, y - r, x + r, y + r), fill=1)
    out = {}
    for k, m in masks.items():
        m.putpalette([0, 0, 0, 255, 255, 255])
        buf = io.BytesIO()
        m.save(buf, format="PNG", transparency=0, bits=1, optimize=True)
        out[k] = buf.getvalue()
    return out


def main():
    fresh = draw()
    if "--check" in sys.argv:
        stale = [k for k, b in fresh.items() if not OUT[k].exists() or OUT[k].read_bytes() != b]
        if stale:
            print("gen-stipple: out of date: " + ", ".join(str(OUT[k].relative_to(ROOT)) for k in stale))
            sys.exit(1)
        print("gen-stipple: clean.")
        return
    for k, b in fresh.items():
        OUT[k].write_bytes(b)
        print(f"gen-stipple: wrote {OUT[k].relative_to(ROOT)} ({len(b) // 1024} KB)")


if __name__ == "__main__":
    main()
