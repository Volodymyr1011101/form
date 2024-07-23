/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js}'],
    theme: {
        extend: {
            colors: {
                'disabled-input': '#CBB6E5',
                'active-input': '#761BE4',
                'error-input': '#ED4545',
                'inactive-button': '#CBB6E5',
                'default-button': '#761BE4',
                'hover-button': '#6A19CD',
                'color-default': '#000853',
                'delete-hover': '#ED4545',
                'time-slot-default': '#CBB6E5',
                'time-slot-active': '#761BE4',
                'age-thumb': '#761BE4',
                'age-bar': '#CBB6E5',
                'main-background': '#F0EAF8'
            }
        }
    },
    plugins: []
};
