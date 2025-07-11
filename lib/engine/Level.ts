import { GAME_CONFIG, SCORES, TILE_SIZE } from '@/lib/utils/constants';
import { Bounds, CollisionBox, Vector2D } from '@/lib/utils/types';
import { AssetUtils } from '../utils/helpers';
import { SpriteSheet } from './SpriteSheet';

export interface LevelTile {
    x: number;
    y: number;
    type: 'empty' | 'ground' | 'platform' | 'wall' | 'spikes' | 'door' | 'lockedDoor' | 'trophy' | 'coin' | 'ladder';
    isSolid: boolean;
    isDangerous: boolean;
    isCollectible: boolean;
    isClimbable: boolean;
    bounds: Bounds;
}

export interface Collectible {
    id: string;
    position: Vector2D;
    type: 'trophy' | 'coin' | 'gem' | 'key' | 'princess';
    value: number;
    collected: boolean;
    bounds: Bounds;
}

/**
 * Level class that manages the game world
 */
export class Level {
    private width: number;
    private height: number;
    private tiles: LevelTile[][] = [];
    private collectibles: Collectible[] = [];
    private playerStartPosition: Vector2D;
    private exitDoor: Vector2D;
    private tileSheet: SpriteSheet;
    private wallImage: HTMLImageElement | null = null;
    private doorImage: HTMLImageElement | null = null;
    private spikeImage: HTMLImageElement | null = null;
    private trophyImage: HTMLImageElement | null = null;
    private coinImage: HTMLImageElement | null = null;
    private gemImage: HTMLImageElement | null = null;
    private keyImage: HTMLImageElement | null = null;
    private lockedDoorImage: HTMLImageElement | null = null;
    private enemyImage: HTMLImageElement | null = null;
    private princessImage: HTMLImageElement | null = null;

    // Moving platforms (e.g., tile value 9) - 3 tiles wide
    private movingObstacles: { x: number; y: number; minX: number; maxX: number; speed: number; dir: 1 | -1; bounds: Bounds }[] = [];
    
    // Moving enemies (e.g., tile value 10 - moths)
    private movingEnemies: { x: number; y: number; minX: number; maxX: number; speed: number; dir: 1 | -1; bounds: Bounds }[] = [];

    // Level properties
    public levelNumber: number;
    public isComplete: boolean = false;
    private totalCollectibles: number = 0;
    private collectedCount: number = 0;
    private keysCollected: number = 0;
    private lockedDoors: Vector2D[] = [];
    private diamondCollected: boolean = false;
    private princessCollected: boolean = false;
    private princessSpawned: boolean = false;
    private princessSpawnPosition: Vector2D | null = null;

    constructor(levelNumber: number = 1, map?: (string | number)[][]) {
        this.levelNumber = levelNumber;
        this.width = Math.floor(GAME_CONFIG.canvas.width / TILE_SIZE);
        this.height = Math.floor(GAME_CONFIG.canvas.height / TILE_SIZE);
        this.playerStartPosition = { x: 100, y: 300 };
        this.exitDoor = { x: 700, y: 500 };
        this.tileSheet = new SpriteSheet('/assets/sprites/tiles.png', {
            frameWidth: 16,
            frameHeight: 16,
            rows: 4,
            columns: 4,
        });
        this.tileSheet.load();
        AssetUtils.loadImage('/assets/sprites/wall.png').then(img => { this.wallImage = img; });
        AssetUtils.loadImage('/assets/sprites/door.png').then(img => { this.doorImage = img; });
        AssetUtils.loadImage('/assets/sprites/spike.png').then(img => { this.spikeImage = img; });
        AssetUtils.loadImage('/assets/sprites/trophy.png').then(img => { this.trophyImage = img; });
        AssetUtils.loadImage('/assets/sprites/coin.png').then(img => { this.coinImage = img; });
        AssetUtils.loadImage('/assets/sprites/diamond.png').then(img => { this.gemImage = img; });
        AssetUtils.loadImage('/assets/sprites/key.png').then(img => { this.keyImage = img; });
        AssetUtils.loadImage('/assets/sprites/locked-door.png').then(img => { this.lockedDoorImage = img; });
        AssetUtils.loadImage('/assets/sprites/moth.png').then(img => { this.enemyImage = img; });
        AssetUtils.loadImage('/assets/sprites/princess.png').then(img => { this.princessImage = img; });

        if (map) {
            this.generateFromGrid(map);
        } else {
            this.generateLevel();
        }
    }

