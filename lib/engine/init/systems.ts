import { Player } from '@/lib/entities/player';
import { LEVEL1_GRID } from '@/lib/levels/level1';
import { LEVEL2_GRID } from '@/lib/levels/level2';
import { LEVEL3_GRID } from '@/lib/levels/level3';
import { GameEngine } from '../GameEngine';
import { InputManager } from '../input';
import { Level as LevelClass } from '../Level';
import { PhysicsEngine } from '../physics';

function getLevelGrid(num: number): (string | number)[][] | null {
    try {
        switch (num) {
            case 1: return LEVEL1_GRID;
            case 2: return LEVEL2_GRID;
            case 3: return LEVEL3_GRID;
            default: 
                console.warn(`Level ${num} not found, using Level 1 as fallback`);
                return LEVEL1_GRID;
        }
    } catch (error) {
        console.error('Error loading level grid:', error);
        return null;
    }
}

// Bootstraps Input, Physics, Level, Player and connects them together.
export async function initializeSystems(engine: GameEngine): Promise<void> {
    const canvas = (engine as any).canvas as HTMLCanvasElement;

    try {
        // Init subsystems
        const input = new InputManager();
        const physics = new PhysicsEngine();
        const grid = getLevelGrid(1);
        
        if (!grid) {
            throw new Error('Failed to load level grid');
        }
        
        const level = new LevelClass(1, grid);
        const start = level.getPlayerStartPosition();
        const player = new Player(start.x, start.y);

        // Wire references
        physics.setLevel(level);
        physics.setPlayer(player);

        // Store on engine instance for global access
        Object.assign(engine, {
            inputManager: input,
            physicsEngine: physics,
            currentLevel: level,
            player,
        });

        // Sync game state
        (engine as any).gameState.lives = player.lives;
        (engine as any).gameState.score = player.score;

        console.log('All systems initialized and connected');
    } catch (error) {
        console.error('Failed to initialize game systems:', error);
        throw error;
    }
} 