import { GAME_STATES } from '@/lib/utils/constants';
import { GameEngine } from '../../GameEngine';

// Handles core gameplay logic frame-by-frame while in the PLAYING state.
export function updatePlaying(engine: GameEngine, dt: number): void {
    const input = (engine as any).inputManager;
    if (input) {
        input.update(dt);
        if (input.isPressed('pause')) {
            engine.setState(GAME_STATES.PAUSED);
            return;
        }
    }

    const player = (engine as any).player;
    if (player && input) player.update(dt, input);

    const physics = (engine as any).physicsEngine;
    if (physics) {
        physics.update(dt);
        if (physics.checkLevelCompletion()) {
            engine.setState(GAME_STATES.LEVEL_COMPLETE);
            return;
        }
    }

    // Sync HUD data + game-over check
    if (player) {
        engine.state.lives = player.lives;
        engine.state.score = player.score;
        if (!player.isAlive || player.lives <= 0) {
            engine.setState(GAME_STATES.GAME_OVER);
            return;
        }
    }

    if (physics) (engine as any).performanceMetrics.entityCount = 2; // Player + Level
} 