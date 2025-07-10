import { Player } from '@/lib/entities/player';
import { LEVEL1_GRID } from '@/lib/levels/level1';
import { LEVEL2_GRID } from '@/lib/levels/level2';
import { LEVEL3_GRID } from '@/lib/levels/level3';
import { GAME_CONFIG, GAME_STATES } from '@/lib/utils/constants';
import { GameEngine } from '../GameEngine';
import { Level as LevelClass } from '../Level';

// Helper to retrieve a level grid by number
function getLevelGrid(num: number): (string | number)[][] | null {
    switch (num) {
        case 1: return LEVEL1_GRID;
        case 2: return LEVEL2_GRID;
        case 3: return LEVEL3_GRID;
        default: return null;
    }
}

export function startNewGame(engine: GameEngine): void {
    const gs = (engine as any).gameState;
    gs.currentLevel = 1;
    gs.isGameOver = false;
    gs.isLevelComplete = false;

    const grid = getLevelGrid(1)!; // guaranteed non-null
    const level = new LevelClass(1, grid);
    const start = level.getPlayerStartPosition();
    const player = new Player(start.x, start.y);
    (engine as any).currentLevel = level;
    (engine as any).player = player;

    if ((engine as any).physicsEngine) {
        (engine as any).physicsEngine.setLevel(level);
        (engine as any).physicsEngine.setPlayer(player);
    }

    gs.lives = player.lives;
    gs.score = player.score;

    (engine as any).setState(GAME_STATES.PLAYING);
    console.log('New game started');
}

export function restartGame(engine: GameEngine): void {
    const level = (engine as any).currentLevel;
    let player = (engine as any).player;

    if (level && player) {
        level.reset();
        const start = level.getPlayerStartPosition();
        player.reset(start.x, start.y);
        player.lives = GAME_CONFIG.player.lives;
        player.score = 0;

        const gs = (engine as any).gameState;
        gs.lives = player.lives;
        gs.score = player.score;
        gs.isGameOver = false;

        (engine as any).setState(GAME_STATES.PLAYING);
        console.log('Game restarted');
    } else {
        startNewGame(engine);
    }
}

export function nextLevel(engine: GameEngine): void {
    const gs = (engine as any).gameState;
    gs.currentLevel += 1;

    const grid = getLevelGrid(gs.currentLevel);

    // If we run out of levels, show the victory screen
    if (!grid) {
        (engine as any).setState(GAME_STATES.VICTORY);
        console.log('All levels completed – victory!');
        return;
    }

    const level = new LevelClass(gs.currentLevel, grid);
    (engine as any).currentLevel = level;

    const player = (engine as any).player as Player;
    const start = level.getPlayerStartPosition();
    player.reset(start.x, start.y);

    if ((engine as any).physicsEngine) {
        (engine as any).physicsEngine.setLevel(level);
        (engine as any).physicsEngine.setPlayer(player);
    }

    (engine as any).setState(GAME_STATES.PLAYING);
    console.log(`Level ${gs.currentLevel} started`);
} 