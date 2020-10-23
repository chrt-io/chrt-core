import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import {terser} from "rollup-plugin-terser";
import * as meta from "./package.json";

const config = {
  input: "src/index.js",
  output: {
    file: `dist/${meta.name}.js`,
    name: "chrt",
    format: "umd",
    indent: false,
    extend: true,
    exports: 'named',
    banner: `// ${meta.homepage} v${meta.version} Copyright ${(new Date).getFullYear()} ${meta.author}`,
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      // sourceMaps: "both",
      babelrc: false,
    })
  ]
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: `dist/${meta.name}.min.js`
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
