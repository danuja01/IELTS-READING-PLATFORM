/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ielts: {
          shell: "#c8c8c8",
          header: "#4a4a4a",
          panel: "#ffffff",
          panelMuted: "#f4f4f4",
          border: "#9a9a9a",
          text: "#1a1a1a",
          footer: "#dcdcdc",
        },
      },
      fontFamily: {
        ielts: ["Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
