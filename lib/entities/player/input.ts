import { performAction } from './actions';
import type { PlayerBase } from './player-base';

// Processes keyboard/controller state and mutates the player instance accordingly
export function handleInput(
    player: PlayerBase,
    inputManager: any,
    deltaTime: number,
): void {
    if (!inputManager) return;

    const left = inputManager.isPressed('left');
    const right = inputManager.isPressed('right');
    const jump = inputManager.isPressed('jump');
    const up = inputManager.isPressed('action');

    const moveSpeed = 150; // A fixed speed for diagnostics

    // Simplified diagnostic movement
    if (left && !right) {
        player.velocity.x = -moveSpeed;
        player.direction = 'left';
    } else if (right && !left) {
        player.velocity.x = moveSpeed;
        player.direction = 'right';
    } else {
        player.velocity.x = 0;
    }

    // Handle jump
    if (jump && player.isGrounded) {
        player.velocity.y = -player.jumpPower;
        player.isGrounded = false;
    }

    // Handle actions
    if (up) {
        performAction(player);
    }
} 