    /** Generate level from provided grid */
    private generateFromGrid(grid: (string | number)[][]): void {
        if (!grid || grid.length === 0) {
            console.error('Invalid grid provided to generateFromGrid');
            return;
        }
        
        this.height = grid.length;
        this.width = grid[0]?.length || 0;
        
        if (this.width === 0) {
            console.error('Grid has no columns');
            return;
        }

        this.tiles = [];
        grid.forEach((row, y) => {
            this.tiles[y] = [];
            row.forEach((cell, x) => {
                let tileType: LevelTile['type'] = 'empty';
                switch (cell) {
                    case 1: tileType = 'ground'; break; // brick wall
                    case 2: tileType = 'door'; this.exitDoor = { x: x * TILE_SIZE, y: y * TILE_SIZE }; break;
                    case 4: tileType = 'ladder'; break; // climbable ladder
                    case 6: tileType = 'spikes'; break;
                    case 13: tileType = 'lockedDoor'; this.lockedDoors.push({ x: x * TILE_SIZE, y: y * TILE_SIZE }); break;
                    case 9: // moving platform (horizontal, 3 tiles wide)
                        this.movingObstacles.push({
                            x: x * TILE_SIZE,
                            y: y * TILE_SIZE,
                            minX: (x * TILE_SIZE) - TILE_SIZE * 5,
                            maxX: (x * TILE_SIZE) + TILE_SIZE * 5,
                            speed: 40,
                            dir: 1,
                            bounds: { x: x * TILE_SIZE, y: y * TILE_SIZE, width: TILE_SIZE * 3, height: TILE_SIZE },
                        });
                        tileType = 'empty';
                        break;
                    case 10: // moving enemy (moth)
                        this.movingEnemies.push({
                            x: x * TILE_SIZE,
                            y: y * TILE_SIZE,
                            minX: (x * TILE_SIZE) - TILE_SIZE * 3,
                            maxX: (x * TILE_SIZE) + TILE_SIZE * 3,
                            speed: 30,
                            dir: 1,
                            bounds: { x: x * TILE_SIZE, y: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE },
                        });
                        tileType = 'empty';
                        break;
                    default: tileType = 'empty';
                }
                const tile = this.createTile(x, y, tileType);
                this.tiles[y][x] = tile;

                // collectibles (3:Coin, 5:Trophy, 7:Gem, 12:Key)
                if (cell === 3 || cell === 5 || cell === 7 || cell === 12) {
                    const val = cell === 5 ? SCORES.TROPHY : (cell === 3 ? SCORES.COIN : (cell === 7 ? SCORES.GEM : 0));
                    const type = cell === 5 ? 'trophy' : (cell === 3 ? 'coin' : (cell === 7 ? 'gem' : 'key'));
                    this.collectibles.push({
                        id: `c-${x}-${y}`,
                        position: { x: x * TILE_SIZE, y: y * TILE_SIZE },
                        type: type as any,
                        value: val,
                        collected: false,
                        bounds: { x: x * TILE_SIZE, y: y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }
                    });
                }

                // Princess spawn position (15)
                if (cell === 15) {
                    this.princessSpawnPosition = { x: x * TILE_SIZE, y: y * TILE_SIZE };
                }

                if (cell === 'P') {
                    this.playerStartPosition = { x: x * TILE_SIZE, y: y * TILE_SIZE };
                }
            });
        });

        this.totalCollectibles = this.collectibles.length;
    }

    /** Returns level width in pixels */
    public getWidthInPixels(): number {
        return this.width * TILE_SIZE;
    }

