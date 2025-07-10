import { getSpriteFrameIndex } from './animation';
import type { PlayerBase } from './player-base';

export function renderPlayer(player: PlayerBase, ctx: CanvasRenderingContext2D): void {
    ctx.save();

    const sheet = (player.constructor as typeof PlayerBase).spriteSheet;
    if (sheet && (sheet as any).image) {
        const frame = getSpriteFrameIndex(player);
        sheet.drawFrame(
            ctx,
            frame,
            Math.round(player.position.x),
            Math.round(player.position.y),
            (player.constructor as any).DRAW_SCALE,
            player.direction === 'left',
        );
    } else {
        // Fallback rectangle
        ctx.save();
        ctx.fillStyle = player.isAlive ? (player.state === 'jumping' ? '#10b981' : '#3b82f6') : '#ef4444';
        ctx.fillRect(Math.round(player.position.x), Math.round(player.position.y), player.size.x, player.size.y);
        // Direction arrow
        ctx.fillStyle = '#fbbf24';
        const arrowX = player.direction === 'right' ? player.position.x + player.size.x - 4 : player.position.x + 2;
        ctx.fillRect(arrowX, player.position.y + 4, 2, 2);
        ctx.restore();
    }

    ctx.restore();
} 