'use client';

import { GameEngine } from '@/lib/engine/GameEngine';
import { GAME_CONFIG, GAME_STATES } from '@/lib/utils/constants';
import { DOMUtils } from '@/lib/utils/helpers';
import { useCallback, useEffect, useRef, useState } from 'react';
import DebugInfo from './DebugInfo';
import GameUI from './GameUI';
import MobileRotationPrompt from '../ui/MobileRotationPrompt';

interface GameCanvasProps {
    className?: string;
}

interface GameUIProps {
    engine: GameEngine | null;
    className?: string;
}

export default function GameCanvas({ className = '' }: GameCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameEngineRef = useRef<GameEngine | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize game engine
    useEffect(() => {
        const initializeGame = async () => {
            try {
                const canvas = canvasRef.current;
                if (!canvas) {
                    throw new Error('Canvas element not found');
                }

                console.log('Initializing game engine...');

                // Create game engine instance
                const gameEngine = new GameEngine(canvas, {
                    canvas: {
                        width: GAME_CONFIG.canvas.width,
                        height: GAME_CONFIG.canvas.height,
                        scale: GAME_CONFIG.canvas.scale,
                    },
                    debug: {
                        showFPS: false,
                        showBounds: false,
                        showGrid: false,
                    },
                });

                // Initialize and start the engine
                await gameEngine.initialize();
                gameEngine.start();

                gameEngineRef.current = gameEngine;
                setIsLoading(false);

                console.log('Game engine ready!');

            } catch (err) {
                console.error('Failed to initialize game:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setIsLoading(false);
            }
        };

        initializeGame();

        // Cleanup on unmount
        return () => {
            if (gameEngineRef.current) {
                gameEngineRef.current.destroy();
                gameEngineRef.current = null;
            }
        };
    }, []);

    // Handle canvas click for mobile play button
    const handleCanvasClick = useCallback(() => {
        if (gameEngineRef.current) {
            const engine = gameEngineRef.current;
            // Check if we're in menu state and start the game
            if (engine.state && (engine.state.currentState === GAME_STATES.MENU || engine.currentState === GAME_STATES.MENU)) {
                engine.setState(GAME_STATES.PLAYING);
            }
        }
    }, []);

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-game-background">
                <div className="game-panel text-center space-y-4">
                    <h3 className="text-xl pixel-text text-game-danger">
                        Failed to load game
                    </h3>
                    <p className="text-game-text/80 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="game-button"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <MobileRotationPrompt />
            <div className={`game-view-container flex flex-col items-center justify-center w-full h-full ${className}`}>
                <div className="relative w-full flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        className="game-element gpu-accelerated game-canvas"
                        width={GAME_CONFIG.canvas.width}
                        height={GAME_CONFIG.canvas.height}
                        onClick={handleCanvasClick}
                        onTouchStart={handleCanvasClick}
                        style={{
                            imageRendering: 'pixelated',
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }}
                    />
                    <GameUI engine={gameEngineRef.current} />
                </div>

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-game-background">
                        <div className="text-center space-y-4">
                            <div className="loading-spinner"></div>
                            <p className="pixel-text text-game-text">
                                Initializing game engine...
                            </p>
                        </div>
                    </div>
                )}

                {!isLoading && process.env.NODE_ENV === 'development' && (
                    <DebugInfo engine={gameEngineRef.current} />
                )}
            </div>
        </>
    );
} 