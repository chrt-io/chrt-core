import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import {terser} from "rollup-plugin-terser";
import bundleSize from 'rollup-plugin-bundle-size';
import * as meta from "./package.json";

const STARTED = 2020;
const YEAR = (new Date).getFullYear();

const config = {
  input: "src/index.js",
  output: {
    file: `dist/${meta.name}.js`,
    name: "chrt",
    format: "umd",
    // sourcemap: 'inline',
    indent: false,
    extend: true,
    exports: 'named',
    banner: `// ${meta.name} v${meta.version} Copyright ${YEAR !== STARTED ? `${STARTED}-` : ''}${YEAR} ${meta.author} ${meta.homepage}`,
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      babelrc: false,
    }),
    bundleSize()
  ]
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      format: 'esm',
      file: `dist/${meta.name}.esm.js`,
    },
    plugins: [...config.plugins]
  },
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${meta.name}.min.js`,
      // sourcemap: true
    },
    plugins: [
      ...config.plugins,
      uglify(),
      terser({
        output: {
          preamble: config.output.banner
        }
      })
    ]
  }
];
