'use client';

import GameLoadingScreen from '@/components/game/GameLoadingScreen';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), {
    ssr: false,
    loading: () => <GameLoadingScreen />,
});

export default function GamePage() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<GameLoadingScreen />}>
                <GameCanvas />
            </Suspense>
        </ErrorBoundary>
    );
} 