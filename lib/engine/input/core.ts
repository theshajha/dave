import { InputState } from '@/lib/utils/types';

export class InputCore {
    state: InputState = { left: false, right: false, jump: false, action: false, down: false, pause: false };
    readonly ev = new Map<string, Function[]>();
    enabled = true;
    on(e: string, cb: Function) { (this.ev.get(e) ?? this.ev.set(e, []).get(e)!).push(cb); }
    off(e: string, cb: Function) { this.ev.set(e, (this.ev.get(e) || []).filter(f => f !== cb)); }
    emit(e: string, d?: any) { (this.ev.get(e) || []).forEach(f => f(d)); }

    clear() { Object.keys(this.state).forEach(k => this.state[k as keyof InputState] = false); }
    isPressed(a: keyof InputState) { return this.state[a]; }
    getInputState() { return { ...this.state }; }
    isMoving() { return this.state.left || this.state.right; }
    dir() { return this.state.left && this.state.right ? 0 : this.state.left ? -1 : this.state.right ? 1 : 0; }
} 