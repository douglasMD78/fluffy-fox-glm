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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom colors from your inline config
        cream: '#FFF0F5',
        navy: '#2D2D2D',
        accent: '#FF2D75',
        pastel: '#FFB7C5',
        surface: '#F9F9F9',
        rose: {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            500: '#f43f5e',
            900: '#881337',
        },
        // Adicionando as cores 'orange' e 'blue'
        orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
        },
        blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
        },
        // Cores das Tags
        tag: {
            cm: '#fb923c', // Laranja
            lm: '#facc15', // Amarelo
            a: '#4ade80',  // Verde
            lt: '#2dd4bf', // Teal
            j: '#60a5fa',  // Azul
            s: '#f472b6',  // Rosa
            ac: '#a78bfa', // Roxo
            b: '#9ca3af',  // Cinza
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'soft': '1.5rem',
        'organic': '2rem 0.5rem 2rem 0.5rem',
        'organic-rev': '0.5rem 2rem 0.5rem 2rem',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        hand: ['"Dancing Script"', 'cursive'],
        sans: ['"Nunito"', 'sans-serif'],
        serif: ['"Poppins"', 'sans-serif'],
        lato: ['"Lato"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(255, 45, 117, 0.10)',
        'soft': '0 20px 40px -10px rgba(74, 74, 74, 0.05)',
        'card-float': '0 10px 30px -10px rgba(45, 45, 45, 0.08)',
        'glow': '0 0 20px rgba(255, 45, 117, 0.15)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    'bg-tag-cm', 'bg-tag-lm', 'bg-tag-a', 'bg-tag-lt', 
    'bg-tag-j', 'bg-tag-s', 'bg-tag-ac', 'bg-tag-b',
    'text-white', 'text-navy', 'p-4', 'p-8', 'p-12',
    // Adicionando classes dinâmicas ao safelist para garantir que sejam geradas
    'focus:border-orange-200',
    'focus:border-blue-200'
  ]
} satisfies Config;