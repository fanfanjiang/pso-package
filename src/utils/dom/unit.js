export default class DomUnit {
    constructor() {
        const testDom = document.createElement('div');
        testDom.style.width = '1cm';
        document.body.appendChild(testDom);
        const width = getComputedStyle(testDom, null).width;
        this.radio = width.substr(0, width.length - 2);
        testDom.parentNode.removeChild(testDom);
    }

    mmToPx(mm) {
        return mm * this.radio / 10;
    }

    pxToMm(px) {
        return px / this.radio * 10;
    }
}