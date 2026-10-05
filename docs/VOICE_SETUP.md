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

Official references: [whisper.cpp](https://github.com/ggml-org/whisper.cpp) and [ALSA PCM documentation](https://www.alsa-project.org/alsa-doc/alsa-lib/pcm.html). Speech accuracy and latency vary. Read-aloud uses the separate local native eSpeak NG integration below.

## Local read-aloud (verified October 5)

Product cards and product details offer Read aloud. C++ verifies the session form token, reads the product name and description in the selected English/Hindi/Odia language, invokes eSpeak NG without a shell and returns a standard HTML audio player. Press Play to listen; there is no autoplay or JavaScript. This does not access the microphone. Temporary text/audio are removed after the response. Synthesis is serialized and has a 20-second timeout and bounded input/output.

Observed: real WAV generation passed for en, hi and or; CSRF rejection and missing-product rejection passed. Pronunciation and translation quality still need human review. This is synthetic speech, not a natural human recording. Odia synthesis is supported even though Odia recognition is unavailable.

On another Ubuntu machine, install `espeak-ng` using the system package manager. The C++ server automatically uses `/usr/bin/espeak-ng`. Optional overrides are `SABKA_ESPEAK_BIN` (absolute executable) and `SABKA_ESPEAK_DATA` (directory containing espeak-ng-data).

This machine instead uses a native build in the user's cache, with no system-package changes:

```bash
git clone https://github.com/espeak-ng/espeak-ng.git "$HOME/.cache/sabka-espeak-ng"
git -C "$HOME/.cache/sabka-espeak-ng" checkout ba90c8e9f440ad544f674a790bb5f53878b6ffc5
cmake -S "$HOME/.cache/sabka-espeak-ng" -B "$HOME/.cache/sabka-espeak-ng/build" -DUSE_LIBPCAUDIO=OFF -DUSE_LIBSONIC=OFF -DUSE_MBROLA=OFF -DENABLE_TESTS=OFF -DCMAKE_BUILD_TYPE=Release
cmake --build "$HOME/.cache/sabka-espeak-ng/build" -j2
# Against a disposable test server:
build/backend/sabka_voice_smoke --tts
```

These external-cache Git commands never apply to the project repository. Do not overwrite an existing cache. Missing synthesis dependencies produce an honest unavailable message and retain readable product text. The application itself still builds without this optional dependency.

Official implementation/build reference: https://github.com/espeak-ng/espeak-ng