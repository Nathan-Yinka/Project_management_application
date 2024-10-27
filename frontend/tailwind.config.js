const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', "class"],
  theme: {
    fontFamily: {
      primary: 'Playfair Display',
      body: 'Work Sans',
    },
    extend: {
      content: {
        about: 'url("/src/assets/img/outline-text/about.svg")',
      },
      colors: {
        background: '#ECF0F3',
        primary: '#4B26D6',
        primarylight: '#F6F4FF',
        secondary: '#1C1D24',
        card: '#FFFFFF',
        hint: '#605E5E',
        darkhint: '#B0B5BE',
        tertiary: '#131419',
        dark: '#22242F',
        light: '#ECF0F3',
        xdarkshadow: '#373C45',
        ydarkshadow: '#181920',
        xlightshadow: '#A3B1C6',
        ylightshadow: '#FFFFFF',
        accent: {
          DEFAULT: '#ac6b34',
          hover: '#925a2b',
        },
        paragraph: '#878e99',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
});
