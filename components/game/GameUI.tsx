'use client';

import { GameEngine } from '@/lib/engine/GameEngine';
import { DOMUtils } from '@/lib/utils/helpers';
import { useEffect, useState } from 'react';
import MobileControls from './MobileControls';

interface GameUIProps {
    engine: GameEngine | null;
    className?: string;
}

export default function GameUI({ engine, className = '' }: GameUIProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(DOMUtils.isTouch());
    }, []);

    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`}>
            <GameHUD engine={engine} />
            {isMobile && <MobileControls />}
            {!isMobile && <GameInstructions />}
        </div>
    );
}

function GameHUD({ engine }: { engine: GameEngine | null }) {
    const [gameState, setGameState] = useState({ score: 0, lives: 0, level: 1, isPaused: false });

    useEffect(() => {
        if (!engine) return;
        const update = () => {
            setGameState({
                score: (engine as any).player?.score ?? 0,
                lives: (engine as any).player?.lives ?? 0,
                level: engine.state.currentLevel,
                isPaused: engine.state.isPaused,
            });
        };
        const handle = setInterval(update, 100);
        return () => clearInterval(handle);
    }, [engine]);

    return (
        <div className="game-hud pointer-events-auto">
            <div className="flex items-center space-x-6">
                <div>SCORE: {gameState.score.toLocaleString()}</div>
                <div>
                    <span>LIVES:</span>
                    {Array.from({ length: gameState.lives }).map((_, i) => (
                        <span key={i}>♥</span>
                    ))}
                </div>
                <div>LEVEL: {gameState.level}</div>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={() => engine?.pause()}>
                    {gameState.isPaused ? '▶' : '⏸'}
                </button>
                <div>ESC: Pause</div>
            </div>
        </div>
    );
}

function GameInstructions() {
    const [showInstructions, setShowInstructions] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowInstructions(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!showInstructions) return null;

    return (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-game-surface/90 backdrop-blur-sm border border-game-accent/50 rounded-lg px-4 py-2 text-sm pixel-text text-game-text text-center animate-fade-in pointer-events-auto">
            <div className="space-y-1">
                <div>Arrow Keys: Move • Space: Jump • Esc: Pause</div>
                <div className="text-xs text-game-text/60">
                    Collect trophies and reach the door to complete each level!
                </div>
            </div>
            <button onClick={() => setShowInstructions(false)} className="absolute top-1 right-2 text-xs text-game-text/60 hover:text-game-text">
                ✕
            </button>
        </div>
    );
} 