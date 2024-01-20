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
        sans: ['tt-commons-pro', ...defaultTheme.fontFamily.sans],
        serif: ['corporate-a', ...defaultTheme.fontFamily.serif], // Only used for branding
      },
      fontSize: {
        // [fontSize, lineHeight]
        base_sm: ['1rem', '1.1'], // Body mobile
        base: ['1.2rem', '1.2'], // Body
        heading_sm: ['2.2rem', '1.2'], // Branding mobile
        heading: ['2.4rem', '1.2'], // Branding header

        // TODO: new system from Cargo, ideally remove the rest
        sizeh2: ['1.5rem', '1.3'],
        sizeh1: ['2.5rem', '1.2']
      }
    },
    colors: {
      navy: '#002855', // This should mostly disappear, I don't like navy that much anymore
      white: '#FFFFFF',
      orange: '#FF5C0A',
      black: '#000000'
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens')
  ],
}