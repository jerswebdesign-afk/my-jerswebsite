/** @type {import('tailwindcss').Config} */
// Semantic color tokens for the whole site. Reskin everything by editing
// these values, without touching any structure or class names.
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'background': '#0d0000',
        'surface': '#8B0000',
        'surface-dim': '#0a0000',
        'surface-container-lowest': '#0d0000',
        'surface-container-low': '#1a0505',
        'surface-container': '#220707',
        'surface-container-high': '#330909',
        'surface-container-highest': '#450b0b',
        'surface-bright': '#660000',
        'surface-variant': '#450b0b',
        'on-background': '#f2eaea',
        'on-surface': '#f5efef',
        'on-surface-variant': '#c9b6b6',
        'outline': '#3a1010',
        'outline-variant': '#2a0a0a',
        'inverse-surface': '#ededed',
        // ACCENT: change this one value to rebrand. It drives every CTA glow,
        // every highlight, and the hero canvas. A light/white default keeps the
        // dark aesthetic clean. Try your brand color here, for example '#e6dee7'.
        'accent': '#ff2b2b',
        // "primary" is the accent used on buttons and glows. on-primary is the
        // text color that sits on a solid accent CTA (near-black reads well on
        // a light accent).
        'primary':'#8B0000',
        'primary-container': '#2a0a0a',
        'on-primary': '#0a0a0a',
        'surface-tint': '#660000',
        'tertiary': '#b23a3a',
      },
      fontFamily: {
        headline: ['Space Grotesk'],
        body: ['Manrope'],
        label: ['JetBrains Mono'],
        serif: ['"Instrument Serif"', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0px',
        xl: '0px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
