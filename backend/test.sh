#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if curl -fsS http://127.0.0.1:8080/api/health >/dev/null 2>&1; then echo 'Stop the demo on port 8080 before tests'; exit 1; fi
tmp=$(mktemp -d)
start() {
 backend/build/sabka_backend "$tmp/test.sqlite" backend/catalogue.json dist --fifo > "$tmp/server.log" 2>&1 &
 pid=$!
 for i in {1..40}; do
  kill -0 "$pid" || { cat "$tmp/server.log"; exit 1; }
  if curl -fsS http://127.0.0.1:8080/api/health >/dev/null 2>&1; then return; fi
  sleep 0.25
 done
 exit 1
}
trap 'kill -TERM "${pid:-0}" 2>/dev/null || true; wait "${pid:-0}" 2>/dev/null || true' EXIT
start
backend/build/sabka_smoke "$tmp/cookie"
kill -TERM "$pid"
wait "$pid"
echo 'PASS graceful SIGTERM shutdown'
start
backend/build/sabka_smoke --restart "$tmp/cookie"
echo "Test database and log: $tmp"
