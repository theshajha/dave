import { GameEngine } from '../GameEngine';

export function renderDebug(engine: GameEngine): void {
    const ctx = (engine as any).context as CanvasRenderingContext2D;
    const canvas = (engine as any).canvas as HTMLCanvasElement;
    const m = (engine as any).performanceMetrics;

    const lines: string[] = [
        `FPS: ${m.fps}`,
        `Frame: ${m.frameTime.toFixed(2)}ms`,
        `Update: ${m.updateTime.toFixed(2)}ms`,
        `Render: ${m.renderTime.toFixed(2)}ms`,
        `Entities: ${m.entityCount}`,
        `Memory: ${m.memoryUsage.toFixed(1)}MB`,
    ];

    const player = (engine as any).player;
    if (player) {
        lines.push(`Player Pos: (${player.position.x.toFixed(1)}, ${player.position.y.toFixed(1)})`);
        lines.push(`Velocity: (${player.velocity.x.toFixed(1)}, ${player.velocity.y.toFixed(1)})`);
        lines.push(`Grounded: ${player.isGrounded}`);
        lines.push(`State: ${player.state}`);
    }

    const input = (engine as any).inputManager;
    if (input) {
        const i = input.getInputState();
        lines.push(`Input L:${i.left} R:${i.right} J:${i.jump} A:${i.action} D:${i.down} P:${i.pause}`);
    }

    const phys = (engine as any).physicsEngine;
    if (phys) {
        const pInfo = phys.getDebugInfo?.();
        if (pInfo) {
            lines.push(`SolidTiles: ${pInfo.solidTilesNearby}`);
            lines.push(`DangerTiles: ${pInfo.dangerousTilesNearby}`);
        }
    }

    const lineHeight = 14;
    const panelWidth = 260;
    const panelHeight = 10 + lines.length * lineHeight;
    const baseX = 10;
    const baseY = canvas.height - panelHeight - 10;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(baseX, baseY, panelWidth, panelHeight);

    ctx.fillStyle = '#00ff00';
    ctx.font = '12px monospace';
    ctx.textAlign = 'left';

    lines.forEach((txt, idx) => ctx.fillText(txt, baseX + 5, baseY + 15 + idx * lineHeight));
} 