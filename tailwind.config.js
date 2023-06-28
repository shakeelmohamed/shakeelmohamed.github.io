const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{md,pug}'
  ],
  safelist: [
    'font-*'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['proxima-nova', ...defaultTheme.fontFamily.sans],
        serif: ['freight-display-pro', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        // [fontSize, lineHeight]
        base: ['1.2rem', '1.2'],
        heading: ['2.4rem', '1.2'] // Just for logo header
      }
    },
    colors: {
      navy: '#002855', // This should mostly disappear, I don't like navy that much anymore
      white: '#FFFFFF',
      orange: '#FF5C0A',
      black: '#111111'
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens')
  ],
}