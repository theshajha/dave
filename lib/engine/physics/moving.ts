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

export function updateMovingEnemies(level: Level, dt: number) {
    level.getMovingEnemies().forEach(enemy => {
        enemy.x += enemy.speed * enemy.dir * dt;
        if (enemy.x < enemy.minX || enemy.x > enemy.maxX) {
            enemy.dir *= -1 as any;
            enemy.x = Math.max(enemy.minX, Math.min(enemy.x, enemy.maxX));
        }
        enemy.bounds.x = enemy.x;
    });
}

export function movingPlatformCollision(player: Player, level: Level) {
    for (const platform of level.getMovingObstacles()) {
        if (intersects(player.collisionBox, platform.bounds)) {
            // Check if player is landing on top of the platform
            const playerBottom = player.collisionBox.y + player.collisionBox.height;
            const platformTop = platform.bounds.y;
            
            if (playerBottom <= platformTop + 8 && player.velocity.y >= 0) {
                // Player is landing on top - place them on the platform
                player.position.y = platform.bounds.y - player.collisionBox.height + 2;
                player.velocity.y = 0;
                player.isGrounded = true;
                
                // Move player with the platform
                player.position.x += platform.speed * platform.dir * 0.016; // approximate dt
                player.collisionBox.x = player.position.x + 2;
                player.collisionBox.y = player.position.y + 2;
            } else {
                // Side or bottom collision - block movement like a wall
                if (player.velocity.x > 0 && player.collisionBox.x < platform.bounds.x) {
                    player.position.x = platform.bounds.x - player.collisionBox.width - 2;
                } else if (player.velocity.x < 0 && player.collisionBox.x > platform.bounds.x) {
                    player.position.x = platform.bounds.x + platform.bounds.width + 2;
                }
                player.velocity.x = 0;
                player.collisionBox.x = player.position.x + 2;
            }
            break;
        }
    }
}

export function movingEnemyCollision(player: Player, level: Level) {
    for (const enemy of level.getMovingEnemies()) {
        if (intersects(player.collisionBox, enemy.bounds)) {
            player.takeDamage();
            break;
        }
    }
} 