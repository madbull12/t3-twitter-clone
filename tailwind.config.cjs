/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');


module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  daisyui: {
    themes: [{
      default: {
        primary: "#1D9BF0",
        secondary:"#8692A0",
        
        accent: "#37cdbe",
        neutral: "#000",
        "base-100": "#ffffff",
      },
      dim:{
        primary: "#1D9BF0",
        neutral:"#fff",
        secondary:"#8692A0",
        accent: "#37cdbe",
        "base-100":"#15202B",
        'base-200':"#1E2732",
        "base-300":"#374151",
      }
    },
      
    ],
  },
  // darkMode:"class",
  theme: {
    extend: {
      // colors: {
      //   primary: "#1D9BF0",
      // },
   
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [require("daisyui")],
};
