#!/usr/bin/env python3
"""Load every page in a real browser and fail if the CSP blocks anything.

A content security policy that silently breaks sign-in, the marketplace or the booking widget is
worse than no policy at all, and it breaks in the browser rather than in the file, so reading the
policy is not a check. This serves the site and loads every page in headless Chrome, watching the
console for the violation messages Chrome prints when it refuses a load.

ONE PAGE PER BROWSER, SEQUENTIALLY, WHICH IS SLOW AND IS THE ONLY SHAPE THAT WORKS. Two faster
designs were tried and both fail on this Chrome, so do not "optimise" this back into either:

  * Several browsers in parallel: cold-profile startup dominates and six at a time thrash badly
    enough that most pages hit their timeout without ever finishing a load.
  * One browser loading every page as an iframe: --virtual-time-budget never settles while a
    dozen frames hold real network requests open, so the run hangs until the process timeout
    rather than finishing early.

Sequential is about three minutes for seventy pages. That is the cost of checking in a real
browser, and a check that reliably finishes beats a fast one that reports timeouts.

The detector is verified rather than trusted. A page whose policy blocks its own inline script
produces exactly the string this greps for, so SELF_TEST runs first and the whole run fails if
that known-bad page does NOT report a violation. Otherwise "no violations found" could equally
mean "violations are no longer detectable", and those must never look the same.

Usage:  python3 scripts/check-csp.py [--port 8899]
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", ".claude", "node_modules", "firebase-hosting", "scripts"}
# The self-test is written into the repo root while the run is in progress, so the page walker
# would otherwise sweep it and report its deliberate violation as a real one.
SKIP_FILES = {"preview.html", "_csp-selftest.html"}

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
VIOLATION = re.compile(r"Content Security Policy|Refused to", re.I)

# Blocking external DNS to skip the Google Fonts and gstatic fetches was tried and reverted:
# every form of --host-resolver-rules that stops those also stops localhost on this Chrome, so
# the pages never load at all. The network cost stays.

SELF_TEST = """<!DOCTYPE html><html><head><meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'none'" />
</head><body><script>console.log('blocked')</script></body></html>
"""


def pages():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name.endswith(".html") and name not in SKIP_FILES:
                yield os.path.relpath(os.path.join(dirpath, name), ROOT)


def run_chrome(url, budget_ms, wait_s=4):
    """Load one URL; hand back the console lines Chrome flagged as CSP violations.

    Chrome is killed after wait_s rather than waited on, and its output is read either way.
    That is not a compromise, it is the only thing that works: any page holding a live
    Firestore listener (the account, admin, billing, phone and marketplace pages all do)
    never finishes loading, so --dump-dom never returns and a plain subprocess timeout both
    hangs the run and throws away the output. A CSP violation is printed the moment the load
    is refused, which is long before this deadline, so killing a page that is still streaming
    costs nothing.

    Four seconds is measured, not guessed: the self-test page is detected at a two-second
    deadline, so four is double the margin on a violation that is printed during parse. It is
    also the whole runtime budget, since every page runs to the deadline: seventy-odd pages at
    four seconds is about five minutes.
    """
    profile = tempfile.mkdtemp(prefix="csp-")
    try:
        proc = subprocess.Popen(
            [
                CHROME, "--headless", "--disable-gpu", "--no-first-run",
                "--user-data-dir=" + profile,
                "--enable-logging=stderr", "--log-level=0",
                "--virtual-time-budget=%d" % budget_ms,
                "--dump-dom", url,
            ],
            stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True,
        )
        try:
            _, err = proc.communicate(timeout=wait_s)
        except subprocess.TimeoutExpired:
            proc.kill()
            _, err = proc.communicate()
        return [l for l in (err or "").splitlines() if VIOLATION.search(l)]
    finally:
        shutil.rmtree(profile, ignore_errors=True)


def source_of(line):
    """Chrome appends `, source: <url> (line)`; map that back to a page path."""
    m = re.search(r"source: https?://[^/]+/(\S*?)(?: \(\d+\))?$", line.strip())
    return m.group(1) if m else "?"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8899)
    args = ap.parse_args()

    if not os.path.exists(CHROME):
        print("check-csp: Chrome not found at %s; skipping." % CHROME)
        return 0

    server = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(args.port)],
        cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    selftest = os.path.join(ROOT, "_csp-selftest.html")
    try:
        time.sleep(1.5)
        base = "http://localhost:%d/" % args.port

        with open(selftest, "w", encoding="utf-8") as fh:
            fh.write(SELF_TEST)
        if not run_chrome(base + "_csp-selftest.html", 3000):
            print("check-csp: the self-test page reported no violation, so the detector is not")
            print("working and a clean result would mean nothing. Not reporting a pass.")
            return 1

        rels = sorted(pages())
        by_page = {}
        for rel in rels:
            for line in run_chrome(base + rel.replace(os.sep, "/"), 3000):
                by_page.setdefault(rel, []).append(line)
            sys.stdout.write("X" if rel in by_page else ".")
            sys.stdout.flush()
        print()

        if by_page:
            print("CSP violations on %d of %d pages:\n" % (len(by_page), len(rels)))
            for rel in sorted(by_page):
                print("  %s" % rel)
                for line in by_page[rel][:4]:
                    msg = line.split('"', 1)[-1].rsplit('", source', 1)[0]
                    print("      %s" % msg[:200])
            print("\nEither the page needs fixing or the policy in scripts/gen-csp.py does.")
            return 1

        print("check-csp: %d pages loaded, zero CSP violations." % len(rels))
        return 0
    finally:
        server.terminate()
        for path in (selftest,):
            if os.path.exists(path):
                os.remove(path)


if __name__ == "__main__":
    sys.exit(main())
