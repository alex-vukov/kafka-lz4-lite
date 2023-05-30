# Kafka LZ4 Lite

Pure JS codec for `kafkajs` LZ4 Compression/Decompression

## Notes

This library provides a codec instance for `kafkajs` to enable LZ4 compression and decompression for Kafka event payloads. Unlike other Kafka LZ4 codec libraries this one uses the pure JS implementation of the LZ4 algorithm from <https://www.npmjs.com/package/lz4js>. For multiple Kafka events per second with a relatively small payload this approach is faster and uses much less CPU and memory than other libraries with Node bindings to the C and Rust LZ4 algorithm implementations.

## Example

To enable Kafka LZ4 compression/decompression you can add this snippet of code anywhere in your application. Executing it once is enough to register the codec for all Kafka consumers and producers in your application.

```js
import { CompressionTypes, CompressionCodecs } from "kafkajs";
import { codec } from "kafka-lz4-lite";

CompressionCodecs[CompressionTypes.LZ4] = codec;

```

 If you are using a producer you can now enable LZ4 compression for your messages by setting the `compression` option to `CompressionTypes.LZ4`.

> **Warning**
>
> This library will work only with Node versions >= 14.0.0
