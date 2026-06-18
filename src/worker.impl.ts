import path from 'node:path';
import Piscina from 'piscina';

export type CreateOptions = NonNullable<ConstructorParameters<typeof Piscina>[0]>;

export const createCodecImpl = (workerDir: string, options?: Omit<CreateOptions, 'filename'>) => {
  const piscina = new Piscina({ ...options, filename: path.resolve(workerDir, 'do_work.js') });

  return () => ({
    compress: async (encoder: { buffer: Buffer }) => {
      const compressed = await piscina.run({ buffer: encoder.buffer }, { name: 'compress' });
      return Buffer.from(compressed);
    },

    decompress: async (buffer: Buffer) => {
      const decompressed = await piscina.run({ buffer }, { name: 'decompress' });
      return Buffer.from(decompressed);
    },
  });
};
