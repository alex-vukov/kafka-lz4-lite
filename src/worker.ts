import Piscina from "piscina";
import path from "path";

const piscina = new Piscina({ filename: path.resolve(__dirname, "do_work.js") });

export const codec = () => ({
  compress: async (encoder: { buffer: Buffer }) => {
    const compressed = await piscina.run({ buffer: encoder.buffer }, { name: "compress" });
    return Buffer.from(compressed);
  },

  decompress: async (buffer: Buffer) => {
    const decompressed = await piscina.run({ buffer }, { name: "decompress" });
    return Buffer.from(decompressed);
  },
});
