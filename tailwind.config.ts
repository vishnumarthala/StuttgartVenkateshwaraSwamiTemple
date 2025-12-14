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
      animation: {
        'fade-in': 'fade-in 1s ease-out',
        'fade-in-up': 'fade-in-up 1s ease-out',
        'fade-in-delayed': 'fade-in 1.5s ease-out 0.5s both',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'gentle-scale': 'gentle-scale 0.8s ease-out',
        'slide-in': 'slide-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
