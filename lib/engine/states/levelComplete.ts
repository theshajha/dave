import { GameEngine } from '../GameEngine';

export function updateLevelComplete(engine: GameEngine, _dt: number): void {
    if ((engine as any).inputManager?.isPressed('action')) {
        (engine as any).nextLevel();
    }
}

export function renderLevelComplete(engine: GameEngine): void {
    const ctx = (engine as any).context as CanvasRenderingContext2D;
    const canvas = (engine as any).canvas as HTMLCanvasElement;
    const score = engine.state.score;

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('LEVEL COMPLETE!', canvas.width / 2, canvas.height / 2 - 60);

    ctx.fillStyle = '#f9fafb';
    ctx.font = '16px monospace';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Press SPACE for next level', canvas.width / 2, canvas.height / 2 + 20);
} 