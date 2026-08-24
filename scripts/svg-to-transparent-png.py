#!/usr/bin/env python3
"""Rasterise an SVG to a genuinely transparent PNG using qlmanage.

qlmanage always composites onto white, so alpha is solved for rather than read. Rendering the
same art twice, once over white and once over black, gives two equations per pixel:
    Cw = C*a + 255*(1-a)      Cb = C*a
so  a = 1 - (Cw - Cb)/255  and  C = Cb/a. That recovers antialiased edges with their real hue
instead of a dark halo.

Two traps this works around:
  * qlmanage pads the thumbnail to a square with its own white ground. That padding is white in
    both renders, which the solve would read as opaque white, so the black rect's own extent is
    used to find the live region first.
  * it antialiases the edge of that region, leaving a 1-2px fringe that is neither white nor
    black. The art is rendered with a margin so the fringe lands in throwaway space, and the
    margin is then cut back off by cropping to the alpha bounds.
"""
import os, re, subprocess, sys
from PIL import Image, ImageChops

FRINGE = 4          # px of viewport-edge antialiasing to discard
MARGIN = 0.06       # render margin, as a fraction of viewBox width


def render(svg_path, bg, size, tmp):
    s = open(svg_path, encoding="utf-8").read()
    m = re.search(r'<svg[^>]*viewBox="([-\d. ]+)"[^>]*>', s)
    x, y, w, h = (float(v) for v in m.group(1).split())
    p = w * MARGIN
    nx, ny, nw, nh = x - p, y - p, w + 2 * p, h + 2 * p
    s = (s[:m.end()]
         + f'\n<rect x="{nx}" y="{ny}" width="{nw}" height="{nh}" fill="{bg}"/>'
         + s[m.end():]).replace(f'viewBox="{m.group(1)}"', f'viewBox="{nx} {ny} {nw} {nh}"')
    tag = bg.strip("#")
    src = os.path.join(tmp, f"bg_{tag}.svg")
    open(src, "w", encoding="utf-8").write(s)
    out = os.path.join(tmp, tag)
    os.makedirs(out, exist_ok=True)
    subprocess.run(["qlmanage", "-t", "-s", str(size), "-o", out, src], capture_output=True)
    return Image.open(os.path.join(out, os.path.basename(src) + ".png")).convert("RGB")


def main(svg_path, png_path, size=2400):
    tmp = os.path.join(os.path.dirname(png_path) or ".", "_raster")
    os.makedirs(tmp, exist_ok=True)
    w_img = render(svg_path, "#ffffff", size, tmp)
    b_img = render(svg_path, "#000000", size, tmp)
    if w_img.size != b_img.size:
        sys.exit(f"render size mismatch {w_img.size} vs {b_img.size}")

    live = (ImageChops.difference(b_img, Image.new("RGB", b_img.size, (255,) * 3))
            .convert("L").point(lambda v: 255 if v > 6 else 0).getbbox())
    if live is None:
        sys.exit("could not locate the rendered region")
    x0, y0, x1, y1 = live
    box = (x0 + FRINGE, y0 + FRINGE, x1 - FRINGE, y1 - FRINGE)
    w_img, b_img = w_img.crop(box), b_img.crop(box)

    out = Image.new("RGBA", w_img.size)
    wp, bp, op = w_img.load(), b_img.load(), out.load()
    for yy in range(out.height):
        for xx in range(out.width):
            rw, gw, bw = wp[xx, yy]
            rb, gb, bb = bp[xx, yy]
            a = 255 - max(rw - rb, gw - gb, bw - bb)
            if a <= 0:
                op[xx, yy] = (0, 0, 0, 0)
            else:
                f = 255.0 / a
                op[xx, yy] = (min(255, int(rb * f + .5)), min(255, int(gb * f + .5)),
                              min(255, int(bb * f + .5)), a)

    bbox = out.split()[3].getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(png_path)
    corners = [out.getpixel(p)[3] for p in
               [(0, 0), (out.width - 1, 0), (0, out.height - 1), (out.width - 1, out.height - 1)]]
    print(f"{os.path.basename(png_path)}: {out.width}x{out.height}  corner alphas {corners}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 2400)
