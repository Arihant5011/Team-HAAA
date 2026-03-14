/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.375', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.02em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.625', letterSpacing: '0.02em', fontWeight: '400' }],
                xl: ['1.25rem', { lineHeight: '1.75', letterSpacing: '0.02em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '2', letterSpacing: '0.02em', fontWeight: '500' }],
                '3xl': ['1.875rem', { lineHeight: '2.25', letterSpacing: '0.02em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '2.5', letterSpacing: '0.02em', fontWeight: '600' }],
                '5xl': ['3rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.02em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "syne",
                paragraph: "azeret-mono"
            },
            colors: {
                destructive: '#FF0000',
                'destructive-foreground': '#FFFFFF',
                'accent-teal': '#00FFCC',
                'accent-teal-foreground': '#000000',
                'accent-purple': '#9933FF',
                'accent-purple-foreground': '#FFFFFF',
                'muted-gray': '#4A4A6A',
                'muted-gray-foreground': '#E0E0E0',
                background: '#1A1A2E',
                secondary: '#FF00FF',
                foreground: '#E0E0E0',
                'secondary-foreground': '#000000',
                'primary-foreground': '#000000',
                primary: '#00FFFF'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
