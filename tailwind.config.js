const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  content: [
    './src/**/*.{md,pug,json}'
  ],
  safelist: [
    'font-*'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['proxima-nova', ...defaultTheme.fontFamily.sans],
        serif: ['freight-display-pro', ...defaultTheme.fontFamily.serif], // Only used for branding
      },
      fontSize: {
        // [fontSize, lineHeight]
        base_sm: ['1rem', '1.1'], // Body mobile
        base: ['1.2rem', '1.2'], // Body
        heading_sm: ['2.2rem', '1.2'], // Branding mobile
          heading: ['2.4rem', '1.2'] // Branding header
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