import commonjs from "rollup-plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
// assert import for JSON files
// import { default as meta } from './package.json' assert {
//   type: 'json',
// };
import { readFile } from "fs/promises";
const meta = JSON.parse(
  await readFile(new URL("./package.json", import.meta.url)),
);

const STARTED = 2020;
const YEAR = new Date().getFullYear();

const config = {
  input: "src/index.js",
  external: Object.keys(meta.dependencies || {}).filter((key) =>
    /^chrt-/.test(key),
  ),
  output: {
    file: `dist/${meta.name}.js`,
    name: "chrt",
    format: "umd",
    indent: false,
    extend: true,
    exports: "named",
    banner: `// ${meta.name} v${meta.version} Copyright ${
      YEAR !== STARTED ? `${STARTED}-` : ""
    }${YEAR} ${meta.author} ${meta.homepage}`,
    globals: Object.assign(
      {},
      ...Object.keys(meta.dependencies || {})
        .filter((key) => /^chrt-/.test(key))
        .map((key) => ({ [key]: "chrt" })),
    ),
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      // sourceMaps: "both",
      babelrc: false,
    }),
  ],
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      format: "esm",
      file: `dist/${meta.name}.esm.js`,
    },
    plugins: [...config.plugins],
  },
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${meta.name}.min.js`,
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner,
        },
      }),
    ],
  },
  // {
  //   ...config,
  //   output: {
  //     ...config.output,
  //     format: 'cjs',
  //     file: `dist/${meta.name}.node.js`
  //   },
  //   plugins: [...config.plugins]
  // }
];
