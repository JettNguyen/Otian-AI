#!/usr/bin/env python3
"""Space the service names in the reach figure's rivers evenly, and check they stay that way.

**Why this is a script and not an edit.** The rivers hold 176 `<text>` labels across six rows, and
until 2026-09-17 they sat at a fixed pitch: every name's centre the same distance from the last,
whatever the name. That reads as uneven, because the eye measures the GAP and not the pitch. On the
long row the gaps ran from 12.7px to 67.3px, so "Groq" and "xAI" floated in holes while "Google
Calendar" nearly touched its neighbours. Even gaps need each name's rendered width, which needs the
real font at the real size, which needs a browser. Nobody is doing that by hand for 176 labels.

**The two rules the layout has to hold.**

- A static row keeps the span it had and sits centred in its card, so the figure's proportions do
  not move when a name is added.
- A marquee row keeps its PERIOD, which is the distance the loop travels. That distance is written
  into the CSS keyframe and paired with a duration, so changing it means changing both. Keeping the
  period means the duration stays right and the average density stays what it was: only the
  distribution changes. The second of the two copies has to land exactly one period after the first
  or the loop tears, and that is asserted rather than trusted.

  **The speed lives in the duration, not here.** It was 20px a second from the day the rivers
  shipped, which left the desktop loop at 159.6s once the names stretched the row; it is 30px a
  second since 2026-09-18, putting the loop back at 106.4s where it had been. To change it again,
  divide the period by the speed you want and write that into the two `animation` rules in the
  figure's own <style>: desktop `cxRiverL` over 3192px, mobile `cxmRiverL` over 2736px. Nothing in
  this script needs to know.

Usage:
    python3 scripts/gen-rivers.py            rewrite the rows
    python3 scripts/gen-rivers.py --check    fail if they are not what this would write

`--check` needs the same browser, so it is not on the fast gate path; run it with the render pass.
"""
from pathlib import Path
import argparse
import json
import re
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Each row: the label class, its y, the centre of the card it sits in (None for a marquee), the x
# the first name keeps, and the period for a marquee. These are the figure's own geometry and they
# change only when the figure is redrawn.
ROWS = [
    ("cx-nm", "85", 474.0, 334.8, None),
    ("cx-nm", "209", 474.0, 324.9, None),
    ("cx-nm", "333", None, 319.0, 3192.0),
    ("cxm-nm", "186", 224.0, 123.2, None),
    ("cxm-nm", "322", 224.0, 104.0, None),
    ("cxm-nm", "458", None, 114.0, 2736.0),
]

# The two label sizes, which have to match the `.cx-nm` / `.cxm-nm` rules in the figure's own
# <style>. A mismatch here measures the wrong thing and lays out to it, silently.
SIZE = {"cx-nm": 9, "cxm-nm": 7.6}


def rows_from(html):
    """The names in each row, in document order."""
    out = {}
    for cls, y, *_ in ROWS:
        found = re.findall(r'<text class="%s" x="([\d.]+)" y="%s">([^<]+)</text>' % (cls, y), html)
        out[(cls, y)] = [(float(x), n) for x, n in found]
    return out


