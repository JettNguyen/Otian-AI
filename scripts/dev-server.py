#!/usr/bin/env python3
"""A local server for the site, with reload-on-save that survives the CSP.

Why this exists instead of VS Code's Live Server: every page carries a
Content-Security-Policy meta tag whose script-src lists a sha256 for each inline
script and does not include 'unsafe-inline' (see gen-csp.py). Live Server works by
appending its own inline <script> to the HTML it serves. That script is not in the
hash list, so the browser blocks it and reload-on-save dies silently: the page still
loads, nothing appears in the console unless you look, and saving a file just does
nothing. This server injects its reloader the same way, but adds that one script's
hash to the policy on the way out, so the browser runs it.

Everything else about the policy is served exactly as it ships. That matters: a CSP
mistake (a new inline script, a new API host) still breaks here the way it would in
production, which is the whole point of having the meta tag in the repo.

    python3 scripts/dev-server.py            # http://localhost:5501
    python3 scripts/dev-server.py --port 8000
    python3 scripts/dev-server.py --no-reload   # for headless screenshots

Use --no-reload when pointing headless Chrome at this: the reloader holds an event
stream open forever, so the page never goes network-idle and --virtual-time-budget
and --screenshot runs hang instead of exiting.

Stdlib only, no dependencies, no build step.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import os
import queue
import re
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Directories that never affect a page, and would make the watcher walk thousands
# of files for nothing.
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".vscode", ".github"}
# Only these decide whether the browser should reload.
WATCH_EXT = {".html", ".css", ".js", ".json", ".svg", ".md"}

RELOAD_PATH = "/__dev/reload"

# Kept as the bare script body: its sha256 is what goes into script-src, and that
# hash is over exactly the text between the <script> tags, with no tags and no
# surrounding whitespace of its own.
RELOAD_JS = """
(function () {
  var es = new EventSource("%s");
  es.onmessage = function () { location.reload(); };
  es.onerror = function () { /* server stopped; EventSource retries on its own */ };
})();
""".strip() % RELOAD_PATH

RELOAD_TAG = (
    "\n<!-- injected by scripts/dev-server.py; not in the repo -->\n"
    "<script>%s</script>\n" % RELOAD_JS
)

SCRIPT_HASH = "'sha256-%s'" % base64.b64encode(
    hashlib.sha256(RELOAD_JS.encode("utf-8")).digest()
).decode("ascii")

CSP_META = re.compile(
    r'(<meta http-equiv="Content-Security-Policy" content=")(.*?)(")', re.S
)


def relax_policy(html: str) -> str:
    """Add the reloader's hash to script-src. Nothing else in the policy moves."""

    def fix(m: re.Match) -> str:
        policy = m.group(2)
        if SCRIPT_HASH in policy:
            return m.group(0)
        policy = re.sub(
            r"(script-src\s)", r"\1%s " % SCRIPT_HASH, policy, count=1
        )
        return m.group(1) + policy + m.group(3)

    return CSP_META.sub(fix, html, count=1)


def inject(html: str) -> str:
    html = relax_policy(html)
    lower = html.lower()
    close = lower.rfind("</body>")
    if close == -1:
        return html + RELOAD_TAG
    return html[:close] + RELOAD_TAG + html[close:]


