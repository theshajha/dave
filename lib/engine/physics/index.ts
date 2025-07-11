import { constrain } from './bounds';
import { collectibles, dangerous, horizontal, vertical } from './collisions';
import { PhysicsCore } from './core';
import { movingPlatformCollision, updateMovingObstacles, movingEnemyCollision, updateMovingEnemies } from './moving';

export class PhysicsEngine extends PhysicsCore {
    update(dt: number) {
        if (!this.player || !this.level) return;
        horizontal(this.player, this.level);
        vertical(this.player, this.level);

        // moving platforms
        updateMovingObstacles(this.level, dt);
        movingPlatformCollision(this.player, this.level);
        
        // moving enemies
        updateMovingEnemies(this.level, dt);
        movingEnemyCollision(this.player, this.level);
        
        collectibles(this.player, this.level);
        dangerous(this.player, this.level);
        constrain(this.player, this.level);
    }

    checkLevelCompletion(): boolean {
        if (!this.player || !this.level) return false;
        const c = this.level.getCompletionStatus();
        const p: any = this.player;
        
        // Check requirements: diamond, princess, and key (if level has them)
        const diamondRequired = this.level.isDiamondCollected();
        const princessRequired = this.level.isPrincessCollected();
        const levelHasKeys = this.level.collectibles.some(c => c.type === 'key' && !c.collected);
        const hasRequiredKeys = !levelHasKeys || p.hasKey;
        
        // Level can only be completed if: all basic collectibles + diamond + princess + key
        const hasAllRequired = c.canExit && diamondRequired && princessRequired && hasRequiredKeys;
        
        if (hasAllRequired && this.level.checkExitDoor(this.player.position)) {
            this.level.isComplete = true; 
            return true;
        }
        return false;
    }

    reset() { console.log('Physics reset'); }

    getDebugInfo() {
        if (!this.player || !this.level) return {};
        const col = this.level.checkTileCollision(this.player.collisionBox);
        return { solidTilesNearby: col.solidTiles.length, dangerousTilesNearby: col.dangerousTiles.length };
    }
} 