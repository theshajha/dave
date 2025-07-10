/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Game-specific color palette
                game: {
                    primary: '#2563eb', // Blue
                    secondary: '#dc2626', // Red
                    accent: '#f59e0b', // Amber
                    background: '#1f2937', // Dark gray
                    surface: '#374151', // Medium gray
                    text: '#f9fafb', // Light gray
                    success: '#10b981', // Green
                    warning: '#f59e0b', // Amber
                    danger: '#ef4444', // Red
                },
                // Dave character colors
                dave: {
                    skin: '#fbbf24',
                    shirt: '#3b82f6',
                    pants: '#7c3aed',
                },
                // Level environment colors
                level: {
                    ground: '#8b5cf6',
                    wall: '#6b7280',
                    platform: '#f97316',
                    danger: '#dc2626',
                    collectible: '#fbbf24',
                }
            },
            fontFamily: {
                'game': ['monospace'],
                'pixel': ['monospace'],
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                'pulse-fast': 'pulse 1s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            aspectRatio: {
                'game': '16 / 10', // Classic game aspect ratio
            },
        },
    },
    plugins: [],
} 