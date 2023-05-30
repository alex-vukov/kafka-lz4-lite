import lz4js from "lz4js";

export const compress = function ({ buffer }: { buffer: Buffer | Uint8Array }) {
  return lz4js.compress(buffer);
};

export const decompress = function ({ buffer }: { buffer: Buffer | Uint8Array }) {
  return lz4js.decompress(buffer);
};
