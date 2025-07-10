import { constrain } from './bounds';
import { collectibles, dangerous, horizontal, vertical } from './collisions';
import { PhysicsCore } from './core';
import { movingObstacleCollision, updateMovingObstacles } from './moving';

export class PhysicsEngine extends PhysicsCore {
    update(dt: number) {
        if (!this.player || !this.level) return;
        horizontal(this.player, this.level);
        vertical(this.player, this.level);

        // moving obstacles
        updateMovingObstacles(this.level, dt);
        movingObstacleCollision(this.player, this.level);
        collectibles(this.player, this.level);
        dangerous(this.player, this.level);
        constrain(this.player, this.level);
    }

    checkLevelCompletion(): boolean {
        if (!this.player || !this.level) return false;
        const c = this.level.getCompletionStatus();
        const p: any = this.player;
        const ready = c.canExit || p.hasKey;
        if (ready && this.level.checkExitDoor(this.player.position)) {
            this.level.isComplete = true; return true;
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