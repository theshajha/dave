import { Player } from '@/lib/entities/player';
import { Level } from '../Level';

export class PhysicsCore {
    protected level: Level | null = null;
    protected player: Player | null = null;

    setLevel(lvl: Level) { this.level = lvl; }
    setPlayer(pl: Player) { this.player = pl; }
} 