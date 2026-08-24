#!/usr/bin/env python3
"""Generate the Otian AI horizontal lockup in assets/: cairn mark left, wordmark right.

WHY A GENERATOR. The lockup is three numbers that have to agree: how tall the mark stands
against the wordmark's cap height, where the wordmark's baseline goes so its ink centres on the
mark rather than sitting under it, and how wide the viewBox has to be to end exactly at the last
pixel of the "I". Nudging those by eye is how a logo ends up a few units off centre in a way
nobody can name but everybody can see, so they are computed here instead.

Two sources of truth, neither of them guesswork:
  * the mark's ink bounds, from the closed-form AABB of a rotated ellipse, over the same three
    ellipses assets/icon-1024-dark.svg draws;
  * the wordmark's metrics, read off the system Georgia with PIL.

Georgia's side bearings are the exception: PIL reports the layout box rather than the ink box,
so LSB_EM and INK_RIGHT_EM below were measured off a rendered probe. If the wordmark or the
font ever changes, re-measure them rather than trusting the numbers.

Usage:
  python3 scripts/gen-logo.py            rewrite the lockup SVGs in assets/
Requires Pillow. The PNG export is separate and macOS-only; see the commit that added this.
"""
import math
from PIL import ImageFont

GEORGIA_REG = "/System/Library/Fonts/Supplemental/Georgia.ttf"
GEORGIA_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"

# --- the mark, exactly as it sits in assets/icon-1024-dark.svg (248x248 viewBox) -------------
ELLIPSES = [
    # cx,  cy,  rx, ry, rotation, gradient
    (122, 197, 72, 35, -4, "otianCairnBase"),
    (112, 121, 56, 33,  5, "otianCairnMid"),
    (136,  47, 34, 31, -7, "otianCairnTop"),
]

def mark_bounds():
    xs, ys = [], []
    for cx, cy, rx, ry, deg, _ in ELLIPSES:
        t = math.radians(deg)
        hw = math.hypot(rx * math.cos(t), ry * math.sin(t))
        hh = math.hypot(rx * math.sin(t), ry * math.cos(t))
        xs += [cx - hw, cx + hw]
        ys += [cy - hh, cy + hh]
    return min(xs), min(ys), max(xs), max(ys)

# --- Georgia metrics, at a 1000-unit em ------------------------------------------------------
S = 1000
_reg = ImageFont.truetype(GEORGIA_REG, S)
_bold = ImageFont.truetype(GEORGIA_BOLD, S)
ASCENT = _reg.getmetrics()[0]

BOLD_W = _bold.getlength("Otian") / S            # advance of the bold half
REST_W = _reg.getlength(" AI") / S               # advance of the regular half
# Ink extents relative to the baseline. The tall part ("t"/"i" dot) sits above cap height, and
# the only thing below the baseline is the "O" overshoot, so this is the true ink block.
_bb = _bold.getbbox("Otian AI")
INK_ABOVE = (ASCENT - _bb[1]) / S
INK_BELOW = (_bb[3] - ASCENT) / S

# --- layout ----------------------------------------------------------------------------------
# Georgia's side bearings, in em. PIL reports the layout box rather than the ink box, so these
# two were measured off a rendered probe instead: the glyphs' own ink, divided by the font size.
LSB_EM = 0.023906        # blank strip left of the bold "O"
INK_RIGHT_EM = 4.101484  # advance origin to the right edge of the "I" ink

MARK_H = 180.0   # the tallest thing in the lockup, so it sets the height outright
H = MARK_H       # viewBox is tight to the ink: no built-in margin, add your own clear space
FONT = 128.0     # gives a cap height of half the mark, the ratio archie-text.svg uses
GAP = 40.0       # visual space between mark ink and wordmark ink, not between layout boxes

def build(text_fill, defs_extra="", label="Otian AI"):
    mx0, my0, mx1, my1 = mark_bounds()
    s = MARK_H / (my1 - my0)
    mark_w = (mx1 - mx0) * s
    tx, ty = -mx0 * s, -my0 * s          # mark ink starts exactly at (0, 0)

    # GAP is measured ink-to-ink, so the glyph's own left bearing comes back off the origin.
    text_x = mark_w + GAP - LSB_EM * FONT
    ink_h = (INK_ABOVE + INK_BELOW) * FONT
    baseline = H / 2 + INK_ABOVE * FONT - ink_h / 2
    total_w = text_x + INK_RIGHT_EM * FONT

    ell = "\n".join(
        f'    <ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#{g})"'
        f' transform="rotate({d} {cx} {cy})"/>'
        for cx, cy, rx, ry, d, g in ELLIPSES
    )
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{total_w:.0f}" height="{H:.0f}" viewBox="0 0 {total_w:.2f} {H:.2f}" role="img" aria-label="{label}">
  <!-- Otian AI horizontal lockup: cairn mark left, wordmark right. Transparent ground, with no
       background rect by design. The viewBox is tight to the ink on all four sides, so the file
       carries no clear space of its own; whatever it is placed in should supply that.

       Nothing here is hand-placed. The mark is assets/icon-1024-dark.svg unaltered, scaled to
       stand twice the wordmark's cap height; the wordmark's ink block is centred on the mark's
       centre line rather than sat on its baseline, and the gap between them is measured ink to
       ink. Regenerate with scripts/gen-logo.py rather than nudging values here by hand.

       Gradient ids are prefixed "otian" so this can be inlined on a page beside archie-text.svg
       without the two files' <defs> colliding. -->
  <defs>
    <linearGradient id="otianCairnTop" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#EFA97E"/><stop offset="1" stop-color="#E08A5B"/></linearGradient>
    <linearGradient id="otianCairnMid" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#E4915F"/><stop offset="1" stop-color="#D0774A"/></linearGradient>
    <linearGradient id="otianCairnBase" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#CF7143"/><stop offset="1" stop-color="#BB5F34"/></linearGradient>{defs_extra}
  </defs>
  <g transform="translate({tx:.3f} {ty:.3f}) scale({s:.5f})">
{ell}
  </g>
  <!-- "Otian" bold and " AI" regular: the weight pairing the nav lockup uses. The baseline is
       set explicitly rather than with dominant-baseline, which renderers disagree about. -->
  <text x="{text_x:.2f}" y="{baseline:.2f}" font-family="Georgia, 'Times New Roman', serif" font-size="{FONT:.0f}" fill="{text_fill}"><tspan font-weight="bold">Otian</tspan><tspan> AI</tspan></text>
</svg>
'''

if __name__ == "__main__":
    import sys
    GRAD = '\n    <linearGradient id="otianWord" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFA97E"/><stop offset="1" stop-color="#C36A3D"/></linearGradient>'
    variants = {
        "otian-text.svg":       ("url(#otianWord)", GRAD),
        "otian-text-ink.svg":   ("#44403B", ""),
        "otian-text-cream.svg": ("#F3F0ED", ""),
    }
    out = sys.argv[1] if len(sys.argv) > 1 else "assets"
    for name, (fill, extra) in variants.items():
        open(f"{out}/{name}", "w", encoding="utf-8").write(build(fill, extra))
        print("wrote", name)
    mx0, my0, mx1, my1 = mark_bounds()
    print(f"\nmetrics: bold 'Otian'={BOLD_W:.4f}em  ' AI'={REST_W:.4f}em"
          f"  ink above baseline={INK_ABOVE:.4f}em below={INK_BELOW:.4f}em")
