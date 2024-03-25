import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#b91c1c",

          secondary: "#b91c1c",

          accent: "#9ca3af",

          neutral: "#f3f4f6",

          "base-100": "#ffffff",

          info: "#111827",

          success: "#ecfccb",

          warning: "#fef08a",

          error: "#fee2e2",
        },
      },
    ],
    extend: {},
  },
  plugins: [require("daisyui")],
} satisfies Config;
