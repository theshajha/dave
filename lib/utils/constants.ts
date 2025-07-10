import { GameConfig } from './types';

// Game world constants
export const GAME_CONFIG: GameConfig = {
    canvas: {
        // Native resolution (1×) that the game logic works in
        width: 1280,
        height: 480,
        // How many CSS pixels each logical pixel is expanded to
        scale: 1, // final CSS size = 1280 x 800 (crisp-pixels)
    },
    physics: {
        gravity: 320,            // pixels / s²  (matches DOS pace)
        friction: 0.85,          // velocity retained each frame (1/60 s)
        jumpForce: -320,         // initial jump velocity (px/s)  → ~6-tile jump arc
        maxVelocity: { x: 80, y: 600 }, // clamp horizontal / vertical speed
    },
    player: {
        speed: 20,               // desired walking speed at full run (px/s)
        acceleration: 100,       // pixels / s^2
        jumpHeight: 96,          // target jump height in px (unused directly)
        lives: 3,
    },
    audio: {
        masterVolume: 0.7,
        sfxVolume: 0.8,
        musicVolume: 0.6,
    },
    debug: {
        showBounds: true,
        showFPS: true,
        showGrid: false,
    },
};

// Tile constants (16x16 pixels each, matching original game)
export const TILE_SIZE = 16;
export const TILES_PER_ROW = GAME_CONFIG.canvas.width / TILE_SIZE;  // 320 / 16 = 20
export const TILES_PER_COLUMN = GAME_CONFIG.canvas.height / TILE_SIZE; // 200 / 16 = 12.5 -> 12

// Level constants
export const LEVEL_WIDTH = 100; // tiles
export const LEVEL_HEIGHT = 10; // tiles
export const TOTAL_LEVELS = 10;
export const WARP_ZONE_LEVELS = [5, 8, 9, 10]; // 1-based level numbers

// Player constants
export const PLAYER_START_LIVES = 3;
export const PLAYER_SIZE = { width: 16, height: 24 };
export const PLAYER_SPEED = 4;
export const JUMP_VELOCITY = -16;
export const GRAVITY = 0.8;
export const FRICTION = 0.85;

// Collision constants
export const COLLISION_TOLERANCE = 2; // pixels

// Animation constants
export const ANIMATION_SPEED = 0.15; // seconds per frame
export const IDLE_ANIMATION_SPEED = 0.3;
export const WALK_ANIMATION_SPEED = 0.12;

// Score constants
export const SCORES = {
    TROPHY: 1000,
    COIN: 100,
    GEM: 500,
    ENEMY_KILL: 200,
    LEVEL_COMPLETE: 2000,
    EXTRA_LIFE_THRESHOLD: 20000, // Get extra life every 20k points
} as const;

// Tile IDs (based on original game sprites)
export const TILE_IDS = {
    EMPTY: 0,
    GROUND: 1,
    WALL: 2,
    PLATFORM: 3,
    LADDER: 4,
    DOOR_CLOSED: 5,
    DOOR_OPEN: 6,
    SPIKES: 7,
    WATER: 8,
    LAVA: 9,
    TROPHY: 10,
    COIN: 11,
    GEM: 12,
    ENEMY_SPIDER: 20,
    ENEMY_FIRE: 21,
    ENEMY_CRUSHER: 22,
    WARP_ZONE: 30,
} as const;

// Key mappings
export const DEFAULT_KEYS = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    JUMP: 'Space',
    ACTION: 'ArrowUp',
    DOWN: 'ArrowDown',
    PAUSE: 'Escape',
    RESTART: 'KeyR',
    MUTE: 'KeyM',
} as const;

// Touch control constants
export const TOUCH_CONTROLS = {
    DPAD_SIZE: 80,
    BUTTON_SIZE: 60,
    CONTROL_MARGIN: 20,
    OPACITY_ACTIVE: 0.8,
    OPACITY_INACTIVE: 0.4,
} as const;

// Camera constants
export const CAMERA_CONFIG = {
    FOLLOW_SPEED: 0.1,
    DEAD_ZONE: { width: 100, height: 60 },
    BOUNDS_MARGIN: 50,
    SMOOTH_FACTOR: 0.15,
} as const;

// Audio constants
export const AUDIO_CONFIG = {
    MAX_CONCURRENT_SOUNDS: 8,
    FADE_DURATION: 0.5,
    MUSIC_LOOP: true,
    SFX_VOLUME: 0.8,
    MUSIC_VOLUME: 0.6,
} as const;

// Performance constants
export const PERFORMANCE_CONFIG = {
    TARGET_FPS: 60,
    MAX_DELTA_TIME: 1000 / 30, // 30 FPS minimum
    FRAME_SAMPLE_SIZE: 60,
    ENTITY_CULLING_MARGIN: 100,
} as const;

// Debug colors
export const DEBUG_COLORS = {
    PLAYER_BOUNDS: '#00ff00',
    ENEMY_BOUNDS: '#ff0000',
    COLLECTIBLE_BOUNDS: '#ffff00',
    SOLID_TILE_BOUNDS: '#0000ff',
    CAMERA_BOUNDS: '#ff00ff',
    GRID: '#333333',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    SAVE_DATA: 'dave-game-save',
    SETTINGS: 'dave-game-settings',
    HIGH_SCORES: 'dave-game-scores',
} as const;

// Game events
export const GAME_EVENTS = {
    PLAYER_MOVE: 'player-move',
    PLAYER_JUMP: 'player-jump',
    PLAYER_LAND: 'player-land',
    PLAYER_HURT: 'player-hurt',
    PLAYER_DIE: 'player-die',
    COLLECTIBLE_COLLECTED: 'collectible-collected',
    ENEMY_HIT: 'enemy-hit',
    LEVEL_COMPLETE: 'level-complete',
    GAME_OVER: 'game-over',
    PAUSE: 'pause',
    RESUME: 'resume',
} as const;

// Sprite sheet configurations
export const SPRITE_CONFIG = {
    DAVE: {
        frameWidth: 16,
        frameHeight: 24,
        animations: {
            idle: { frames: [0], duration: 1000, loop: true },
            walk: { frames: [1, 2, 3, 2], duration: 400, loop: true },
            jump: { frames: [4], duration: 500, loop: false },
            fall: { frames: [5], duration: 500, loop: false },
            climb: { frames: [6, 7], duration: 600, loop: true },
        },
    },
    ENEMIES: {
        spider: {
            frameWidth: 16,
            frameHeight: 16,
            animations: {
                move: { frames: [0, 1], duration: 800, loop: true },
            },
        },
        fire: {
            frameWidth: 16,
            frameHeight: 24,
            animations: {
                burn: { frames: [0, 1, 2, 1], duration: 600, loop: true },
            },
        },
    },
    COLLECTIBLES: {
        trophy: {
            frameWidth: 16,
            frameHeight: 16,
            animations: {
                shine: { frames: [0, 1, 2, 1], duration: 1000, loop: true },
            },
        },
        coin: {
            frameWidth: 12,
            frameHeight: 12,
            animations: {
                spin: { frames: [0, 1, 2, 3], duration: 800, loop: true },
            },
        },
    },
} as const;

// Game state constants
export const GAME_STATES = {
    MENU: 'menu',
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'game-over',
    LEVEL_COMPLETE: 'level-complete',
    VICTORY: 'victory',
    LOADING: 'loading',
} as const;

export type GameStateType = typeof GAME_STATES[keyof typeof GAME_STATES]; 