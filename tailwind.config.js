const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: {
    // TODO: further optimize for production, goal size for tailwind.css is 16k
    enabled: true,
    content: [
      './src/**/*.pug',
      './src/**/*.md'
    ],
    options: {
      keyframes: true,
    }
  }, 
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['proxima-nova', ...defaultTheme.fontFamily.sans],
        serif: ['garamond-premier-pro', ...defaultTheme.fontFamily.serif],
      },
      fontSize: { // TODO: customize other type sizes here; actually do it in src/styles.css
        'base': '1.5rem', // 1.25rem is 20px on desktop... originally had designed with 1.5rem or 24px in mind
        // desktop styles
        'sm': '1em',
        'xl': '',
        '3-xl': '',
        '5-xl': '',
        '7-xl': '',
        // mobile styles
        '2-xl': '',
        '4-xl': '',
        '6-xl': ''
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
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens')
  ],
}