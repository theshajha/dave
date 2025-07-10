// Core game types
export interface Vector2D {
    x: number;
    y: number;
}

export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface GameState {
    isRunning: boolean;
    isPaused: boolean;
    currentLevel: number;
    lives: number;
    score: number;
    isGameOver: boolean;
    isLevelComplete: boolean;
    isInWarpZone: boolean;
}

export interface InputState {
    left: boolean;
    right: boolean;
    jump: boolean;
    action: boolean;
    down: boolean;
    pause: boolean;
}

// Entity types
export interface Entity {
    id: string;
    position: Vector2D;
    velocity: Vector2D;
    bounds: Bounds;
    isActive: boolean;
    isVisible: boolean;
}

export interface Player extends Entity {
    lives: number;
    isGrounded: boolean;
    isFalling: boolean;
    isJumping: boolean;
    direction: 'left' | 'right';
    animationState: PlayerAnimationState;
}

export type PlayerAnimationState =
    | 'idle'
    | 'walking'
    | 'jumping'
    | 'falling'
    | 'climbing';

export interface Enemy extends Entity {
    type: EnemyType;
    movementPattern: MovementPattern;
    health: number;
    damage: number;
}

export type EnemyType =
    | 'spider'
    | 'fire'
    | 'crusher'
    | 'shooter';

export type MovementPattern =
    | 'stationary'
    | 'patrol'
    | 'follow'
    | 'vertical'
    | 'circular';

export interface Collectible extends Entity {
    type: CollectibleType;
    value: number;
    isCollected: boolean;
}

export type CollectibleType =
    | 'trophy'
    | 'coin'
    | 'gem'
    | 'key'
    | 'powerup'
    | 'extraLife';

// Level and tile types
export interface Tile {
    id: number;
    type: TileType;
    isSolid: boolean;
    isDangerous: boolean;
    isCollectible: boolean;
    sprite: string;
}

export type TileType =
    | 'empty'
    | 'ground'
    | 'wall'
    | 'platform'
    | 'ladder'
    | 'door'
    | 'spikes'
    | 'water'
    | 'lava';

export interface Level {
    id: number;
    name: string;
    width: number;
    height: number;
    tileSize: number;
    tiles: number[][];
    entities: Entity[];
    playerStart: Vector2D;
    exitDoor: Vector2D;
    warpZones?: WarpZone[];
    backgroundMusic?: string;
}

export interface WarpZone {
    entrance: Vector2D;
    targetLevel: number;
    targetPosition: Vector2D;
}

// Rendering types
export interface Sprite {
    id: string;
    image: HTMLImageElement;
    frameWidth: number;
    frameHeight: number;
    frameCount: number;
    animations: Animation[];
}

export interface Animation {
    name: string;
    frames: number[];
    duration: number;
    loop: boolean;
}

export interface RenderContext {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    camera: Camera;
    deltaTime: number;
}

export interface Camera {
    position: Vector2D;
    bounds: Bounds;
    target?: Entity;
    followSpeed: number;
}

// Audio types
export interface AudioClip {
    id: string;
    buffer: AudioBuffer;
    volume: number;
    loop: boolean;
}

export interface SoundEffect extends AudioClip {
    category: 'sfx' | 'music' | 'voice';
}

// Game configuration
export interface GameConfig {
    canvas: { width: number; height: number; scale: number };
    physics: { gravity: number; friction: number; jumpForce: number; maxVelocity: { x: number; y: number } };
    player: { speed: number; acceleration: number; jumpHeight: number; lives: number };
    audio: { masterVolume: number; sfxVolume: number; musicVolume: number };
    debug: { showBounds: boolean; showFPS: boolean; showGrid: boolean };
}

// Storage types
export interface SaveData {
    currentLevel: number;
    lives: number;
    score: number;
    highScore: number;
    unlockedLevels: number[];
    settings: GameSettings;
    timestamp: number;
}

export interface GameSettings {
    volume: {
        master: number;
        sfx: number;
        music: number;
    };
    controls: {
        keyboard: KeyMapping;
        touch: TouchSettings;
    };
    graphics: {
        scale: number;
        fullscreen: boolean;
        showFPS: boolean;
    };
}

export interface KeyMapping {
    left: string;
    right: string;
    jump: string;
    action: string;
    pause: string;
}

export interface TouchSettings {
    enabled: boolean;
    dpadOpacity: number;
    buttonOpacity: number;
    sensitivity: number;
}

// Event types
export type GameEvent =
    | 'engine-initialized'
    | 'player-move'
    | 'player-jump'
    | 'player-land'
    | 'player-hurt'
    | 'player-die'
    | 'collectible-collected'
    | 'enemy-hit'
    | 'level-complete'
    | 'game-over'
    | 'pause'
    | 'resume'
    | 'settings-changed';

export interface GameEventData {
    type: GameEvent;
    timestamp: number;
    data?: any;
}

// Utility types
export type Direction = 'left' | 'right' | 'up' | 'down';
export type CollisionSide = 'top' | 'bottom' | 'left' | 'right';

export interface CollisionResult {
    hasCollision: boolean;
    side?: CollisionSide;
    entity?: Entity;
    tile?: Tile;
}

// Performance monitoring
export interface PerformanceMetrics {
    fps: number;
    frameTime: number;
    updateTime: number;
    renderTime: number;
    entityCount: number;
    memoryUsage: number;
}

export interface CollisionBox {
    x: number;
    y: number;
    width: number;
    height: number;
} 