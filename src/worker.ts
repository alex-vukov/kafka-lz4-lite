import Piscina from "piscina";
import path from "path";

export type CreateOptions = Omit<ConstructorParameters<typeof Piscina>[0], "filename">;

export const createCodec = (options: CreateOptions) => {
  const piscina = new Piscina({ ...options, filename: path.resolve(__dirname, "do_work.js") });

  return () => ({
    compress: async (encoder: { buffer: Buffer }) => {
      const compressed = await piscina.run({ buffer: encoder.buffer }, { name: "compress" });
      return Buffer.from(compressed);
    },

    decompress: async (buffer: Buffer) => {
      const decompressed = await piscina.run({ buffer }, { name: "decompress" });
      return Buffer.from(decompressed);
    },
  });
};