    /**
     * Generate a basic level layout
     */
    private generateLevel(): void {
        // Initialize empty level
        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = this.createTile(x, y, 'empty');
            }
        }

        // Create ground floor
        for (let x = 0; x < this.width; x++) {
            this.tiles[this.height - 2][x] = this.createTile(x, this.height - 2, 'ground');
            this.tiles[this.height - 1][x] = this.createTile(x, this.height - 1, 'ground');
        }

        // Create some platforms
        this.createPlatform(15, this.height - 6, 8); // Platform 1
        this.createPlatform(30, this.height - 9, 6); // Platform 2
        this.createPlatform(45, this.height - 5, 5); // Platform 3

        // Create walls
        this.createWall(0, 0, this.height);     // Left wall
        this.createWall(this.width - 1, 0, this.height); // Right wall

        // Add some obstacles
        this.addSpikes(20, this.height - 3, 3);
        this.addSpikes(35, this.height - 3, 2);

        // Place collectibles
        this.placeCollectibles();

        // Place exit door
        this.tiles[this.height - 3][this.width - 3] = this.createTile(this.width - 3, this.height - 3, 'door');
    }

    /**
     * Create a tile at the specified position
     */
    private createTile(x: number, y: number, type: LevelTile['type']): LevelTile {
        const pixelX = x * TILE_SIZE;
        const pixelY = y * TILE_SIZE;

        return {
            x: pixelX,
            y: pixelY,
            type,
            isSolid: type === 'ground' || type === 'platform' || type === 'wall' || type === 'lockedDoor',
            isDangerous: type === 'spikes',
            isCollectible: type === 'trophy' || type === 'coin',
            isClimbable: type === 'ladder',
            bounds: {
                x: pixelX,
                y: pixelY,
                width: TILE_SIZE,
                height: TILE_SIZE
            }
        };
    }

    /**
     * Create a horizontal platform
     */
    private createPlatform(startX: number, y: number, length: number): void {
        for (let i = 0; i < length; i++) {
            if (startX + i < this.width) {
                this.tiles[y][startX + i] = this.createTile(startX + i, y, 'platform');
            }
        }
    }

    /**
     * Create a vertical wall
     */
    private createWall(x: number, startY: number, height: number): void {
        for (let i = 0; i < height; i++) {
            if (startY + i < this.height) {
                this.tiles[startY + i][x] = this.createTile(x, startY + i, 'wall');
            }
        }
    }

    /**
     * Add spikes to the level
     */
    private addSpikes(startX: number, y: number, length: number): void {
        for (let i = 0; i < length; i++) {
            if (startX + i < this.width) {
                this.tiles[y][startX + i] = this.createTile(startX + i, y, 'spikes');
            }
        }
    }

    /**
     * Place collectibles around the level
     */
    private placeCollectibles(): void {
        const collectiblePositions = [
            { x: 250, y: 350, type: 'coin' as const },
            { x: 400, y: 200, type: 'trophy' as const },
            { x: 150, y: 250, type: 'coin' as const },
            { x: 500, y: 300, type: 'coin' as const },
            { x: 650, y: 200, type: 'trophy' as const },
        ];

        this.collectibles = collectiblePositions.map((pos, index) => ({
            id: `collectible-${index}`,
            position: { x: pos.x, y: pos.y },
            type: pos.type,
            value: pos.type === 'trophy' ? SCORES.TROPHY : SCORES.COIN,
            collected: false,
            bounds: {
                x: pos.x,
                y: pos.y,
                width: TILE_SIZE,
                height: TILE_SIZE
            }
        }));

        this.totalCollectibles = this.collectibles.length;
    }

    /**
     * Check collision between a collision box and level tiles
     */
    public checkTileCollision(collisionBox: CollisionBox): {
        hasCollision: boolean;
        solidTiles: LevelTile[];
        dangerousTiles: LevelTile[];
        climbableTiles: LevelTile[];
    } {
        const solidTiles: LevelTile[] = [];
        const dangerousTiles: LevelTile[] = [];
        const climbableTiles: LevelTile[] = [];

        // Calculate tile range to check
        const startX = Math.max(0, Math.floor(collisionBox.x / TILE_SIZE));
        const endX = Math.min(this.width - 1, Math.floor((collisionBox.x + collisionBox.width) / TILE_SIZE));
        const startY = Math.max(0, Math.floor(collisionBox.y / TILE_SIZE));
        const endY = Math.min(this.height - 1, Math.floor((collisionBox.y + collisionBox.height) / TILE_SIZE));

        // Check each tile in range
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tile = this.tiles[y][x];

                if (this.boxIntersects(collisionBox, tile.bounds)) {
                    if (tile.isSolid) {
                        solidTiles.push(tile);
                    }
                    if (tile.isDangerous) {
                        dangerousTiles.push(tile);
                    }
                    if (tile.isClimbable) {
                        climbableTiles.push(tile);
                    }
                }
            }
        }

        return {
            hasCollision: solidTiles.length > 0 || dangerousTiles.length > 0,
            solidTiles,
            dangerousTiles,
            climbableTiles
        };
    }

    /**
     * Check collision with collectibles
     */
    public checkCollectibleCollision(collisionBox: CollisionBox): Collectible[] {
        return this.collectibles.filter(collectible =>
            !collectible.collected &&
            this.boxIntersects(collisionBox, collectible.bounds)
        );
    }

    /**
     * Collect an item
     */
    public collectItem(collectible: Collectible): number {
        if (!collectible.collected) {
            collectible.collected = true;
            this.collectedCount++;

            // Track keys separately
            if (collectible.type === 'key') {
                this.keysCollected++;
                console.log(`Key collected! Keys: ${this.keysCollected}`);
                
                // Unlock doors if we have keys
                if (this.keysCollected > 0) {
                    this.unlockDoors();
                }
            }
            
            // Track diamond collection and spawn princess
            if (collectible.type === 'gem') {
                this.diamondCollected = true;
                console.log('Diamond collected! Princess appears...');
                this.spawnPrincess();
            }
            
            // Track princess collection
            if (collectible.type === 'princess') {
                this.princessCollected = true;
                console.log('Princess rescued!');
            }

            // Check if level is complete (all collectibles collected and player reaches door)
            if (this.collectedCount >= this.totalCollectibles) {
                console.log('All collectibles collected! Head to the exit door.');
            }

            return collectible.value;
        }
        return 0;
    }

    /**
     * Check if player has reached the exit door
     */
    public checkExitDoor(playerPosition: Vector2D): boolean {
        const doorBounds = {
            x: this.exitDoor.x,
            y: this.exitDoor.y,
            width: TILE_SIZE,
            height: TILE_SIZE
        };

        const playerBounds = {
            x: playerPosition.x,
            y: playerPosition.y,
            width: TILE_SIZE,
            height: TILE_SIZE * 1.5
        };

        return this.boxIntersects(playerBounds, doorBounds);
    }

    /**
     * Check if two bounding boxes intersect
     */
    private boxIntersects(box1: Bounds, box2: Bounds): boolean {
        return box1.x < box2.x + box2.width &&
            box1.x + box1.width > box2.x &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height > box2.y;
    }

    /**
     * Get tile at world position
     */
    public getTileAt(x: number, y: number): LevelTile | null {
        const tileX = Math.floor(x / TILE_SIZE);
        const tileY = Math.floor(y / TILE_SIZE);

        if (tileX >= 0 && tileX < this.width && tileY >= 0 && tileY < this.height) {
            return this.tiles[tileY][tileX];
        }

        return null;
    }


    /**
     * Render the level
     */
    public render(context: CanvasRenderingContext2D): void {
        if (!context) {
            console.error('Invalid rendering context provided to Level.render');
            return;
        }
        
        // Render tiles
        for (let y = 0; y < this.height; y++) {
            if (!this.tiles[y]) continue;
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                if (tile) {
                    this.renderTile(context, tile);
                }
            }
        }

        // Render collectibles
        this.collectibles.forEach(collectible => {
            if (!collectible.collected) {
                this.renderCollectible(context, collectible);
            }
        });

        // Render moving platforms (3 wall tiles)
        if (this.movingObstacles && this.movingObstacles.length > 0) {
            this.movingObstacles.forEach(platform => {
                if (platform && typeof platform.x === 'number' && typeof platform.y === 'number') {
                    // Draw 3 wall tiles to make up the platform
                    for (let i = 0; i < 3; i++) {
                        if (this.wallImage) {
                            context.drawImage(this.wallImage, platform.x + (i * TILE_SIZE), platform.y, TILE_SIZE, TILE_SIZE);
                        } else {
                            // Fallback: gray rectangles if wall image not loaded
                            context.fillStyle = '#6b7280';
                            context.fillRect(platform.x + (i * TILE_SIZE), platform.y, TILE_SIZE, TILE_SIZE);
                        }
                    }
                }
            });
        }

        // Render moving enemies (moths)
        if (this.movingEnemies && this.movingEnemies.length > 0) {
            this.movingEnemies.forEach(enemy => {
                if (enemy && typeof enemy.x === 'number' && typeof enemy.y === 'number') {
                    if (this.enemyImage) {
                        // Moth/enemy 1.5x current size
                        const enemySize = TILE_SIZE * 1.5;
                        const offsetX = (enemySize - TILE_SIZE) / 2;
                        const offsetY = (enemySize - TILE_SIZE) / 2;
                        context.drawImage(this.enemyImage, 
                            enemy.x - offsetX, 
                            enemy.y - offsetY, 
                            enemySize, enemySize);
                    } else {
                        // Fallback: draw a red rectangle if image not loaded
                        context.fillStyle = '#ef4444';
                        context.fillRect(enemy.x, enemy.y, TILE_SIZE, TILE_SIZE);
                    }
                }
            });
        }
    }

    /**
     * Render a single tile
     */
    private renderTile(context: CanvasRenderingContext2D, tile: LevelTile): void {
        if (!context || !tile) return;
        
        let frameIndex = -1;

        switch (tile.type) {
            case 'ground':
            case 'wall':
                if (this.wallImage) {
                    context.drawImage(this.wallImage, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
                }
                return; // Use the wall image and skip spritesheet
            case 'platform':
                frameIndex = 6; // Brick variant
                break;
            case 'ladder':
                // Draw ladder as a brown rectangle with rungs
                context.fillStyle = '#8B4513';
                context.fillRect(tile.x + 6, tile.y, 4, TILE_SIZE);
                context.fillStyle = '#654321';
                for (let i = 0; i < TILE_SIZE; i += 4) {
                    context.fillRect(tile.x + 2, tile.y + i, 12, 2);
                }
                return;
            case 'door':
                if (this.doorImage) {
                    // Door 2x current size
                    const doorSize = TILE_SIZE * 2;
                    const offsetX = (doorSize - TILE_SIZE) / 2;
                    const offsetY = doorSize - TILE_SIZE; // Align bottom with tile
                    context.drawImage(this.doorImage, 
                        tile.x - offsetX, 
                        tile.y - offsetY, 
                        doorSize, doorSize);
                }
                return;
            case 'spikes':
                if (this.spikeImage) {
                    context.drawImage(this.spikeImage, tile.x, tile.y, TILE_SIZE, TILE_SIZE);
                }
                return;
            case 'lockedDoor':
                if (this.lockedDoorImage) {
                    // Locked door 2x current size (same as regular door)
                    const doorSize = TILE_SIZE * 2;
                    const offsetX = (doorSize - TILE_SIZE) / 2;
                    const offsetY = doorSize - TILE_SIZE; // Align bottom with tile
                    context.drawImage(this.lockedDoorImage, 
                        tile.x - offsetX, 
                        tile.y - offsetY, 
                        doorSize, doorSize);
                } else {
                    // Fallback: draw a red door
                    context.fillStyle = '#800000';
                    context.fillRect(tile.x, tile.y, TILE_SIZE, TILE_SIZE);
                    context.fillStyle = '#ffffff';
                    context.fillText('🔒', tile.x + 4, tile.y + 12);
                }
                return;
        }

        if (frameIndex !== -1 && this.tileSheet) {
            this.tileSheet.drawFrame(context, frameIndex, tile.x, tile.y);
        }
    }

    /**
     * Render a collectible item
     */
    private renderCollectible(context: CanvasRenderingContext2D, collectible: Collectible): void {
        if (collectible.collected) return;

        switch (collectible.type) {
            case 'coin':
                if (this.coinImage) {
                    context.drawImage(this.coinImage, collectible.position.x, collectible.position.y, TILE_SIZE, TILE_SIZE);
                }
                return;
            case 'trophy':
                if (this.trophyImage) {
                    context.drawImage(this.trophyImage, collectible.position.x, collectible.position.y, TILE_SIZE, TILE_SIZE);
                }
                return;
            case 'gem':
                if (this.gemImage) {
                    context.drawImage(this.gemImage, collectible.position.x, collectible.position.y, TILE_SIZE, TILE_SIZE);
                }
                return;
            case 'key':
                if (this.keyImage) {
                    context.drawImage(this.keyImage, collectible.position.x, collectible.position.y, TILE_SIZE, TILE_SIZE);
                } else {
                    // Fallback: draw a yellow key
                    context.fillStyle = '#ffff00';
                    context.fillRect(collectible.position.x, collectible.position.y, TILE_SIZE, TILE_SIZE);
                    context.fillStyle = '#000000';
                    context.fillText('🗝️', collectible.position.x + 2, collectible.position.y + 12);
                }
                return;
            case 'princess':
                if (this.princessImage) {
                    // Princess same size as player: 28x48
                    const princessWidth = 28;
                    const princessHeight = 48;
                    context.drawImage(this.princessImage, 
                        collectible.position.x - (princessWidth - TILE_SIZE) / 2, 
                        collectible.position.y - (princessHeight - TILE_SIZE), 
                        princessWidth, princessHeight);
                } else {
                    // Fallback: draw a pink princess
                    context.fillStyle = '#ff69b4';
                    context.fillRect(collectible.position.x, collectible.position.y, TILE_SIZE, TILE_SIZE);
                    context.fillStyle = '#000000';
                    context.fillText('👸', collectible.position.x + 2, collectible.position.y + 12);
                }
                return;
        }
    }

    /**
     * Get player start position
     */
    public getPlayerStartPosition(): Vector2D {
        return { ...this.playerStartPosition };
    }

    /**
     * Get level completion status
     */
    public getCompletionStatus(): { collected: number; total: number; canExit: boolean } {
        return {
            collected: this.collectedCount,
            total: this.totalCollectibles,
            canExit: this.collectedCount >= this.totalCollectibles
        };
    }

    public getMovingObstacles() { return this.movingObstacles; }
    public getMovingEnemies() { return this.movingEnemies; }

    /**
     * Unlock doors when keys are collected
     */
    private unlockDoors(): void {
        let doorsUnlocked = 0;
        for (let y = 0; y < this.height; y++) {
            if (!this.tiles[y]) continue;
            for (let x = 0; x < this.width; x++) {
                const tile = this.tiles[y][x];
                if (tile && tile.type === 'lockedDoor' && doorsUnlocked < this.keysCollected) {
                    this.tiles[y][x] = this.createTile(x, y, 'empty');
                    doorsUnlocked++;
                    console.log(`Door unlocked at ${x}, ${y}`);
                }
            }
        }
    }

    /**
     * Spawn princess at predefined location when diamond is collected
     */
    private spawnPrincess(): void {
        if (this.princessSpawned || !this.princessSpawnPosition) return;
        
        // Add princess as a collectible at predefined spawn position
        this.collectibles.push({
            id: 'princess',
            position: { x: this.princessSpawnPosition.x, y: this.princessSpawnPosition.y },
            type: 'princess',
            value: 0, // No score value
            collected: false,
            bounds: { 
                x: this.princessSpawnPosition.x, 
                y: this.princessSpawnPosition.y, 
                width: TILE_SIZE, 
                height: TILE_SIZE 
            }
        });
        
        this.totalCollectibles++;
        this.princessSpawned = true;
        console.log(`Princess spawned at predefined location (${this.princessSpawnPosition.x / TILE_SIZE}, ${this.princessSpawnPosition.y / TILE_SIZE})`);
    }

    /**
     * Get keys collected count
     */
    public getKeysCollected(): number {
        return this.keysCollected;
    }

    /**
     * Check if diamond has been collected
     */
    public isDiamondCollected(): boolean {
        return this.diamondCollected;
    }

    /**
     * Check if princess has been collected
     */
    public isPrincessCollected(): boolean {
        return this.princessCollected;
    }

    /**
     * Reset level including keys
     */
    public reset(): void {
        this.collectibles.forEach(collectible => {
            collectible.collected = false;
        });
        this.collectedCount = 0;
        this.keysCollected = 0;
        this.isComplete = false;
        
        // Reset diamond and princess states
        this.diamondCollected = false;
        this.princessCollected = false;
        this.princessSpawned = false;
        
        // Remove princess from collectibles if it was dynamically added
        this.collectibles = this.collectibles.filter(c => c.type !== 'princess');
        this.totalCollectibles = this.collectibles.length;
        
        // Re-lock doors
        this.lockedDoors.forEach(doorPos => {
            const tileX = Math.floor(doorPos.x / TILE_SIZE);
            const tileY = Math.floor(doorPos.y / TILE_SIZE);
            if (tileY >= 0 && tileY < this.height && tileX >= 0 && tileX < this.width) {
                if (this.tiles[tileY] && this.tiles[tileY][tileX]) {
                    this.tiles[tileY][tileX] = this.createTile(tileX, tileY, 'lockedDoor');
                }
            }
        });
    }
} 