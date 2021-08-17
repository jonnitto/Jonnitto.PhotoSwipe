module.exports = {
    plugins: {
        'postcss-sort-media-queries': true,
        autoprefixer: true,
        cssnano: {
            preset: ['default', { discardComments: { removeAll: true } }],
        },
    },
};
