'use client';
import { GameEngine } from '@/lib/engine/GameEngine';
import { useEffect, useState } from 'react';

interface Props { engine: GameEngine | null }

export default function DebugInfo({ engine }: Props) {
    const [lines, setLines] = useState<string[]>([]);
    useEffect(() => {
        if (!engine) return;
        let id: number;
        const update = () => {
            const out: string[] = [];
            if (engine.metrics) {
                const m = engine.metrics;
                out.push(`FPS: ${m.fps}`);
                out.push(`Frame: ${m.frameTime.toFixed(2)}ms`);
                out.push(`Update: ${m.updateTime.toFixed(2)}ms`);
                out.push(`Render: ${m.renderTime.toFixed(2)}ms`);
            }
            const pl = (engine as any).player;
            if (pl) {
                out.push(`Pos: (${pl.position.x.toFixed(1)},${pl.position.y.toFixed(1)})`);
                out.push(`Vel: (${pl.velocity.x.toFixed(1)},${pl.velocity.y.toFixed(1)})`);
            }
            setLines(out);
            id = requestAnimationFrame(update);
        };
        update();
        return () => cancelAnimationFrame(id);
    }, [engine]);

    if (!engine || lines.length === 0) return null;

    return (
        <div className="mt-4 p-3 game-panel pixel-text text-xs leading-tight text-center">
            {lines.map((line, index) => (
                <span key={index} className="mr-4">
                    {line}
                </span>
            ))}
        </div>
    );
} 