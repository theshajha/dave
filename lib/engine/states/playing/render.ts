import { GameEngine } from '../../GameEngine';

export function renderPlaying(engine: GameEngine): void {
    const ctx = (engine as any).context as CanvasRenderingContext2D;
    const canvas = (engine as any).canvas as HTMLCanvasElement;

    // Background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Level & player
    (engine as any).currentLevel?.render(ctx);
    (engine as any).player?.render(ctx);

    renderHUD(engine, ctx);
}

function renderHUD(engine: GameEngine, ctx: CanvasRenderingContext2D) {
    const gs = engine.state;
    ctx.save();
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${gs.score.toLocaleString()}`, 10, 25);
    ctx.fillText(`LIVES: ${gs.lives}`, 10, 50);
    ctx.fillText(`LEVEL: ${gs.currentLevel}`, 10, 75);

    const lvl = (engine as any).currentLevel;
    if (lvl) {
        const c = lvl.getCompletionStatus();
        ctx.fillStyle = c.canExit ? '#10b981' : '#f9fafb';
        ctx.fillText(`ITEMS: ${c.collected}/${c.total}`, 10, 100);

        // Check if level can be completed (diamond + princess + key + all items)
        const diamondCollected = lvl.isDiamondCollected();
        const princessCollected = lvl.isPrincessCollected();
        const levelHasKeys = lvl.getCollectibles().some((collectible: any) => collectible.type === 'key' && !collectible.collected);
        const hasRequiredKeys = !levelHasKeys || (engine as any).player?.hasKey;
        const canAccessGate = c.canExit && diamondCollected && princessCollected && hasRequiredKeys;

        if (canAccessGate) {
            ctx.fillStyle = '#10b981';
            ctx.fillText('Gate accessible! Find the exit door!', 10, 125);
        } else {
            ctx.fillStyle = '#ef4444';
            let missing = [];
            if (!diamondCollected) missing.push('diamond');
            if (diamondCollected && !princessCollected) missing.push('princess');
            if (!hasRequiredKeys) missing.push('key');
            if (!c.canExit) missing.push('all items');

            if (missing.length > 0) {
                ctx.fillText(`Need: ${missing.join(', ')}`, 10, 125);
            }
        }
    }

    // Status indicators
    let yOffset = 145;

    if ((engine as any).player?.hasKey) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('KEY ✓', 10, yOffset);
        yOffset += 20;
    }

    if (lvl?.isDiamondCollected()) {
        ctx.fillStyle = '#60a5fa';
        ctx.fillText('DIAMOND ✓', 10, yOffset);
        yOffset += 20;
    }

    if (lvl?.isPrincessCollected()) {
        ctx.fillStyle = '#f472b6';
        ctx.fillText('PRINCESS ✓', 10, yOffset);
    }
    ctx.restore();
} 