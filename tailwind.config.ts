import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'var(--font-geist-sans)',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-geist-mono)',
  				'monospace'
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: 'hsl(var(--muted))',
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			brand: 'var(--color-brand)',
  			'brand-foreground': 'hsl(var(--brand-foreground))',
  			'muted-foreground': 'hsl(var(--muted-foreground))',
  			'charcoal-700': 'var(--color-charcoal-700)',
  			'charcoal-800': 'var(--color-charcoal-800)',
  			'charcoal-900': 'var(--color-charcoal-900)',
  			'gray-100': 'var(--color-gray-100)',
  			'gray-200': 'var(--color-gray-200)',
  			'gray-300': 'var(--color-gray-300)',
  			'gray-400': 'var(--color-gray-400)',
  			'gray-500': 'var(--color-gray-500)',
  			'gray-600': 'var(--color-gray-600)',
  			divide: 'var(--color-divide)',
  			canvas: 'var(--color-canvas)',
  			'canvas-fill': 'var(--color-canvas-fill)',
  			dots: 'var(--color-dots)',
  			line: 'var(--color-line)',
  			'pattern-fg': 'var(--color-pattern-fg)',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		maxWidth: {
  			container: '1280px'
  		},
  		animation: {
  			marquee: 'marquee var(--duration) linear infinite',
  			'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
  			'star-movement-top': 'star-movement-top linear infinite alternate'
  		},
  		keyframes: {
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-100% - var(--gap)))'
  				}
  			},
  			'star-movement-bottom': {
  				'0%': {
  					transform: 'translate(0%, 0%)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translate(-100%, 0%)',
  					opacity: '0'
  				}
  			},
  			'star-movement-top': {
  				'0%': {
  					transform: 'translate(0%, 0%)',
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translate(100%, 0%)',
  					opacity: '0'
  				}
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
