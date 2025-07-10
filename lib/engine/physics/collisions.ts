import { Player } from '@/lib/entities/player';
import { Vector2D } from '@/lib/utils/types';
import { Level, LevelTile } from '../Level';
import { dist } from './utils';

export function horizontal(player: Player, level: Level) {
    const coll = level.checkTileCollision(player.collisionBox);

    // Ignore tiles that are purely beneath the player's feet (ground) to avoid
    // false horizontal collisions that invert ground movement.
    const sideTiles = coll.solidTiles.filter(t =>
        // Keep tiles whose top is above the very bottom of the player's box
        t.y < player.collisionBox.y + player.collisionBox.height - 1,
    );

    if (!sideTiles.length) return;

    const tile = findClosest(sideTiles, player.position);
    if (!tile) return;
    if (player.velocity.x > 0) player.onWallCollision(tile.x, 'right');
    else if (player.velocity.x < 0) player.onWallCollision(tile.x + tile.bounds.width, 'left');
}

export function vertical(player: Player, level: Level) {
    const coll = level.checkTileCollision(player.collisionBox);
    if (coll.solidTiles.length) {
        const tile = findClosest(coll.solidTiles, player.position);
        if (!tile) return;
        if (player.velocity.y > 0) player.onGroundCollision(tile.y);
        else if (player.velocity.y < 0) player.onCeilingCollision(tile.y + tile.bounds.height);
    } else player.isGrounded = false;
}

export function collectibles(player: Player, level: Level) {
    level.checkCollectibleCollision(player.collisionBox).forEach(c => {
        const pts = level.collectItem(c);
        if (pts) player.collectItem(pts);
    });
}

export function dangerous(player: Player, level: Level) {
    const coll = level.checkTileCollision(player.collisionBox);
    if (coll.dangerousTiles.length) {
        player.takeDamage();

        // If player is still alive, reset their position. Otherwise, the main
        // game loop will handle the transition to the GAME_OVER state.
        if (player.isAlive) {
            const startPosition = level.getPlayerStartPosition();
            player.reset(startPosition.x, startPosition.y);
        }
    }
}

function findClosest(tiles: LevelTile[], target: Vector2D): LevelTile | null {
    return tiles.reduce((p, c) => dist(target, c) < dist(target, p) ? c : p, tiles[0]);
} 