import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
   safelist: [
    'bg-green-600', 'bg-green-700',
    'bg-red-600', 'bg-red-700'
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: "#fff",
      whiteopaque:"rgba(255,255,255,0.5)",
      blackopaque:"rgba(0,0,0,0.5)",
      black: "#000",
      brandgreen: "#012970",  /* "#00B6AA"*/
      brandblue: "#00f",   /*"#bcfefb" "#5367FF"*/
      brandgreenlight: "rgba(37, 227, 252, 0.29)" ,  /*"rgba(0, 182, 170, 0.29)" */ 
      green: "#19B000",
      red: "#B00000",
      greylight: "#e4e4e7", /* "#e4e4e7" */
      greydark:"#18181b"
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
