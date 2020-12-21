import { CPNT, DEFAULT } from "./const";
import Module from "../plugin-module/store";

export default class Grid extends Module {

    static CPNT = CPNT;

    static DEFAULT = DEFAULT;

    constructor(options) {
        super(options);
        this.layout = [];
    }

    addCpnt(cpnt = {}, urine = {}) {
        const entity = super.addCpnt(cpnt, urine);
        const { x, y } = entity.data;
        if (typeof x === 'undefined' || typeof y === 'undefined') {
            Object.assign(entity.data, this.getLocation(entity.data))
        }
        return entity;
    }

    getLocation(from) {
        if (!this.data.length) return { x: 0, y: 0 };
        const preCPNT = this.data[this.data.length - 1];
        let x = preCPNT.data.x + preCPNT.data.w;
        x = x + from.w > 24 ? 0 : x;
        let y = x === 0 ? preCPNT.data.y + preCPNT.data.h : preCPNT.data.y;
        return { x, y };
    }

    register(cpnt) {
        super.register(cpnt);
        this.layout.push(cpnt.data);
    }

    deregister(i) {
        const index = super.deregister(i);
        if (index !== -1) {
            this.layout.splice(index, 1);
        }
    }
}