const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    // TODO: optimize for production
    // './src/**/*.html',
    // './src/**/*.js',
  ], 
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['proxima-nova', ...defaultTheme.fontFamily.sans],
        serif: ['"EB Garamond"', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}