const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    plugins: [
        require('postcss-import'),
        require('autoprefixer'),
        isProduction && require('cssnano')({
            preset: 'default'
        })
    ].filter(Boolean)
};