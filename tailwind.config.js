/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: '#00d900',
        red: '#ff4242',
        brand: '#00d900',
        danger: '#ff4242',
        background: '#09090b',
        foreground: '#f4f4f5',
        surface: '#111113',
        'surface-muted': '#1d1d21',
        border: '#27272a',
        muted: '#71717a',
        text: '#f4f4f5',
        text2: '#71717a',
        text3: '#3f3f46',
      },
    },
  },
  plugins: [],
};
