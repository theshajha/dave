import { GAME_STATES } from '@/lib/utils/constants';
import { GameEngine } from '../GameEngine';

export function updateMenu(engine: GameEngine, dt: number): void {
    const input = (engine as any).inputManager;
    input?.update(dt);

    // Handle keyboard input
    if (input?.isPressed('jump')) {
        engine.setState(GAME_STATES.PLAYING);
    }

    if (input?.isPressed('pause')) {
        console.log('Options menu would open here');
    }
}

export function renderMenu(engine: GameEngine): void {
    const ctx = (engine as any).context as CanvasRenderingContext2D;
    const canvas = (engine as any).canvas as HTMLCanvasElement;

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DANGEROUS DAVE', canvas.width / 2, canvas.height / 2 - 60);

    ctx.fillStyle = '#f9fafb';
    ctx.font = '16px monospace';
    
    // Check if device is mobile/touch-enabled
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    let startText = 'Press SPACE to Start';
    
    if (isMobile) {
        const isLandscape = window.innerWidth > window.innerHeight;
        startText = isLandscape ? 'Tap to Start' : 'Rotate Device to Play';
    }
    
    ctx.fillText(startText, canvas.width / 2, canvas.height / 2 + 20);
} 