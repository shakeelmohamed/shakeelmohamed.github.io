const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{md,pug}'
    // ,
    // './src/scripts/**/*.js' // TODO: probably remove, only used by random logo picker
  ],
  safelist: [
    'font-*'
  ],
  // content: {
  //   // TODO: further optimize for production, goal size for tailwind.css is 16k
  //   enabled: true,
  //   content: [
  //     './src/**/*.{md,pug}',
  //     './src/scripts/**/*.js' 
  //   ],
  //   mode: 'all',
  //   preserveHtmlElements: true,
  //   options: {
  //     keyframes: true
  //   }
  // }, 
  theme: {
    extend: {
      fontFamily: {
        sans: ['proxima-nova', ...defaultTheme.fontFamily.sans],
        serif: ['freight-big-pro', ...defaultTheme.fontFamily.serif],
      },
      fontSize: { // TODO: customize other type sizes here; actually do it in src/styles.css
        // 'old_base': '1.5rem', // 1.25rem is 20px on desktop... originally had designed with 1.5rem or 24px in mind
        'base': '1rem', // 1rem is 16px on desktop... originally had designed with 1.5rem or 24px in mind
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
      navy: '#002855',
      blue: '#002855',
      white: '#FFFFFF',
      'light-blue': '#98B6E4',
      orange: '#FF5C0A',
      gray: '#666666'
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