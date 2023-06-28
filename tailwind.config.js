const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: "jit",
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
        // TODO: bring in freight display, rethink which cuts should be used where
        serif: ['freight-big-pro', ...defaultTheme.fontFamily.serif],
      },
      fontSize: {
        base: '1rem',
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