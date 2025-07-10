'use client';

import React, { useCallback, useRef, useState } from 'react';

export default function MobileControls() {
    const [activeControls, setActiveControls] = useState({
        left: false,
        right: false,
        jump: false,
    });

    const touchStartRef = useRef<{ [key: string]: number }>({});

    // Handle touch events for directional pad
    const handleDPadTouch = useCallback((direction: 'left' | 'right', isActive: boolean) => {
        setActiveControls(prev => ({
            ...prev,
            [direction]: isActive,
        }));

        // Emit game input events here
        // This will be connected to the input manager
        if (isActive) {
            console.log(`Touch input: ${direction} start`);
        } else {
            console.log(`Touch input: ${direction} end`);
        }
    }, []);

    // Handle jump button
    const handleJumpTouch = useCallback((isActive: boolean) => {
        setActiveControls(prev => ({
            ...prev,
            jump: isActive,
        }));

        if (isActive) {
            console.log('Touch input: jump start');
        } else {
            console.log('Touch input: jump end');
        }
    }, []);

    // Generic touch event handlers
    const createTouchHandler = (action: () => void, releaseAction?: () => void) => ({
        onTouchStart: (e: React.TouchEvent) => {
            e.preventDefault();
            action();
        },
        onTouchEnd: (e: React.TouchEvent) => {
            e.preventDefault();
            releaseAction?.();
        },
        onTouchCancel: (e: React.TouchEvent) => {
            e.preventDefault();
            releaseAction?.();
        },
    });

    return (
        <>
            {/* Directional Pad */}
            <div className="touch-dpad">
                <div className="relative w-full h-full">
                    {/* Left button */}
                    <button
                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 
                       rounded-l-full border-r border-game-accent/30 flex items-center justify-center
                       transition-colors duration-100 select-none
                       ${activeControls.left ? 'bg-game-accent text-game-background' : 'text-game-text'}`}
                        {...createTouchHandler(
                            () => handleDPadTouch('left', true),
                            () => handleDPadTouch('left', false)
                        )}
                    >
                        ◀
                    </button>

                    {/* Right button */}
                    <button
                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 
                       rounded-r-full border-l border-game-accent/30 flex items-center justify-center
                       transition-colors duration-100 select-none
                       ${activeControls.right ? 'bg-game-accent text-game-background' : 'text-game-text'}`}
                        {...createTouchHandler(
                            () => handleDPadTouch('right', true),
                            () => handleDPadTouch('right', false)
                        )}
                    >
                        ▶
                    </button>

                    {/* Center indicator */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-game-accent/40 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Jump Button */}
            <button
                className={`touch-button transition-all duration-100 select-none
                   ${activeControls.jump
                        ? 'bg-game-primary border-game-primary scale-95'
                        : 'bg-game-accent/80 border-game-accent'
                    }`}
                {...createTouchHandler(
                    () => handleJumpTouch(true),
                    () => handleJumpTouch(false)
                )}
            >
                <span className="text-lg font-bold">↑</span>
            </button>

            {/* Additional buttons for smaller screens */}
            <div className="fixed bottom-4 right-20 space-y-2 z-40">
                {/* Pause button */}
                <button
                    className="w-12 h-8 bg-game-surface/80 border border-game-accent/50 
                     rounded text-xs text-game-text flex items-center justify-center
                     active:bg-game-accent active:text-game-background
                     transition-colors duration-100 select-none"
                    onClick={() => console.log('Pause button pressed')}
                >
                    ⏸
                </button>
            </div>

            {/* Touch feedback overlay */}
            <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 
                      px-3 py-1 bg-game-surface/60 rounded text-xs text-game-text/60 
                      pixel-text z-30">
                Touch Controls Active
            </div>
        </>
    );
} 