def measure(names_by_class):
    """Every name's width in the page's own font, from the browser that will draw it.

    Measured with `getComputedTextLength` after `document.fonts.ready`, because Inter arrives from
    Google Fonts and measuring before it lands returns the fallback's metrics, which are close
    enough to look fine and wrong enough to misplace every label."""
    names = sorted({n for cls in names_by_class for n in names_by_class[cls]})
    els = "\n".join(
        '<text class="%s" id="%s::%s" x="0" y="0">%s</text>' % (c, c, n, n)
        for c in SIZE for n in names
    )
    page = """<!doctype html><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',system-ui,sans-serif}%s</style>
<svg width="10" height="10" style="position:absolute;visibility:hidden">%s</svg>
<pre id="out">pending</pre>
<script>
const NAMES = %s, CLASSES = %s;
document.fonts.ready.then(() => {
  const r = {};
  for (const c of CLASSES) {
    r[c] = {};
    for (const n of NAMES) r[c][n] = document.getElementById(c + "::" + n).getComputedTextLength();
  }
  document.getElementById("out").textContent = "W" + JSON.stringify(r) + "E";
});
</script>""" % (
        "".join(".%s{font-size:%spx}" % (c, s) for c, s in SIZE.items()),
        els, json.dumps(names), json.dumps(list(SIZE)),
    )
    with tempfile.TemporaryDirectory() as d:
        f = Path(d) / "m.html"
        f.write_text(page)
        dom = subprocess.run(
            [CHROME, "--headless", "--disable-gpu", "--virtual-time-budget=8000", "--dump-dom", str(f)],
            capture_output=True, text=True,
        ).stdout
    m = re.search(r"W(\{.*?\})E", dom, re.S)
    if not m:
        raise SystemExit("gen-rivers: the browser returned no measurements. Is Chrome at %s?" % CHROME)
    return json.loads(m.group(1))


def place(names, widths, centre, first_x, period, old_pitch):
    """Where each label's centre goes, with one gap for the whole row."""
    w = [widths[n] for n in names]
    if period is not None:
        one = len(names) // 2
        gap = (period - sum(w[:one])) / one
        pen = first_x - w[0] / 2
    else:
        span = (len(names) - 1) * old_pitch + w[0] / 2 + w[-1] / 2
        gap = (span - sum(w)) / (len(names) - 1)
        pen = centre - (sum(w) + (len(names) - 1) * gap) / 2
    xs = []
    for wi in w:
        xs.append(round(pen + wi / 2, 1))
        pen += wi + gap
    if period is not None:
        one = len(names) // 2
        drift = abs((xs[one] - xs[0]) - period)
        assert drift < 0.15, "the loop would tear by %.2fpx" % drift
    return xs, gap


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    html = INDEX.read_text()
    current = rows_from(html)
    by_class = {}
    for (cls, y), items in current.items():
        by_class.setdefault(cls, set()).update(n for _, n in items)
    widths = measure({c: sorted(v) for c, v in by_class.items()})

    stale = []
    for cls, y, centre, first_x, period in ROWS:
        items = current[(cls, y)]
        if not items:
            raise SystemExit("gen-rivers: row %s y=%s is empty. Did the figure change?" % (cls, y))
        names = [n for _, n in items]
        # The pitch a static row was laid out at, recovered from the row itself so this script
        # carries one number per row rather than two.
        pitch = (items[-1][0] - items[0][0]) / (len(items) - 1) if len(items) > 1 else 0
        xs, gap = place(names, widths[cls], centre, first_x, period, pitch)
        for (old_x, name), new_x in zip(items, xs):
            if abs(old_x - new_x) > 0.15:
                stale.append((cls, y, name, old_x, new_x))
        k = [0]

        def sub(m, cls=cls, y=y, xs=xs, k=k):
            i = k[0]
            k[0] += 1
            return '<text class="%s" x="%s" y="%s">%s</text>' % (cls, xs[i], y, m.group(1))

        html = re.sub(r'<text class="%s" x="[\d.]+" y="%s">([^<]+)</text>' % (cls, y), sub, html)
        if not args.check:
            print("%-7s y=%-4s %2d names, gap %5.2f" % (cls, y, len(names), gap))

    if args.check:
        if stale:
            for cls, y, name, old, new in stale[:6]:
                print("  %s y=%s  %-16s at %.1f, should be %.1f" % (cls, y, name, old, new))
            raise SystemExit("gen-rivers: %d labels are not evenly spaced. Run gen-rivers.py." % len(stale))
        print("gen-rivers: all 176 labels evenly spaced.")
        return
    INDEX.write_text(html)
    print("gen-rivers: rewrote %d labels." % sum(len(v) for v in current.values()))


if __name__ == "__main__":
    main()
