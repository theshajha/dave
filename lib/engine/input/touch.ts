import { InputCore } from './core';

export function registerTouch(core: InputCore) {
    document.addEventListener('touchstart', e => {
        if (!(e.target as Element)?.closest('.game-element')) return;
        core.emit('touch-start', {});
    }, { passive: false });
    document.addEventListener('touchend', e => {
        if (!(e.target as Element)?.closest('.game-element')) return;
        core.emit('touch-end', {});
    }, { passive: false });
} 