import { Player } from '@/lib/entities/player';
import { Bounds } from '@/lib/utils/types';
import { Level } from '../Level';

function intersects(a: Bounds, b: Bounds): boolean {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function updateMovingObstacles(level: Level, dt: number) {
    level.getMovingObstacles().forEach(o => {
        o.x += o.speed * o.dir * dt;
        if (o.x < o.minX || o.x > o.maxX) {
            o.dir *= -1 as any;
            o.x = Math.max(o.minX, Math.min(o.x, o.maxX));
        }
        o.bounds.x = o.x;
    });
}

export function movingObstacleCollision(player: Player, level: Level) {
    for (const o of level.getMovingObstacles()) {
        if (intersects(player.collisionBox, o.bounds)) {
            player.takeDamage();
            break;
        }
    }
} 