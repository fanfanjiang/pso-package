import { CPNT } from "@/const/form";
import shortid from 'shortid';
import Vue from 'vue';

const defalutCpntData = [
    { n: '_fieldType', v: 'String' }, { n: '_deletable', v: true }, { n: '_fvEditable', v: true }, { n: '_fieldRealType', v: 'string' }, { n: '_defaultValue', v: '' }, { n: '_fieldValue', v: '' },
    { n: '_fieldLen', v: 300 }, { n: '_required', v: false }, { n: '_read', v: false },
    { n: '_hideOnNew', v: false }, { n: '_hideForever', v: false }, { n: '_placeholder', v: '' }, { n: '_fieldInfo', v: '' },
    { n: '_unique', v: false }, { n: '_auth', v: [] }
]

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

            } while (target.fid.indexOf('-') !== -1)
        }
    }

    Vue.set(target, '_fieldName', target._fieldName || target.name);


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