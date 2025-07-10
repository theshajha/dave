import { Bounds, CollisionResult, CollisionSide, Vector2D } from './types';

/**
 * Vector2D utility functions
 */
export const Vector2DUtils = {
    create: (x: number = 0, y: number = 0): Vector2D => ({ x, y }),

    add: (a: Vector2D, b: Vector2D): Vector2D => ({
        x: a.x + b.x,
        y: a.y + b.y,
    }),

    subtract: (a: Vector2D, b: Vector2D): Vector2D => ({
        x: a.x - b.x,
        y: a.y - b.y,
    }),

    multiply: (v: Vector2D, scalar: number): Vector2D => ({
        x: v.x * scalar,
        y: v.y * scalar,
    }),

    distance: (a: Vector2D, b: Vector2D): number => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    normalize: (v: Vector2D): Vector2D => {
        const length = Math.sqrt(v.x * v.x + v.y * v.y);
        if (length === 0) return { x: 0, y: 0 };
        return { x: v.x / length, y: v.y / length };
    },

    lerp: (a: Vector2D, b: Vector2D, t: number): Vector2D => ({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
    }),

    clone: (v: Vector2D): Vector2D => ({ x: v.x, y: v.y }),
};

/**
 * Bounds utility functions
 */
export const BoundsUtils = {
    create: (x: number, y: number, width: number, height: number): Bounds => ({
        x, y, width, height,
    }),

    intersects: (a: Bounds, b: Bounds): boolean => {
        return !(
            a.x + a.width < b.x ||
            b.x + b.width < a.x ||
            a.y + a.height < b.y ||
            b.y + b.height < a.y
        );
    },

    contains: (bounds: Bounds, point: Vector2D): boolean => {
        return (
            point.x >= bounds.x &&
            point.x <= bounds.x + bounds.width &&
            point.y >= bounds.y &&
            point.y <= bounds.y + bounds.height
        );
    },

    center: (bounds: Bounds): Vector2D => ({
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2,
    }),

    expand: (bounds: Bounds, amount: number): Bounds => ({
        x: bounds.x - amount,
        y: bounds.y - amount,
        width: bounds.width + amount * 2,
        height: bounds.height + amount * 2,
    }),
};

/**
 * Collision detection utilities
 */
export const CollisionUtils = {
    checkAABB: (a: Bounds, b: Bounds): CollisionResult => {
        const hasCollision = BoundsUtils.intersects(a, b);

        if (!hasCollision) {
            return { hasCollision: false };
        }

        // Determine collision side based on overlap
        const overlapLeft = (a.x + a.width) - b.x;
        const overlapRight = (b.x + b.width) - a.x;
        const overlapTop = (a.y + a.height) - b.y;
        const overlapBottom = (b.y + b.height) - a.y;

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        let side: CollisionSide;
        if (minOverlap === overlapTop) side = 'top';
        else if (minOverlap === overlapBottom) side = 'bottom';
        else if (minOverlap === overlapLeft) side = 'left';
        else side = 'right';

        return { hasCollision: true, side };
    },

    resolveCollision: (movingBounds: Bounds, staticBounds: Bounds, side: CollisionSide): Vector2D => {
        const correction = Vector2DUtils.create();

        switch (side) {
            case 'top':
                correction.y = staticBounds.y - (movingBounds.y + movingBounds.height);
                break;
            case 'bottom':
                correction.y = (staticBounds.y + staticBounds.height) - movingBounds.y;
                break;
            case 'left':
                correction.x = staticBounds.x - (movingBounds.x + movingBounds.width);
                break;
            case 'right':
                correction.x = (staticBounds.x + staticBounds.width) - movingBounds.x;
                break;
        }

        return correction;
    },
};

/**
 * Math utilities
 */
export const MathUtils = {
    clamp: (value: number, min: number, max: number): number => {
        return Math.max(min, Math.min(max, value));
    },

    lerp: (a: number, b: number, t: number): number => {
        return a + (b - a) * t;
    },

    map: (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
        return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
    },

    degToRad: (degrees: number): number => {
        return (degrees * Math.PI) / 180;
    },

    radToDeg: (radians: number): number => {
        return (radians * 180) / Math.PI;
    },

    randomBetween: (min: number, max: number): number => {
        return Math.random() * (max - min) + min;
    },

    randomInt: (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};

/**
 * Timing utilities
 */
export const TimeUtils = {
    now: (): number => performance.now(),

    deltaTime: (lastTime: number, currentTime: number): number => {
        return (currentTime - lastTime) / 1000; // Convert to seconds
    },

    fps: (deltaTime: number): number => {
        return Math.round(1 / deltaTime);
    },

    throttle: <T extends (...args: any[]) => void>(
        func: T,
        delay: number
    ): T => {
        let lastCall = 0;
        return ((...args: any[]) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func(...args);
            }
        }) as T;
    },

    debounce: <T extends (...args: any[]) => void>(
        func: T,
        delay: number
    ): T => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return ((...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        }) as T;
    },
};

/**
 * Color utilities
 */
export const ColorUtils = {
    hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    },

    rgbToHex: (r: number, g: number, b: number): string => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    },

    rgba: (r: number, g: number, b: number, a: number = 1): string => {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    },
};

/**
 * Array utilities
 */
export const ArrayUtils = {
    shuffle: <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    randomElement: <T>(array: T[]): T | undefined => {
        return array[Math.floor(Math.random() * array.length)];
    },

    chunk: <T>(array: T[], size: number): T[][] => {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    },
};

/**
 * DOM utilities
 */
export const DOMUtils = {
    isTouch: (): boolean => {
        if (typeof window === 'undefined') return false;
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    getCanvasContext: (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D context from canvas');
        }

        // Optimize canvas for pixel art
        context.imageSmoothingEnabled = false;
        (context as any).webkitImageSmoothingEnabled = false;
        (context as any).mozImageSmoothingEnabled = false;
        (context as any).msImageSmoothingEnabled = false;

        return context;
    },

    resizeCanvas: (canvas: HTMLCanvasElement, width: number, height: number, scale: number = 1): void => {
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const context = canvas.getContext('2d');
        if (context && scale !== 1) {
            context.scale(scale, scale);
        }
    },
};

/**
 * Storage utilities
 */
export const StorageUtils = {
    set: (key: string, value: any): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    },

    get: <T>(key: string, defaultValue: T): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn('Failed to read from localStorage:', error);
            return defaultValue;
        }
    },

    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    },

    clear: (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.warn('Failed to clear localStorage:', error);
        }
    },
};

/**
 * Asset loading utilities
 */
export const AssetUtils = {
    loadImage: (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    loadAudio: (src: string): Promise<HTMLAudioElement> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => resolve(audio);
            audio.onerror = reject;
            audio.src = src;
        });
    },

    preloadAssets: async (urls: string[]): Promise<HTMLImageElement[]> => {
        const promises = urls.map(url => AssetUtils.loadImage(url));
        return Promise.all(promises);
    },
}; 