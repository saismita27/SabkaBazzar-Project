#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
cmake -S embedded/system_service -B embedded/system_service/build
cmake --build embedded/system_service/build -j2
worker=''
listener=''
cleanup() {
  if [[ -n "$worker" ]]; then kill -TERM "$worker" 2>/dev/null || true; fi
  if [[ -n "$listener" ]]; then kill -TERM "$listener" 2>/dev/null || true; fi
}
trap cleanup EXIT
embedded/system_service/build/order_worker > embedded/system_service/build/worker-check.log 2>&1 &
worker=$!
sleep 1
kill -TERM "$worker"
wait "$worker"
worker=''
echo 'PASS: order worker exits successfully on SIGTERM'
embedded/system_service/build/sabka_help_simulator > embedded/system_service/build/listener-check.log 2>&1 &
listener=$!
fifo="/tmp/sabka-help-$(id -u)/help.fifo"
for attempt in {1..20}; do [[ -p "$fifo" ]] && break; sleep 0.1; done
printf 'HELP_KIOSK_101\n' > "$fifo"
sleep 1
kill -TERM "$listener"
wait "$listener"
listener=''
grep -q 'SIMULATED EVENT DETECTED' embedded/system_service/build/listener-check.log
echo 'PASS: FIFO event read and listener exits successfully on SIGTERM'
