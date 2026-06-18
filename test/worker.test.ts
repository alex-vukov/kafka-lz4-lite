import * as assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createCodec } from '../src/worker.js';
import {
  registerLz4Codec,
  restoreLz4Codec,
  roundTripLz4Records,
  type TestMessage,
} from './helpers/roundtrip.js';

const assertRoundTrip = async (messages: TestMessage[]) => {
  const decoded = await roundTripLz4Records(messages);

  assert.equal(decoded.length, messages.length);

  messages.forEach((message, index) => {
    const record = decoded[index];

    if (message.key === undefined || message.key === null) {
      assert.equal(record.key, null);
    } else {
      assert.deepEqual(record.key, message.key);
    }

    if (message.value === null) {
      assert.equal(record.value, null);
    } else {
      assert.deepEqual(record.value, message.value);
    }
  });
};

describe('createCodec (worker)', () => {
  before(() => {
    registerLz4Codec(createCodec());
  });

  after(() => {
    restoreLz4Codec();
  });

  it('round-trips a single string payload through kafkajs RecordBatch', async () => {
    await assertRoundTrip([{ key: Buffer.from('key'), value: Buffer.from('hello world') }]);
  });

  it('round-trips multiple JSON-like Kafka event payloads', async () => {
    await assertRoundTrip([
      { key: Buffer.from('user-1'), value: Buffer.from(JSON.stringify({ event: 'login', id: 1 })) },
      { key: Buffer.from('user-2'), value: Buffer.from(JSON.stringify({ event: 'logout', id: 2 })) },
    ]);
  });

  it('round-trips records with null key and tombstone value', async () => {
    await assertRoundTrip([
      { key: null, value: Buffer.from('no-key') },
      { key: Buffer.from('tombstone'), value: null },
    ]);
  });

  it('round-trips records with headers', async () => {
    const messages: TestMessage[] = [
      {
        key: Buffer.from('trace'),
        value: Buffer.from('payload'),
        headers: {
          'content-type': Buffer.from('application/json'),
          'x-trace-id': Buffer.from('abc-123'),
        },
      },
    ];

    const decoded = await roundTripLz4Records(messages);

    assert.deepEqual(decoded[0].headers, messages[0].headers);
  });

  it('round-trips binary payloads', async () => {
    await assertRoundTrip([{ value: Buffer.from([0x00, 0xff, 0x42, 0x13, 0x37]) }]);
  });
});
