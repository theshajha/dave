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
        if (c.canExit) ctx.fillText('Find the exit door!', 10, 125);
    }

    // Key indicator
    const player = (engine as any).player;
    if (player?.hasKey) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText('KEY ✓', 10, 145);
    }
    ctx.restore();
} 