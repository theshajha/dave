import { GameEngine } from '../GameEngine';

export function updateLoading(_engine: GameEngine, _dt: number): void {
    // Could increment loading progress bars etc.
    // Currently no dynamic logic needed.
}

export function renderLoading(engine: GameEngine): void {
    const ctx = (engine as any).context as CanvasRenderingContext2D;
    const canvas = (engine as any).canvas as HTMLCanvasElement;

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f9fafb';
    ctx.font = '24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Loading Dangerous Dave...', canvas.width / 2, canvas.height / 2);
} 