class Watcher(threading.Thread):
    """Polls mtimes and hands every listening page a nudge when one moves.

    Polling rather than fsevents so this stays stdlib-only. A few hundred stat()
    calls twice a second is nothing next to what the browser is doing.
    """

    def __init__(self, root: str, interval: float = 0.4):
        super().__init__(daemon=True)
        self.root = root
        self.interval = interval
        self.listeners: set[queue.Queue] = set()
        self.lock = threading.Lock()

    def subscribe(self) -> queue.Queue:
        q: queue.Queue = queue.Queue()
        with self.lock:
            self.listeners.add(q)
        return q

    def unsubscribe(self, q: queue.Queue) -> None:
        with self.lock:
            self.listeners.discard(q)

    def snapshot(self) -> dict[str, float]:
        seen: dict[str, float] = {}
        for dirpath, dirnames, filenames in os.walk(self.root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for name in filenames:
                if os.path.splitext(name)[1].lower() not in WATCH_EXT:
                    continue
                path = os.path.join(dirpath, name)
                try:
                    seen[path] = os.stat(path).st_mtime
                except OSError:
                    pass
        return seen

    def run(self) -> None:
        previous = self.snapshot()
        while True:
            time.sleep(self.interval)
            current = self.snapshot()
            if current == previous:
                continue
            changed = [p for p, m in current.items() if previous.get(p) != m]
            previous = current
            if changed:
                first = os.path.relpath(changed[0], self.root)
                extra = "" if len(changed) == 1 else " (+%d more)" % (len(changed) - 1)
                print("  changed: %s%s" % (first, extra), flush=True)
            with self.lock:
                for q in list(self.listeners):
                    q.put("reload")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, watcher: Watcher, reload: bool = True, **kwargs):
        self.watcher = watcher
        self.reload = reload
        super().__init__(*args, directory=ROOT, **kwargs)

    # Local editing: a cached response is never what you want, and the ?v= on the
    # stylesheet means a stale one looks like a broken page rather than a stale one.
    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def do_GET(self) -> None:  # noqa: N802 (name comes from the stdlib)
        if self.path.split("?")[0] == RELOAD_PATH:
            if not self.reload:
                self.send_error(404)
                return
            self.serve_events()
            return
        target = self.resolve_html()
        if target:
            self.serve_html(target)
            return
        super().do_GET()

    def resolve_html(self) -> str | None:
        """The on-disk .html this request wants, if it wants one."""
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, "index.html")
        return path if path.endswith(".html") and os.path.isfile(path) else None

    def serve_html(self, path: str) -> None:
        with open(path, "r", encoding="utf-8") as fh:
            html = fh.read()
        body = (inject(html) if self.reload else html).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def serve_events(self) -> None:
        self.send_response(200)
        self.send_header("Content-Type", "text/event-stream")
        self.send_header("Connection", "keep-alive")
        self.end_headers()
        q = self.watcher.subscribe()
        try:
            while True:
                try:
                    q.get(timeout=15)
                    self.wfile.write(b"data: reload\n\n")
                except queue.Empty:
                    # A comment line, so the connection is not reaped as idle.
                    self.wfile.write(b": ping\n\n")
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass  # the tab closed or navigated away
        finally:
            self.watcher.unsubscribe(q)

    def log_message(self, fmt: str, *args) -> None:
        # str(): log_error passes the status code through here as an int.
        if args and RELOAD_PATH in str(args[0]):
            return  # one line per open tab per reload, and never interesting
        super().log_message(fmt, *args)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--port", type=int, default=5501)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument(
        "--no-reload",
        action="store_true",
        help="serve the pages untouched (headless Chrome hangs on the event stream)",
    )
    args = ap.parse_args()

    watcher = Watcher(ROOT)
    if not args.no_reload:
        watcher.start()

    try:
        server = ThreadingHTTPServer(
            (args.host, args.port),
            partial(Handler, watcher=watcher, reload=not args.no_reload),
        )
    except OSError as exc:
        print("dev-server: cannot listen on port %d: %s" % (args.port, exc))
        print("Something else is on it. If it is VS Code's Live Server, stop that")
        print("(status bar, or Command Palette > Live Server: Stop), or pass --port.")
        return 1

    state = "off, pages served untouched" if args.no_reload else "on"
    print("dev-server: http://localhost:%d  (reload-on-save %s)" % (args.port, state))
    print("dev-server: serving %s" % ROOT)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\ndev-server: stopped")
    return 0


if __name__ == "__main__":
    sys.exit(main())
