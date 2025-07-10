import { GAME_STATES } from '@/lib/utils/constants';
import { GameEngine } from '../GameEngine';
import { renderPlaying as renderPlayingState } from './playing/render';

export function updatePaused(engine: GameEngine, _dt: number): void {
    if ((engine as any).inputManager?.isPressed('pause')) {
        engine.setState(GAME_STATES.PLAYING);
    }
}

export function renderPaused(engine: GameEngine): void {
    // Draw underlying frame first
    renderPlayingState(engine);

    const ctx = (engine as any).context as CanvasRenderingContext2D;
    const canvas = (engine as any).canvas as HTMLCanvasElement;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f9fafb';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
} 