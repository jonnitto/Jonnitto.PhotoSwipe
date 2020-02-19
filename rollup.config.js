import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import license from 'rollup-plugin-license';
import composer from './composer.json';

const AUTHOR = composer.authors[0].name;
const BANNER_CONTENT = `${composer.extra.neos['package-key']} - created by ${AUTHOR}
@link ${composer.homepage}
Copyright 2016-${parseInt(new Date().getFullYear(), 10)} ${AUTHOR}
Licensed under ${composer.license}`;

module.exports = {
    input: 'Resources/Private/Assets/Main.js',
    external: ['photoswipe', 'photoswipe/dist/photoswipe-ui-default'],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        }),
        terser({
            output: {
                comments: false
            }
        }),
        license({
            banner: {
                content: BANNER_CONTENT,
                commentStyle: 'ignored'
            },
            thirdParty: {
                includePrivate: true,
                output: 'Resources/Public/Main.js.LICENSE'
            }
        })
    ],
    output: {
        sourcemap: true,
        file: 'Resources/Public/Main.js',
        format: 'iife'
    }
};
