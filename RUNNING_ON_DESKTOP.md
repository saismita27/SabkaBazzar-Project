# Run the current C++ website

Open Ubuntu in your terminal, enter this repository directory, and run:

```bash
cmake -S backend -B backend/build -DCMAKE_BUILD_TYPE=Debug
cmake --build backend/build -j2
backend/build/sabka_backend backend/demo.sqlite backend/catalogue.json public --fifo
```

Open http://127.0.0.1:8080/ in your browser. Stop with Ctrl+C. No npm install/build/dev is needed. Old generated dist/node_modules folders can remain locally but are not used or committed. See README.md for dependencies and honest limitations.
