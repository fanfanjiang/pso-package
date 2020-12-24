
import { raf } from "./raf";

export function aniscrollTo(wrapper, target, duration = 300) {
    const wrapperRect = wrapper.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    try {
        wrapper.scrollTop = targetRect.top + wrapper.scrollTop - wrapperRect.top;
    } catch (error) {
    }
};
