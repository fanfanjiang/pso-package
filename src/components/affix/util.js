import addEventListener from '../../utils/dom/addEventListener'

export function getTargetRect(target) {
    return target === window ? { top: 0, bottom: window.innerHeight } : target.getBoundingClientRect();
}

export function getFixedTop(affix, target, top) {
    if (typeof top !== 'undefined' && affix && target) {
        if (affix.top - target.top < top) {
            return `${target.top + top}px`;
        }
    }
    return undefined;
}

export function getFixedBottom(affix, target, bottom) {
    if (typeof bottom !== 'undefined' && affix && target) {
        if (target.bottom - affix.bottom < bottom) {
            return `${window.innerHeight - target.bottom + bottom}px`;
        }
    }
    return undefined;
}

const EVENTS = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];

const targets = [];
export function addTargetListener(target, affix) {
    if (!target) return;

    let targeted = _.find(targets, { target });
    if (targeted) {
        targeted.list.push(affix)
    } else { 
        targeted = { target, list: [affix], events: {} };
        targets.push(targeted);
        EVENTS.forEach(evt => {
            targeted.events[evt] = addEventListener(target, evt, (e) => {
                targeted.list.forEach(item => {
                    item.lazyUpdatePosition();
                })
            });
        })
    }
}

export function removeTargetListener(affix) {
    let index;
    for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const hasAffix = t.list.some(a => a === affix);
        if (hasAffix) {
            t.list = t.list.filter(a => a !== affix);
            index = i;
        }
    }
    if (typeof index !== 'undefined' && !targets[index].list.length) {
        EVENTS.forEach(evt => {
            const handler = targets[index].events[evt];
            if (handler && handler.remove) {
                handler.remove();
            }
        })
        targets.splice(index, 1);
    }
}