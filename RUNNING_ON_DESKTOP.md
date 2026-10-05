# Running Sabka Bazaar on Ubuntu/Linux

Open Ubuntu, change into this repository, then:

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j2
build/backend/sabka_diagnostics
build/backend/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
```

Second Ubuntu terminal: `build/backend/sabka_cli`. Menu 10 handles account registration/login/logout, menu 11 is the protected administrator workspace. Optional website: http://127.0.0.1:8080/. Stop with Ctrl+C. No npm commands. See README.md for dependencies, explicit local admin promotion and limitations; see docs/EMBEDDED_LINUX.md for the real driver and optional service workflow.
