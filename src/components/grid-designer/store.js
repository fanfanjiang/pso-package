
import Vue from 'vue';
import API from "../../service/api.js";
import { CPNT } from "./const";

import shortid from "shortid";

class Grid {
    constructor(options) {

        this.code = '';
        this.initializing = true;
        this.data = [];
        this.$vue = {};

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }
    }

    async initialize() {
        this.initializing = true;
        const ret = await API.getTreeNode({ code: this.code });
        const { tp_config } = ret.data.data;
        if (tp_config) {
            JSON.parse(tp_config).forEach(cpnt => {
                this.addCPNT(cpnt)
            })
        }
        this.initializing = false;
    }

    addCPNT(cpnt) {
        if (typeof cpnt === 'string') {
            cpnt = CPNT[cpnt];
        }

        const { id, n, w, h } = CPNT;
        const data = { i: shortid.generate(), id, n, w, h, data: {} };

        if (typeof x === 'undefined' || typeof y === 'undefined') {
            this.getLocation(data)
        }

        this.data.push({ ...data, ...this.getLocation(data) });
    }

    delCPNT() {

    }

    getLocation(from) {
        if (!this.data.length) return { x: 0, y: 0 };
        const preCPNT = this.data[this.data.length - 1];
        let x = preCPNT.x + preCPNT.w;
        x = x + from.w > 24 ? 0 : x;
        let y = x === 0 ? preCPNT.y + preCPNT.h : preCPNT.y;
        return { x, y };
    }
}