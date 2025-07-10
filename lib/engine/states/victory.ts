import { GAME_STATES } from '@/lib/utils/constants';
import { GameEngine } from '../GameEngine';

// Handle minimal input on the victory screen.
export function updateVictory(engine: GameEngine, _dt: number): void {
    const input = (engine as any).inputManager;
    if (input?.isPressed('action') || input?.isPressed('jump')) {
        // Return to main menu for now
        engine.setState(GAME_STATES.MENU);
    }
}

// Render a simple "You Win" screen.
export function renderVictory(engine: GameEngine): void {
    const ctx = (engine as any).context as CanvasRenderingContext2D;
    const canvas = (engine as any).canvas as HTMLCanvasElement;

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CONGRATULATIONS!', canvas.width / 2, canvas.height / 2 - 40);

    ctx.fillStyle = '#f9fafb';
    ctx.font = '20px monospace';
    ctx.fillText('You completed all levels', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press SPACE to return to menu', canvas.width / 2, canvas.height / 2 + 40);
} 