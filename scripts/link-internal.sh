#!/bin/sh
# Puts the internal docs back at the paths the checks, the generators and Claude Code read them
# from. They live in the private Otian-Internal repo, and .gitignore keeps these links out of this
# public one, so nothing written through a link can be published from here.
#
#   sh scripts/link-internal.sh              uses ../Otian-Internal, beside this repo
#   sh scripts/link-internal.sh /some/path   uses that copy, which is what the deploy does
set -eu

ROOT=$(cd "$(dirname "$0")/.." && pwd)
WANTED=${1:-$ROOT/../Otian-Internal}
SOURCE=$(cd "$WANTED" 2>/dev/null && pwd) || {
  echo "The private Otian-Internal repo is not at $WANTED." >&2
  echo "Clone it beside this repo, then run this again." >&2
  exit 1
}

for file in CLAUDE.md TRUST.md FACTS.md WAR-ROOM.md HUDSON-DASHBOARD.md RESTYLE.md SIMPLIFY.md \
            BRAND.md data/docs-features.json; do
  if [ ! -f "$SOURCE/$file" ]; then
    echo "$SOURCE has no $file, so that copy is out of date. Pull it, then run this again." >&2
    exit 1
  fi
  if [ -e "$ROOT/$file" ] && [ ! -L "$ROOT/$file" ]; then
    echo "$file is a real file here, so it was left alone." >&2
    echo "Copy any changes in it to Otian-Internal, delete it, then run this again." >&2
    exit 1
  fi
  ln -sfn "$SOURCE/$file" "$ROOT/$file"
done

echo "Linked the internal docs from $SOURCE."
