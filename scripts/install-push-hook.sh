#!/bin/bash
# Installs a post-commit hook that pushes to origin after every commit.
# Run once: npm run push-hook

HOOK_SRC="$(dirname "$0")/post-commit-push.sh"
HOOK_DEST="$(git rev-parse --git-dir)/hooks/post-commit"

cp "$HOOK_SRC" "$HOOK_DEST"
chmod +x "$HOOK_DEST"
echo "Done. Every 'git commit' will now auto-push to origin."
echo "You can still use 'npm run ship' to add + commit + push in one go."
