import { collectItem, resetPlayer, takeDamage } from './actions';
import { getAnimationFrame, updateAnimation } from './animation';
import { handleInput } from './input';
import { applyPhysics, ceilingCollision, groundCollision, updateCollisionBox, wallCollision } from './physics';
import { PlayerBase } from './player-base';
import { renderPlayer } from './render';
import { updateState } from './state';

export class Player extends PlayerBase {
    update(delta: number, inputManager: any): void {
        if (!this.isAlive) return;
        handleInput(this, inputManager, delta);
        applyPhysics(this, delta);
        updateAnimation(this, delta);
        updateCollisionBox(this);
        updateState(this);
    }

    // Collision wrappers
    onGroundCollision(groundY: number): void { groundCollision(this, groundY); }
    onWallCollision(wallX: number, side: 'left' | 'right'): void { wallCollision(this, wallX, side); }
    onCeilingCollision(ceilingY: number): void { ceilingCollision(this, ceilingY); }

    // Gameplay wrappers
    takeDamage(): void { takeDamage(this); }
    collectItem(points: number): void { collectItem(this, points); }
    reset(x: number = 100, y: number = 100): void { resetPlayer(this, x, y); }

    // Rendering
    render(ctx: CanvasRenderingContext2D): void { renderPlayer(this, ctx); }

    getAnimationFrame() { return getAnimationFrame(this); }
} 