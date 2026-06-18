import { compress as lz4Compress, decompress as lz4Decompress } from 'lz4-lite';

export const compress = ({ buffer }: { buffer: Buffer | Uint8Array }) => lz4Compress(buffer);

export const decompress = ({ buffer }: { buffer: Buffer | Uint8Array }) => lz4Decompress(buffer);
