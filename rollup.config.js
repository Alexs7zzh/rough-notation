import resolve from 'rollup-plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

const input = 'src/rough-notation.ts';
const plugins = [
  typescript(),
  resolve(),
  terser({
    mangle: {
      properties: {
        regex: /^_/
      }
    }
  })
]

export default [
  {
    input,
    output: {
      file: 'lib/rough-notation.esm.js',
      format: 'esm',
      exports: 'default'
    },
    plugins,
  },
  {
    input,
    output: {
      file: 'lib/rough-notation.cjs.js',
      format: 'cjs',
      exports: 'default'
    },
    plugins
  },
];
