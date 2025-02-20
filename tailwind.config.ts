import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        palePink: "var(--background)", // Pale Pink
        darkGray: "var(--foreground)", // Dark Gray for contrast
        paleBlue: "var(--primary)", // Pale Blue
        peach: "var(--secondary)", // Peach
        paleYellow: "var(--accent)", // Pale Yellow
        lavender: "var(--muted)", // Lavender
        lightPurple: "var(--muted-light)", // Lavender
        lightPink: "var(--error)", // Light Pink
        mintGreen: "var(--success)", // Mint Green
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
