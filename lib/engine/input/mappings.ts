import { DEFAULT_KEYS } from '@/lib/utils/constants';
import { InputState } from '@/lib/utils/types';

export type KeyMap = typeof DEFAULT_KEYS;

export function actionFromKey(code: string, map: KeyMap): keyof InputState | null {
    const entries = Object.entries(map) as [keyof KeyMap, string][];
    for (const [act, key] of entries) if (key === code) return act.toLowerCase() as keyof InputState;
    return null;
}

export function isGameKey(code: string, map: KeyMap) { return Object.values(map).includes(code as any); } 