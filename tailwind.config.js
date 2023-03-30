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
      fontSize: { // TODO: customize other type sizes here; actually do it in src/styles.css
        // 'old_base': '1.5rem', // 1.25rem is 20px on desktop... originally had designed with 1.5rem or 24px in mind
        'base': '1.25rem', // 1rem is 16px on desktop... originally had designed with 1.5rem or 24px in mind
        // desktop styles
        // 'sm': '1rem',
        // 'xl': '',
        // '3-xl': '',
        // '5-xl': '',
        // '7-xl': '',
        // // mobile styles
        // '2-xl': '',
        // '4-xl': '',
        // '6-xl': ''
      }
    },
    colors: {
      navy: '#002855', // This should mostly disappear, I don't like navy that much anymore
      white: '#FFFFFF',
      'light-blue': '#98B6E4',
      orange: '#FF5C0A',
      gray: '#111111', // TODO: clean these up, don't need gray AND black
      black: '#111111'
    },
  },
  // variants: {
  //   extend: {
  //     grayscale: ['hover']
  //   },
  // },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens')
  ],
}