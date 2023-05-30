import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

const extensions = [".js", ".ts", ".tsx", ".json"];

const config = {
  input: ["src/index.ts", "src/worker.ts", "src/do_work.ts"],
  external: [/@babel\/runtime/, /lz4js/, /piscina/],
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      preserveModules: true,
      sourcemap: true,
    },
    {
      dir: "dist/cjs",
      format: "cjs",
      preserveModules: true,
      exports: "auto",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      include: "src/**/*",
      exclude: "**/node_modules/**",
      babelHelpers: "runtime",
      extensions,
    }),
  ],
};

export default config;
