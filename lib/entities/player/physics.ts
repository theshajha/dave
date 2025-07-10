import { GAME_CONFIG } from '@/lib/utils/constants';
import type { PlayerBase } from './player-base';

export function applyPhysics(player: PlayerBase, delta: number): void {
    // Gravity (unless climbing)
    if (!player.isClimbing) player.velocity.y += GAME_CONFIG.physics.gravity * delta;

    // Terminal fall speed
    player.velocity.y = Math.min(player.velocity.y, GAME_CONFIG.physics.maxVelocity.y);

    // Integrate
    player.position.x += player.velocity.x * delta;
    player.position.y += player.velocity.y * delta;
}

// Keep collision box anchored to sprite position
export function updateCollisionBox(player: PlayerBase): void {
    player.collisionBox.x = player.position.x + 2;
    player.collisionBox.y = player.position.y + 2;
}

export function groundCollision(player: PlayerBase, groundY: number): void {
    if (player.velocity.y >= 0) {
        player.position.y = groundY - player.size.y;
        player.isGrounded = true;
        player.isClimbing = false;
        player.velocity.y = 0;
    }
}

export function wallCollision(player: PlayerBase, wallX: number, side: 'left' | 'right'): void {
    if (side === 'left' && player.velocity.x < 0) {
        player.position.x = wallX;
        player.velocity.x = 0;
    } else if (side === 'right' && player.velocity.x > 0) {
        player.position.x = wallX - player.size.x;
        player.velocity.x = 0;
    }
}

export function ceilingCollision(player: PlayerBase, ceilingY: number): void {
    if (player.velocity.y < 0) {
        player.position.y = ceilingY;
        player.velocity.y = 0;
    }
} 