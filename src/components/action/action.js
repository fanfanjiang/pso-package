
//动作
export default class Action {
    constructor(options) {

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
        if (Array.isArray(data)) {
            data.forEach(d => this.transSingle(d));
            return data;
        }
        return this.transSingle(data);
    }

    transSingle(data) {
        if (!this.trans || !this.trans.length) {
            return data;
        }
        for (let t of this.trans) {
            if (t.tf && t.sf) {
                data[t.tf] = data[t.sf] || ''
            }
        }
        return data;
    }
}