function userAgent(pattern) {
	if (typeof window !== 'undefined' && window.navigator) {
		return !!/*@__PURE__*/navigator.userAgent.match(pattern);
	}
}

export const IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
export const Edge = userAgent(/Edge/i);
export const FireFox = userAgent(/firefox/i);
export const Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
export const IOS = userAgent(/iP(ad|od|hone)/i);
export const ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

export function clearSelections() {
    if (window.getSelection) {
        var selection = window.getSelection();
        selection.removeAllRanges();
    } else if (document.selection && document.selection.empty) {
        document.selection.empty();
    }
}

const captureMode = {
	capture: false,
	passive: false
};

export function on(el, event, fn) {
    el.addEventListener(event, fn, !IE11OrLess && captureMode);
}


export function off(el, event, fn) {
    el.removeEventListener(event, fn, !IE11OrLess && captureMode);
}