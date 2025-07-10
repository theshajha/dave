import { AssetUtils } from '@/lib/utils/helpers';

export interface SpriteSheetOptions {
    frameWidth: number;
    frameHeight: number;
    rows: number;
    columns: number;
    spacing?: number; // pixels between frames
    margin?: number; // margin around sheet
}

/**
 * Simple sprite-sheet loader / drawer
 */
export class SpriteSheet {
    private image: HTMLImageElement | null = null;
    private readonly url: string;
    private readonly opts: Required<SpriteSheetOptions>;

    constructor(url: string, options: SpriteSheetOptions) {
        this.url = url;
        this.opts = {
            spacing: 0,
            margin: 0,
            ...options,
        } as Required<SpriteSheetOptions>;
    }

    /** Load the sheet once (returns cached promise on subsequent calls) */
    private loadPromise: Promise<void> | null = null;
    async load(): Promise<void> {
        if (this.image) return;
        if (!this.loadPromise) {
            this.loadPromise = AssetUtils.loadImage(this.url).then(img => {
                this.image = img;
            });
        }
        return this.loadPromise;
    }

    /**
     * Draw a specific frame (by index) to the given context
     */
    drawFrame(
        ctx: CanvasRenderingContext2D,
        frameIndex: number,
        destX: number,
        destY: number,
        scale: number = 1,
        flipH: boolean = false,
    ): void {
        if (!this.image) return;

        const { frameWidth, frameHeight, columns, spacing, margin, rows } = this.opts;
        const totalFrames = columns * rows;

        if (frameIndex >= totalFrames) {
            console.warn(`Frame index ${frameIndex} out of bounds (max ${totalFrames - 1})`);
            return;
        }

        const col = frameIndex % columns;
        const row = Math.floor(frameIndex / columns);
        const sx = margin + col * (frameWidth + spacing);
        const sy = margin + row * (frameHeight + spacing);
        const dw = frameWidth * scale;
        const dh = frameHeight * scale;

        if (flipH) {
            ctx.save();
            ctx.scale(-1, 1);
            // When flipped, render at mirrored X (negative) so sprite appears at destX
            ctx.drawImage(
                this.image,
                sx,
                sy,
                frameWidth,
                frameHeight,
                -destX - dw, // mirror around Y-axis
                destY,
                dw,
                dh,
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                this.image,
                sx,
                sy,
                frameWidth,
                frameHeight,
                destX,
                destY,
                dw,
                dh,
            );
        }
    }
}