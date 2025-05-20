/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.njk", "./src/**/*.svg", "./src/assets/js/*.js"],
  theme: {
    extend: {
      screens: {
        sm: "576px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              fontWeight: "normal",
              color: "#475569", // slate.600
            },
            "blockquote p:first-of-type::before": {
              content: "none",
            },
            "blockquote p:last-of-type::after": {
              content: "none",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
