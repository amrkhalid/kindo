import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#27716F',
          light: '#4BA7A5',
          dark: '#1B4F4E',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: '#0E76D5',
          light: '#85C5FF',
          dark: '#064C8C',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        warning: {
          DEFAULT: '#F5A623',
          light: '#FFD188',
          dark: '#B36D00',
          foreground: 'hsl(var(--warning-foreground))'
        },
        error: {
          DEFAULT: '#FF4B4B',
          light: '#FF8080',
          dark: '#CC0000',
          foreground: 'hsl(var(--error-foreground))'
        },
        success: {
          DEFAULT: '#2DA44E',
          light: '#57D177',
          dark: '#1B662F',
          foreground: 'hsl(var(--success-foreground))'
        },
        info: {
          DEFAULT: '#2B7B76',
          light: '#4BA7A5',
          dark: '#1B4F4E',
          foreground: 'hsl(var(--info-foreground))'
        },
        'info-secondary': {
          DEFAULT: '#FFB3D4',
          light: '#FFD6E7',
          dark: '#CC608A',
          foreground: 'hsl(var(--info-secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
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
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fadeInUp': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fadeInUp': 'fadeInUp 0.5s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
