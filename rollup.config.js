import resolve from 'rollup-plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import typescript from '@rollup/plugin-typescript';

const input = 'src/rough-notation.ts';

export default [
  {
    input,
    output: {
      file: 'lib/rough-notation.esm.js',
      format: 'esm'
    },
    plugins: [
      typescript(),
      resolve({ browser: true }),
      terser(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ],
  },
  {
    input,
    output: {
      file: 'lib/rough-notation.cjs.js',
      format: 'cjs'
    },
    plugins: [
      typescript(),
      resolve({ browser: true }),
      terser(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
  },
];
