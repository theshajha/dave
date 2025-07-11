import { SpriteSheet } from '@/lib/engine/SpriteSheet';
import { GAME_CONFIG } from '@/lib/utils/constants';
import { CollisionBox, PlayerAnimationState, Vector2D } from '@/lib/utils/types';

export class PlayerBase {
    // Fundamental state
    public position: Vector2D;
    public velocity: Vector2D;
    public size: Vector2D;

    // Movement & physics tuning
    public maxSpeed = GAME_CONFIG.player.speed;
    public acceleration = GAME_CONFIG.player.acceleration;
    public jumpPower = Math.abs(GAME_CONFIG.physics.jumpForce);
    public friction = GAME_CONFIG.physics.friction;

    // Status flags
    public state: PlayerAnimationState = 'idle'; // e.g. 'idle' | 'walking' | 'jumping' | 'falling' | ...
    public isGrounded = false;
    public isClimbing = false;
    public isAlive = true;

    // Meta
    public lives = GAME_CONFIG.player.lives;
    public score = 0;

    // Animation
    public direction: 'left' | 'right' = 'right';
    protected animationFrame = 0;
    protected animationTimer = 0;
    protected animationSpeed = 0.32;

    // Collision box
    public collisionBox: CollisionBox;

    // Inventory
    public hasGun = false;
    public hasKey = false;
    public hasTrophy = false;
    public jetpackFuel = 0;

    // Shared sprite sheet
    public static spriteSheet: SpriteSheet | null = null;
    public static readonly SPRITE_FRAME_WIDTH = 28;
    public static readonly SPRITE_FRAME_HEIGHT = 48;
    public static readonly DRAW_SCALE = 1;

    constructor(x: number = 100, y: number = 100) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.size = { x: 16, y: 24 };

        this.collisionBox = {
            x: x + 2,
            y: y + 2,
            width: this.size.x - 4,
            height: this.size.y - 2,
        };

        if (!PlayerBase.spriteSheet) {
            PlayerBase.spriteSheet = new SpriteSheet('/assets/sprites/dave.png', {
                frameWidth: PlayerBase.SPRITE_FRAME_WIDTH,
                frameHeight: PlayerBase.SPRITE_FRAME_HEIGHT,
                rows: 1,
                columns: 7,
            });

            PlayerBase.spriteSheet.load().catch(err =>
                console.warn('Failed to load Dave sprite', err)
            );
        }
    }
}