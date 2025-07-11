'use client';

import { useEffect, useState } from 'react';

export default function MobileRotationPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                                   'ontouchstart' in window || 
                                   navigator.maxTouchPoints > 0;
            
            setIsMobile(isMobileDevice);
            
            if (isMobileDevice) {
                const isPortrait = window.innerHeight > window.innerWidth;
                setShowPrompt(isPortrait);
            }
        };

        // Check initially
        checkOrientation();

        // Listen for orientation changes
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!isMobile || !showPrompt) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] bg-game-background flex items-center justify-center p-6">
            <div className="text-center space-y-6 max-w-sm">
                {/* Phone rotation icon */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-16 h-24 border-4 border-game-accent rounded-lg flex items-center justify-center animate-pulse">
                            <div className="w-8 h-1 bg-game-accent rounded"></div>
                        </div>
                        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                            <svg 
                                className="w-6 h-6 text-game-accent animate-bounce" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Text content */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-game-accent pixel-text">
                        Rotate Your Device
                    </h2>
                    <p className="text-game-text text-lg leading-relaxed">
                        This game is optimized for
                        <span className="text-game-accent font-bold"> landscape mode</span>.
                    </p>
                    <p className="text-game-text/80 text-sm">
                        Please turn your device sideways for the best gaming experience.
                    </p>
                </div>

                {/* Game title for context */}
                <div className="pt-4 border-t border-game-accent/30">
                    <p className="text-game-accent font-bold text-lg pixel-text">
                        DANGEROUS DAVE
                    </p>
                    <p className="text-game-text/60 text-xs">
                        Classic Platformer Adventure
                    </p>
                </div>
            </div>
        </div>
    );
}