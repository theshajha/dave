import { GameEngine } from '../GameEngine';

export function updateGameOver(engine: GameEngine, _dt: number): void {
    // Game restart is handled by event system in events.ts
    // No need for polling-based input checking here
}

export function renderGameOver(engine: GameEngine): void {
    const ctx = (engine as any).context as CanvasRenderingContext2D;
    const canvas = (engine as any).canvas as HTMLCanvasElement;
    const score = engine.state.score;

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60);

    ctx.fillStyle = '#f9fafb';
    ctx.font = '16px monospace';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 20);
} 