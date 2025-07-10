import { GameConfig } from '@/lib/utils/types';

export function optimizeCanvas(canvas: HTMLCanvasElement) {
    // Pixel-perfect rendering
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    (ctx as any).imageSmoothingEnabled = false;
}

export function resizeCanvas(canvas: HTMLCanvasElement, cfg: GameConfig) {
    canvas.width = cfg.canvas.width;
    canvas.height = cfg.canvas.height;
    canvas.style.width = `${cfg.canvas.width * cfg.canvas.scale}px`;
    canvas.style.height = `${cfg.canvas.height * cfg.canvas.scale}px`;
} 