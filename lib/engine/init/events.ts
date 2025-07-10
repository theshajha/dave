import { GAME_STATES } from '@/lib/utils/constants';
import { GameEngine } from '../GameEngine';

export function setupInputEventListeners(engine: GameEngine): void {
    const input = (engine as any).inputManager;
    if (!input) return;

    input.on('key-jump-down', () => {
        switch ((engine as any).currentGameStateType) {
            case GAME_STATES.MENU:
                (engine as any).startNewGame();
                break;
            case GAME_STATES.GAME_OVER:
                (engine as any).restartGame();
                break;
            case GAME_STATES.LEVEL_COMPLETE:
                (engine as any).nextLevel();
                break;
        }
    });

    input.on('key-pause-down', () => {
        switch ((engine as any).currentGameStateType) {
            case GAME_STATES.PLAYING:
                (engine as any).setState(GAME_STATES.PAUSED);
                break;
            case GAME_STATES.PAUSED:
                (engine as any).setState(GAME_STATES.PLAYING);
                break;
        }
    });

    console.log('Input event listeners set up');
} 