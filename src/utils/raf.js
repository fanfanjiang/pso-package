let lastTime = Date.now();
function fallback(fn) {
    let nowTime = Date.now();
    let time = Math.max(0, 16 - (nowTime - lastTime));
    let id = setTimeout(fn, time);
    lastTime = nowTime + time;
    return id;
}

const iRaf = window.requestAnimationFrame || fallback;
const iCRaf = window.cancelAnimationFrame || window.clearTimeout;

export function raf(fn) {
    return iRaf.call(window, fn);
}

export function cancelRaf(id) {
    iCRaf.call(window, id);
}