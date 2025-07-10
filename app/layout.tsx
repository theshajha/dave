import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Dangerous Dave - Classic Platformer Game',
    description: 'Modern web recreation of the classic 1988 DOS platformer Dangerous Dave by John Romero. Experience the original gameplay with modern performance and responsive controls.',
    keywords: ['dangerous dave', 'platformer', 'retro game', 'web game', 'classic game', 'pixel art'],
    authors: [{ name: 'Dave Game Team' }],
    creator: 'Dave Game Team',
    publisher: 'Dave Game Team',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
    },
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#f59e0b' },
        { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
    ],
    manifest: '/manifest.json',
    icons: {
        icon: '/icons/favicon.ico',
        shortcut: '/icons/favicon-16x16.png',
        apple: '/icons/apple-touch-icon.png',
    },
    openGraph: {
        title: 'Dangerous Dave - Classic Platformer Game',
        description: 'Modern web recreation of the classic Dangerous Dave platformer',
        url: 'https://dangerous-dave.vercel.app',
        siteName: 'Dangerous Dave',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Dangerous Dave Game Screenshot',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Dangerous Dave - Classic Platformer Game',
        description: 'Modern web recreation of the classic Dangerous Dave platformer',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            </head>
            <body className="min-h-screen bg-game-background text-game-text antialiased overflow-hidden">
                <div className="flex flex-col min-h-screen">
                    <main className="flex-1 flex items-center justify-center p-4">
                        {children}
                    </main>
                </div>

                {/* Performance monitoring script */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              // Basic performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', () => {
                  console.log('Page loaded at:', performance.now());
                });
              }
            `,
                    }}
                />
            </body>
        </html>
    );
} 