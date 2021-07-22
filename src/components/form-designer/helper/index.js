import { CPNT } from "../../../const/form";
import shortid from 'shortid';
import Vue from 'vue';
import { checkUntransField } from "../../../tool/form";

const defalutCpntData = [
    { n: '_fieldType', v: 'String' },
    { n: '_deletable', v: true },
    { n: '_fvEditable', v: true },
    { n: '_fieldRealType', v: 'string' },
    { n: '_defaultValue', v: '' },
    { n: '_association', v: '' },
    { n: '_astchangeType', v: '1' },
    { n: '_fieldValue', v: '' },
    { n: '_fieldLen', v: 50 },
    { n: '_required', v: false },
    { n: '_read', v: false },
    { n: '_hideOnNew', v: false },
    { n: '_hideForever', v: false },
    { n: '_placeholder', v: '' },
    { n: '_fieldInfo', v: '' },
    { n: '_unique', v: false },
    { n: '_auth', v: [] },
    { n: '_regular', v: '' },
    { n: '_fieldFormat', v: 'common' },
    { n: '_outputFormat', v: '' },
    { n: '_transFields', v: '' },
    { n: '_height', v: '' },
    { n: '_autofocus', v: false },
    { n: '_encry', v: '0' },
    { n: '_fieldCoding', v: 'uth8' },
]

export function transferCpnt(target, componentid) {
    for (let key in target) {
        if (!['fid', '_fieldValue', '_deletable', '_fieldName'].includes(key)) {
            Vue.delete(target, key);
            delete target[key];
        }
    }
    target.componentid = componentid;
    genComponentData(target);
}

export function genComponentData(target) {

    if (!target.componentid) throw new Error('componentid required');
    const _CPNT = CPNT[target.componentid];
    if (!_CPNT) return null;

    const explicit = function (v) {
        return typeof v === 'object' ? _.cloneDeep(v) : v;
    }

    if (typeof target.fid === 'undefined' || target.fid === '') {
        if (target._fieldValue) {
            target.fid = target._fieldValue;
        } else {
            do {
                target.fid = shortid.generate();
            } while (
                target.fid.indexOf('-') !== -1
                || /^[0-9]/.test(target.fid)
                || checkUntransField(target.fid)
            );
            Vue.set(target, '_fieldValue', target.fid);
        }
    }

    Vue.set(target, '_fieldName', target._fieldName || target.name || _CPNT.name);

    if (_CPNT.data) {
        _CPNT.data.forEach(field => {
            Vue.set(target, field.n, typeof target[field.n] !== 'undefined' ? target[field.n] : explicit(field.v))
        });
    }

    defalutCpntData.forEach(field => {
        Vue.set(target, field.n, typeof target[field.n] !== 'undefined' ? target[field.n] : explicit(field.v))
    });

    return target;
}