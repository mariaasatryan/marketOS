#!/bin/sh
# Post-commit hook: push current branch to origin after every commit.
# Install with: npm run push-hook

branch=$(git rev-parse --abbrev-ref HEAD)
git push origin "$branch" 2>/dev/null || true
