# Local C++ voice prototype

The browser contains no JavaScript. A CSRF-protected form submits either explicit kiosk-microphone consent or a selected WAV file to the C++ HTTP server. The server uses a private temporary directory, runs native programs with `fork`/`execv` (no shell), enforces timeouts, returns playback and editable recognized text, and deletes temporary server audio. Searching requires a separate user confirmation.

## Observed status

- IMPLEMENTED / TESTED: local WAV upload → actual whisper.cpp → editable transcript and playback. The public upstream JFK sample was used; the response included the expected word “country”. Malformed uploads were rejected.
- IMPLEMENTED / TESTED: missing consent/CSRF rejects microphone requests without recording.
- PROTOTYPE / NOT TESTED: live microphone capture through Linux `arecord`. `alsa-utils` is not installed in the tested Ubuntu environment. No microphone was accessed.
- NOT SUPPORTED: Odia recognition in this integration. Typed Odia and aliases remain available. English fixture recognition was tested; Hindi model support is not a claim of tested Hindi accuracy.
- No cloud service receives audio. Playback embeds audio in the response, so the browser retains that page's recording until the page is closed. Do not use sensitive recordings for the demo.

## Optional native dependencies

For live kiosk recording, run in Ubuntu yourself:

```bash
sudo apt install alsa-utils
arecord -l
```

WSL may need working WSLg/Pulse/ALSA routing. An installed package does not prove microphone availability. The recording form controls the Linux host microphone, not a remote browser microphone. Capture is limited to eight seconds, 16 kHz mono PCM16. Typing and file upload remain available when recording fails.

## Recognition setup (separate user cache, not committed)

The current machine has the engine/model under `/home/saismita/.cache/sabka-whisper-cpp`. The C++ application checks `$HOME/.cache/sabka-whisper-cpp` by default. On another machine:

```bash
git clone https://github.com/ggml-org/whisper.cpp.git "$HOME/.cache/sabka-whisper-cpp"
git -C "$HOME/.cache/sabka-whisper-cpp" checkout 60c0be6ac8fa71b1a2ae2dd938a31a34a508e774
cmake -S "$HOME/.cache/sabka-whisper-cpp" -B "$HOME/.cache/sabka-whisper-cpp/build" -DCMAKE_BUILD_TYPE=Release -DGGML_NATIVE=OFF -DWHISPER_BUILD_TESTS=OFF
cmake --build "$HOME/.cache/sabka-whisper-cpp/build" -j2 --target whisper-cli
bash "$HOME/.cache/sabka-whisper-cpp/models/download-ggml-model.sh" tiny
```

These Git commands apply only to the external engine cache, never the Sabka Bazaar repository. Do not overwrite an existing cache checkout; inspect it first.

Tested model SHA-256: `be07e048e1e599ad46341c8d2a135645097a538221678b7acdd1b1919c6e1b21`.

Optional environment overrides: `SABKA_WHISPER_BIN` (absolute executable path), `SABKA_WHISPER_MODEL` (model path). Do not commit model binaries. The model/engine are optional: the shopping application builds and runs without them.

Start the regular C++ server, open `/voice`, upload a PCM16 WAV under 800 KB, then review the transcript before Search. An optional compiled fixture check is:

```bash
build/backend/sabka_voice_smoke "$HOME/.cache/sabka-whisper-cpp/samples/jfk.wav"
```

Run that against a test server with a disposable database. It never captures microphone audio.

Official references: [whisper.cpp](https://github.com/ggml-org/whisper.cpp) and [ALSA PCM documentation](https://www.alsa-project.org/alsa-doc/alsa-lib/pcm.html). Speech accuracy and latency vary. Read-aloud/TTS is not implemented.
