/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ejs,js}"],
    theme: {
        extend: {},
    },
    plugins: [
        require("daisyui")
    ],
    daisyui: {
        themes: ["light"],
        base: false,
        styled: true,
        utils: false,
        logs: false
    }
}

