'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Game Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="flex items-center justify-center h-screen bg-game-background">
                        <div className="game-panel text-center space-y-4 max-w-md">
                            <h2 className="text-2xl pixel-text text-game-danger">
                                Game Error
                            </h2>
                            <p className="text-game-text/80">
                                Something went wrong while loading the game.
                            </p>
                            <p className="text-sm text-game-text/60 font-mono">
                                {this.state.error?.message}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="game-button"
                            >
                                Reload Game
                            </button>
                        </div>
                    </div>
                )
            );
        }

        return this.props.children;
    }
} 