# Kafka LZ4 Lite
 
 A fast, lightweight, **pure-JS** LZ4 codec for
 [kafkajs](https://www.npmjs.com/package/kafkajs) — compression and decompression
 of Kafka payloads with **zero native build step**.
 
 ## Why Kafka LZ4 Lite
 
 - **Pure JavaScript, zero native dependencies.** No `node-gyp`, no prebuilt
   binaries, no toolchain — it installs and runs anywhere Node does, including
   slim/Alpine and serverless images.
 - **Fast.** Now powered by [`lz4-lite`](https://www.npmjs.com/package/lz4-lite),
   a clean, spec-compliant LZ4 reimplementation, decode throughput is on par with
   native C++/Rust and WASM codecs (see [Performance](#performance)).
 - **Small, predictable memory footprint.** Unlike native bindings — which
   allocate a full LZ4 block buffer per call — and WASM codecs, which reserve a
   large fixed linear heap, this codec keeps a low, steady memory profile, so it
   stays comfortably inside tight container/pod limits.
 - **Fully typed.** All exported functions and objects ship with TypeScript
   declarations.
 - **Spec-compliant frames.** Interoperable with `liblz4`/`lz4` and other
   compliant LZ4 codecs — frames it produces are decoded by them, and vice-versa.
 
 ## Performance
 
 `kafka-lz4-lite` recently migrated its underlying codec from `lz4js` to
 `lz4-lite`. The upgrade is a **major step up** while keeping the same simple API:
 
 | metric (kafkajs consuming 200k LZ4 messages) | before (`lz4js`) | now (`lz4-lite`) | improvement |
 | -------------------------------------------- | ---------------- | ---------------- | ----------- |
 | decode time                                  | 1312 ms          | 92 ms            | **~14× faster** |
 | end-to-end consume                           | 1526 ms          | 280 ms           | **~5× faster**  |
 | peak memory                                  | 660 MB           | 432 MB           | **~35% lower**  |
 
 Measured on Node 20 (Apple M1 Max) decoding ~206 MB of realistic JSON events;
 your numbers will vary with hardware, payload, and batch size. Decode speed now
 lands in the same range as native and WASM codecs — without any binary artifact.
 
 ## Usage
 
 Register the codec once during application startup; it then applies to all
 kafkajs producers and consumers globally:
 
 ```js
 import { CompressionTypes, CompressionCodecs } from "kafkajs";
 import { codec } from "kafka-lz4-lite";
 
 CompressionCodecs[CompressionTypes.LZ4] = codec;
 ```
 
 ## Worker-thread variant (optional)
 
 The library also offers a worker-pool codec built on
 [Piscina](https://www.npmjs.com/package/piscina), which offloads compression and
 decompression to worker threads:
 
 ```js
 import { CompressionTypes, CompressionCodecs } from "kafkajs";
 import { createCodec } from "kafka-lz4-lite/worker";
 
 const codec = createCodec(); // accepts the same options as new Piscina()
 // e.g. createCodec({ minThreads: 2, maxThreads: 4 })
 // The 'filename' option is ignored — the worker file is provided internally.
 
 CompressionCodecs[CompressionTypes.LZ4] = codec;
 ```
 
 Because kafkajs invokes the codec once per *record batch* (not per message),
 decode work is already well amortized, and the synchronous `codec` above is
 usually the faster choice — moving each batch across the worker-thread boundary
 adds copy/serialization overhead. Reach for the worker variant only for unusually
 large payloads, and **benchmark your own workload** before adopting it.
 
 ## Requirements
 
 Node.js >= 16.0.0