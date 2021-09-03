const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    // TODO: optimize for production
    // './src/**/*.html',
    // './src/**/*.js',
  ], 
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['proxima-nova', ...defaultTheme.fontFamily.sans],
        serif: ['garamond-premier-pro', ...defaultTheme.fontFamily.serif],
      },
      fontSize: { // TODO: customize other type sizes here
        'base': '1.25rem' // This is 20px on desktop... originally had designed with 24px in mind
      }
    },
    colors: {
      navy: '#002855',
      blue: '#002855',
      white: '#FFFFFF',
      'light-blue': '#98B6E4',
      orange: '#FF5C0A'
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // TODO: lots of manual work needed to override font family & colors whenever using .prose class
    // see docs https://github.com/tailwindlabs/tailwindcss-typography
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
}