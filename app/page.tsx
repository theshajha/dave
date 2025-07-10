'use client';

import GameCanvas from '@/components/game/GameCanvas';
import GameUI from '@/components/game/GameUI';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function GamePage() {
    return (
        <ErrorBoundary fallback={<p>Something went wrong with the game.</p>}>
            <main className="flex items-center justify-center min-h-screen p-4">
                <div className="relative w-full max-w-[1280px] aspect-[1280/600]">
                    <GameCanvas />
                    <GameUI />
                </div>
            </main>
        </ErrorBoundary>
    );
} 