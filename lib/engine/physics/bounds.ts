import { Player } from '@/lib/entities/player';
import { GAME_CONFIG } from '@/lib/utils/constants';
import { Level } from '../Level';

export function constrain(player: Player, level: Level) {
    const w = level.getWidthInPixels();
    const h = GAME_CONFIG.canvas.height;
    // Left
    if (player.position.x < 0) { player.position.x = 0; player.velocity.x = 0; }
    // Right
    if (player.position.x + player.size.x > w) {
        player.position.x = w - player.size.x; player.velocity.x = 0;
    }
    // Top
    if (player.position.y < 0) { player.position.y = 0; player.velocity.y = 0; }
    // Bottom (death)
    if (player.position.y > h) {
        player.takeDamage();
        const s = level.getPlayerStartPosition();
        player.reset(s.x, s.y);
    }
} 