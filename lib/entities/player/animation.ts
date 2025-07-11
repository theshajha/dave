import type { PlayerBase } from './player-base';

export function updateAnimation(player: PlayerBase, delta: number): void {
    player['animationTimer'] += delta;

    if (player['animationTimer'] >= player['animationSpeed']) {
        player['animationTimer'] = 0;
        player['animationFrame'] += 1;

        const max = getMaxFramesForState(player.state);
        if (player['animationFrame'] >= max) {
            player['animationFrame'] = 0;
        }
    }
}

export function getMaxFramesForState(state: string): number {
    switch (state) {
        case 'idle':
        case 'walking':
            return 3; // idle: 0-1, walk: 3-4
        case 'jumping':
        case 'falling':
            return 1; // all are static frames
        default:
            return 1; // fallback to single frame
    }
}

export function getSpriteFrameIndex(player: PlayerBase): number {
    // If Dave has a gun and is not in walking animation, show gun frame (index 1)
    if (player.hasGun) {
        if (player.state === 'idle' || player.state === 'jumping' || player.state === 'falling') {
            return 1;
        }
    }
    switch (player.state) {
        case 'idle': {
            const idleFrames = [0, 4, 6];
            // return idleFrames[player['animationFrame'] % 2];
            return 0;
        }
        case 'walking':
            return (player['animationFrame'] % 2) ? 5 : 2; // 2 & 5
        case 'jumping':
        case 'falling':
            return 4; // idle frame mid-sheet
        default:
            return 0; // fallback
    }
}

export function getAnimationFrame(player: PlayerBase) {
    return {
        frame: player['animationFrame'],
        state: player.state,
        direction: player.direction,
    };
}