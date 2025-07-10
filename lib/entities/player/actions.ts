import type { PlayerBase } from './player-base';

export function performAction(player: PlayerBase): void {
    // For now just delegates to shoot
    shoot(player);
}

export function shoot(player: PlayerBase): void {
    // Stub projectile logic – can be extended
    console.log('Player shoots!');
}

export function collectItem(player: PlayerBase, points: number): number {
    player.score += points;
    const { TROPHY, COIN } = require('@/lib/utils/constants').SCORES;

    if (points === 0) {
        player.hasKey = true;
        console.log('Collected key!');
    } else if (points === TROPHY) {
        player.hasTrophy = true;
        console.log('Collected trophy!');
    } else {
        console.log(`Collected item! Score: ${player.score}`);
    }

    return player.score;
}

export function takeDamage(player: PlayerBase): void {
    player.lives -= 1;
    if (player.lives <= 0) player.isAlive = false;
    console.log(`Dave took damage! Lives remaining: ${player.lives}`);
}

export function resetPlayer(player: PlayerBase, x: number = 100, y: number = 100): void {
    player.position = { x, y };
    player.velocity = { x: 0, y: 0 };
    player.isGrounded = false;
    player.state = 'idle';
    player.direction = 'right';
    player['animationFrame'] = 0;
    player['animationTimer'] = 0;
    player.hasGun = false;
    player.hasKey = false;
    player.hasTrophy = false;
    player.jetpackFuel = 0;
    // update collision box
    player.collisionBox.x = x + 2;
    player.collisionBox.y = y + 2;
} 