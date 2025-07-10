import { GAME_STATES, PERFORMANCE_CONFIG } from '@/lib/utils/constants';
import { TimeUtils } from '@/lib/utils/helpers';
import { renderDebug as rDbg } from '../debug/renderDebug';
import {
    renderGameOver as rG,
    renderLoading as rL,
    renderLevelComplete as rLC,
    renderMenu as rM,
    renderPaused as rP,
    renderPlaying as rPl,
    renderVictory as rV,
    updateGameOver as uG,
    updateLoading as uL,
    updateLevelComplete as uLC,
    updateMenu as uM,
    updatePaused as uP,
    updatePlaying as uPl,
    updateVictory as uV,
} from '../states/index';

export function initLoop(engine: any) {
    engine.performanceMetrics = engine.performanceMetrics || { fps: 0, frameTime: 0, updateTime: 0, renderTime: 0, entityCount: 0, memoryUsage: 0 };
    let running = false, last = 0, af: number | null = null;

    const tick = () => {
        if (!running) return;
        const now = TimeUtils.now();
        const dt = Math.min(TimeUtils.deltaTime(last, now), PERFORMANCE_CONFIG.MAX_DELTA_TIME / 1000);
        last = now;

        if (dt >= 0.001 && !engine.gameState.isPaused) {
            // Update
            switch (engine.currentGameStateType) {
                case GAME_STATES.LOADING: uL(engine, dt); break;
                case GAME_STATES.MENU: uM(engine, dt); break;
                case GAME_STATES.PLAYING: uPl(engine, dt); break;
                case GAME_STATES.PAUSED: uP(engine, dt); break;
                case GAME_STATES.GAME_OVER: uG(engine, dt); break;
                case GAME_STATES.LEVEL_COMPLETE: uLC(engine, dt); break;
                case GAME_STATES.VICTORY: uV(engine, dt); break;
            }
        }

        // Render
        switch (engine.currentGameStateType) {
            case GAME_STATES.LOADING: rL(engine); break;
            case GAME_STATES.MENU: rM(engine); break;
            case GAME_STATES.PLAYING: rPl(engine); break;
            case GAME_STATES.PAUSED: rP(engine); break;
            case GAME_STATES.GAME_OVER: rG(engine); break;
            case GAME_STATES.LEVEL_COMPLETE: rLC(engine); break;
            case GAME_STATES.VICTORY: rV(engine); break;
        }
        if (engine.config?.debug?.showFPS) rDbg(engine);
        af = requestAnimationFrame(tick);
    };

    engine.start = () => { if (running) return; running = true; last = TimeUtils.now(); tick(); };
    engine.stop = () => { running = false; if (af) cancelAnimationFrame(af); af = null; };
    engine.pause = () => { engine.gameState.isPaused = true; };
    engine.resume = () => { engine.gameState.isPaused = false; last = TimeUtils.now(); };
} 