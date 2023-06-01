# Kafka LZ4 Lite

Pure JS codec for [kafkajs](https://www.npmjs.com/package/kafkajs) LZ4 Compression/Decompression

## Notes

This library provides a codec instance for `kafkajs` to enable LZ4 compression and decompression of Kafka event payloads. Unlike other Kafka LZ4 codec libraries this one uses the pure JS implementation of the LZ4 algorithm from [lz4js](https://www.npmjs.com/package/lz4js). For multiple Kafka events per second with a relatively small payload this approach is faster and uses much less CPU and memory than other libraries with Node bindings to the C++ and Rust LZ4 algorithm implementations. This is so because passing data between Node and the native OS threads takes a lot of resources. All exported objects and functions are typed with TypeScript.

## Example

To enable Kafka LZ4 compression/decompression you can add this snippet of code anywhere in the initialization of your application. Executing it once is enough to globally register the codec for all Kafka consumers and producers in your application.

```js
import { CompressionTypes, CompressionCodecs } from "kafkajs";
import { codec } from "kafka-lz4-lite";

CompressionCodecs[CompressionTypes.LZ4] = codec;

```

If you want to perform the compression/decompression in a Node worker thread this library also provides another way to initialize the codec. This approach could be useful when dealing with larger Kafka payloads but it's recommended to first test the performance of the application because context switching in Node is slow and heavy on the CPU. The worker implementation uses a [Piscina](https://www.npmjs.com/package/piscina) thread pool and the `createCodec()` function accepts the same options as a new `Piscina()` instance. To use this approach you can initialize the codec like this:

```js
import { CompressionTypes, CompressionCodecs } from "kafkajs";
import { createCodec } from "kafka-lz4-lite/worker";

const codec = createCodec(); // Uses default Piscina options.

// Or with custom Piscina options.
// const codec = createCodec({ minThreads: 2, maxThreads: 4 });
// The 'filename' option is not supported and will be ignored because the worker file is provided internally.

CompressionCodecs[CompressionTypes.LZ4] = codec;
```

> **Warning**
>
> This library will work only with Node versions >= 12.0.0
