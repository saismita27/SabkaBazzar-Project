#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
exec backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json dist --fifo
