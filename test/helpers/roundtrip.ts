import { createRequire } from 'node:module';
import kafkajs from 'kafkajs';

const require = createRequire(import.meta.url);

const Record = require('kafkajs/src/protocol/recordBatch/record/v0');
const { RecordBatch } = require('kafkajs/src/protocol/recordBatch/v0');
const recordBatchDecoder = require('kafkajs/src/protocol/recordBatch/v0/decoder');
const Decoder = require('kafkajs/src/protocol/decoder');

const { CompressionTypes, CompressionCodecs } = kafkajs;

export type TestMessage = {
  key?: Buffer | null;
  value: Buffer | null;
  headers?: Record<string, Buffer | Buffer[]>;
};

export type DecodedRecord = {
  key: Buffer | null;
  value: Buffer | null;
  headers: Record<string, Buffer | Buffer[]>;
};

type CodecFactory = () => {
  compress: (encoder: { buffer: Buffer }) => Buffer | Promise<Buffer>;
  decompress: (buffer: Buffer) => Buffer | Promise<Buffer>;
};

let previousLz4Codec: (typeof CompressionCodecs)[typeof CompressionTypes.LZ4];

export const registerLz4Codec = (codecFactory: CodecFactory) => {
  previousLz4Codec = CompressionCodecs[CompressionTypes.LZ4];
  CompressionCodecs[CompressionTypes.LZ4] = codecFactory;
};

export const restoreLz4Codec = () => {
  CompressionCodecs[CompressionTypes.LZ4] = previousLz4Codec;
};

export const roundTripLz4Records = async (messages: TestMessage[]): Promise<DecodedRecord[]> => {
  const records = messages.map((message, index) =>
    Record({
      offsetDelta: index,
      key: message.key ?? null,
      value: message.value,
      headers: message.headers ?? {},
    }),
  );

  const encoded = await RecordBatch({
    compression: CompressionTypes.LZ4,
    records,
  });

  const decoded = await recordBatchDecoder(new Decoder(encoded.buffer));

  return decoded.records.map((record: DecodedRecord) => ({
    key: record.key,
    value: record.value,
    headers: record.headers,
  }));
};
