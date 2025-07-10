import { InputCore } from './core';
import { KeyMap, actionFromKey, isGameKey } from './mappings';

export function registerKeyboard(core: InputCore, map: KeyMap) {
    const down = (e: KeyboardEvent) => {
        const act = actionFromKey(e.code, map);
        if (act && !core.state[act]) { core.state[act] = true; core.emit(`key-${act}-down`, { key: e.code }); }
    };
    const up = (e: KeyboardEvent) => {
        const act = actionFromKey(e.code, map);
        if (act && core.state[act]) { core.state[act] = false; core.emit(`key-${act}-up`, { key: e.code }); }
    };
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    document.addEventListener('keydown', e => { if (isGameKey(e.code, map)) e.preventDefault(); });
} 