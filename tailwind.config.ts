import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        temple: {
          maroon: '#6B1C23',
          gold: '#F4C430',
          cream: '#FDFBF7',
          'dark-red': '#4A0404',
          'dark-gray': '#1A1A1A',
        },
      },
      fontFamily: {
        serif: ['var(--font-cinzel)', 'Merriweather', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
