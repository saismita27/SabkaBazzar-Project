#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if curl -fsS http://127.0.0.1:8080/api/health >/dev/null 2>&1; then echo 'Stop the demo on port 8080 before tests'; exit 1; fi
build_dir="${SABKA_BUILD_DIR:-backend/build}"
tmp=$(mktemp -d)
start() {
 "$build_dir"/sabka_backend "$tmp/test.sqlite" backend/catalogue.json public --fifo > "$tmp/server.log" 2>&1 &
 pid=$!
 for i in {1..40}; do
  kill -0 "$pid" || { cat "$tmp/server.log"; exit 1; }
  if curl -fsS http://127.0.0.1:8080/api/health >/dev/null 2>&1; then return; fi
  sleep 0.25
 done
 exit 1
}
cleanup() {
 if [[ -n "${pid:-}" ]]; then kill -TERM "$pid" 2>/dev/null || true; wait "$pid" 2>/dev/null || true; fi
}
trap cleanup EXIT
start
"$build_dir"/sabka_smoke "$tmp/cookie"
"$build_dir"/sabka_web_smoke
"$build_dir"/sabka_auth_smoke "$tmp/test.sqlite"
kill -TERM "$pid"
wait "$pid"
echo 'PASS graceful SIGTERM shutdown'
start
"$build_dir"/sabka_smoke --restart "$tmp/cookie"
printf '1\ntej patta\n2\nprod-bay-leaf\n1\n3\n0\n' | SABKA_SESSION_FILE="$tmp/cli.session" "$build_dir"/sabka_cli > "$tmp/cli.log"
grep -q '1 matching sample products' "$tmp/cli.log"
grep -q 'Added. Open Cart' "$tmp/cli.log"
grep -q 'prod-bay-leaf  x 1' "$tmp/cli.log"
printf '3\n0\n' | SABKA_SESSION_FILE="$tmp/cli.session" "$build_dir"/sabka_cli > "$tmp/cli-restart.log"
grep -q 'prod-bay-leaf  x 1' "$tmp/cli-restart.log"
echo 'PASS native C++ CLI alias search, cart and session persistence'
printf '5\nDemo shopper\nTest address\nBhubaneswar\n751001\n9000000000\nCOD\nyes\n6\n9\n1\nDemo ticket\nHelp with demonstration\n9\n3\n0\n' | SABKA_SESSION_FILE="$tmp/cli.session" "$build_dir"/sabka_cli > "$tmp/cli-checkout.log"
grep -q 'Saved order:' "$tmp/cli-checkout.log"
grep -q 'Ticket saved' "$tmp/cli-checkout.log"
"$build_dir"/sabka_help_trigger --fifo
sleep 0.5
printf '9\n4\n0\n' | SABKA_SESSION_FILE="$tmp/cli.session" "$build_dir"/sabka_cli > "$tmp/cli-help.log"
grep -q 'KIOSK HELP REQUEST: USERSPACE_FIFO_SIMULATOR' "$tmp/cli-help.log"
echo 'PASS native C++ checkout, order display, support and paired help trigger'
echo "Test database and log: $tmp"
