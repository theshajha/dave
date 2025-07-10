import type { PlayerBase } from './player-base';

export function updateState(player: PlayerBase): void {
    if (player.isClimbing) {
        player.state = 'climbing';
    } else if (!player.isGrounded) {
        player.state = player.velocity.y < 0 ? 'jumping' : 'falling';
    } else if (Math.abs(player.velocity.x) > 0.1) {
        player.state = 'walking';
    } else {
        player.state = 'idle';
    }
} 