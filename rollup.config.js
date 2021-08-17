import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import license from 'rollup-plugin-license';

module.exports = {
    input: 'Resources/Private/Assets/Main.js',
    external: ['photoswipe', 'photoswipe/dist/photoswipe-ui-default'],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled',
        }),
        terser({
            output: {
                comments: false,
            },
        }),
        license({
            thirdParty: {
                includePrivate: true,
                output: 'Resources/Public/Main.js.LICENSE',
            },
        }),
    ],
    output: {
        sourcemap: true,
        file: 'Resources/Public/Main.js',
        format: 'iife',
    },
};
