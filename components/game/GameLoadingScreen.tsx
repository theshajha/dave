export default function GameLoadingScreen() {
    return (
        <div className="flex items-center justify-center h-screen bg-game-background">
            <div className="text-center space-y-4">
                <div className="loading-spinner"></div>
                <h2 className="text-2xl pixel-text text-game-accent">
                    Loading Dangerous Dave...
                </h2>
                <p className="text-game-text/60 pixel-text">
                    Preparing your adventure
                </p>
            </div>
        </div>
    );
} 