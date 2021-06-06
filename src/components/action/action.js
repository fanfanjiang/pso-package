//动作
export default class Action {
    constructor(options) {
        this.doing = false;
        for (let op in options) {
            if (options.hasOwnProperty(op) && typeof options[op] !== 'undefined') {
                this[op] = options[op];
            }
        }
    }

    get _code() {
        return this.formStore.data_code;
    }

    transform(data) {
        if (!this.trans || !this.trans.length) {
            return data;
        }
        if (Array.isArray(data)) {
            return data.map(d => this.transSingle(d));
        }
        return this.transSingle(data);
    }

    transSingle(data) {
        if (!this.trans || !this.trans.length) {
            return data;
        }
        const cloneData = {};
        for (let t of this.trans) {
            if (t.tf && t.sf) {
                cloneData[t.tf] = data[t.sf] || ''
            }
        }
        return cloneData;
    }
}