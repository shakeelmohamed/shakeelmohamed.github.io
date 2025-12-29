const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    plugins: [
        require('tailwindcss/nesting'),
        require('tailwindcss'),
        require('autoprefixer'),
        ...(isProduction ? [
            require('cssnano')({ 
                preset: ['default', {
                    discardComments: { removeAll: true },
                    normalizeWhitespace: true,
                    minifySelectors: true,
                    minifyParams: true,
                }] 
            })
        ] : [])
    ]
};