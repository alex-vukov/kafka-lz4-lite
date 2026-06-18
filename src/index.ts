import { compress, decompress } from 'lz4-lite';

export const codec = () => ({
  compress: (encoder: { buffer: Buffer }) => {
    const compressed = compress(encoder.buffer);
    return Buffer.from(compressed);
  },

  decompress: (buffer: Buffer) => {
    const decompressed = decompress(buffer);
    return Buffer.from(decompressed);
  },
});
