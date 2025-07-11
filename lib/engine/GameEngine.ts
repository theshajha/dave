import { GAME_CONFIG, GAME_STATES, GameStateType } from '@/lib/utils/constants';
import { GameConfig, GameState } from '@/lib/utils/types';
import { optimizeCanvas, resizeCanvas } from './core/canvas';
import { initLoop } from './core/loop';
import { setupInputEventListeners } from './init/events';
import { nextLevel, restartGame, startNewGame } from './init/gameplay';
import { initializeSystems } from './init/systems';

// Light-weight wrapper that wires every feature together. All heavy logic lives in helper modules.
export class GameEngine {
    [key: string]: any; // allow dynamic feature injection
    // loop handlers patched in by initLoop
    start!: () => void;
    stop!: () => void;
    pause!: () => void;
    resume!: () => void;

    constructor(public canvas: HTMLCanvasElement, cfg: Partial<GameConfig> = {}) {
        this.config = { ...GAME_CONFIG, ...cfg };
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D rendering context');
        }
        this.context = context;
        optimizeCanvas(canvas);
        resizeCanvas(canvas, this.config);

        this.gameState = this.createInitialState();
        this.currentGameStateType = GAME_STATES.LOADING;

        initLoop(this); // patches start/stop/pause/resume & main loop
    }

    // Framework lifecycle
    async initialize() {
        await initializeSystems(this);
        setupInputEventListeners(this);
        this.setState(GAME_STATES.MENU);
        this.isInitialized = true;
    }

    // State helpers injected by gameplay.ts
    startNewGame() { startNewGame(this); }
    restartGame() { restartGame(this); }
    nextLevel() { nextLevel(this); }

    // Simple event system
    private ev = new Map<string, Function[]>();
    on(e: string, cb: Function) { (this.ev.get(e) ?? this.ev.set(e, []).get(e)!).push(cb); }
    off(e: string, cb: Function) { this.ev.set(e, (this.ev.get(e) || []).filter(f => f !== cb)); }
    emit(e: string, data?: any) { (this.ev.get(e) || []).forEach(f => f(data)); }

    // Game-state helpers
    setState(s: GameStateType) { this.currentGameStateType = s; }
    get state(): GameState { return this.gameState; }
    get currentState(): GameStateType { return this.currentGameStateType; }

    // Utils
    private createInitialState(): GameState {
        return {
            score: 0,
            lives: this.config.player.lives,
            currentLevel: 1,
            isPaused: false,
            isGameOver: false,
            isLevelComplete: false,
        } as GameState;
    }

    // Cleanup method
    destroy(): void {
        if (this.stop) {
            this.stop();
        }
        // Clean up any resources
        this.ev.clear();
        console.log('Game engine destroyed');
    }
}