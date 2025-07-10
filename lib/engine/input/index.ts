import { DEFAULT_KEYS } from '@/lib/utils/constants';
import { DOMUtils } from '@/lib/utils/helpers';
import { InputState } from '@/lib/utils/types';
import { InputCore } from './core';
import { registerKeyboard } from './keyboard';
import { KeyMap } from './mappings';
import { registerTouch } from './touch';

export class InputManager extends InputCore {
    keyMappings: KeyMap = { ...DEFAULT_KEYS };
    isTouch = DOMUtils.isTouch();
    constructor() {
        super();
        registerKeyboard(this, this.keyMappings);
        if (this.isTouch) registerTouch(this);
        window.addEventListener('blur', () => { this.clear(); this.emit('window-blur'); });
        window.addEventListener('focus', () => this.emit('window-focus'));
    }
    update(_dt: number) {/* placeholder for future buffering */ }
    setTouchInput(act: keyof InputState, val: boolean) { this.state[act] = val; }
    setEnabled(en: boolean) { this.enabled = en; if (!en) this.clear(); }
    setKeyMappings(m: Partial<KeyMap>) { this.keyMappings = { ...this.keyMappings, ...m }; }
    destroy() {/* TODO remove listeners if needed */ }
} 