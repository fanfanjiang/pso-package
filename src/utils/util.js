import XLSX from 'xlsx';
import Vue from 'vue';
import dayjs from "dayjs";

export function listToTree({ list, pid = "pid", children = "children", id = "id", each, afterPush, beforePush }) {
    let map = {};
    let tree = [];
    list.forEach(item => {
        each && each(item);
        map[item[id]] = item
    });
    list.forEach(item => {
        let parent = map[item[pid]];
        if (parent) {
            !parent[children] && (parent[children] = []);

            if (beforePush) {
                if (beforePush(item, parent)) parent[children].push(item);
            } else {
                parent[children].push(item);
            }
            afterPush && afterPush(item, parent);
        } else {
            tree.push(item);
        }
    })
    return tree;
}

export function readFile(file) {
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
        reader.onload = (e => {
            var data = e.target.result;
            resolve(data)
        })
        reader.onerror = (error => {
            reject(error);
        })
    })
}

export async function parseXlsx(file) {
    let input = await readFile(file);
    let book = XLSX.read(input, { type: 'binary' }), result = {};
    book.SheetNames.forEach(function (name) {
        let sheet = book.Sheets[name],
            range = XLSX.utils.decode_range(sheet['!ref']),
            row_start = range.s.r, row_end = range.e.r,
            col_start = range.s.c, col_end = range.e.c,
            rows = [], row_data, i, cell;
        for (; row_start <= row_end; row_start++) {
            row_data = [];
            for (i = col_start; i <= col_end; i++) {
                cell = sheet[XLSX.utils.encode_col(i) + XLSX.utils.encode_row(row_start)];
                row_data.push(cell ? { t: cell.t, v: cell.v } : { v: '', t: 's' });
            }
            rows.push(row_data);
        }
        result[name] = rows;
    });
    return result;
}

export async function checkUniq(data, field) {
    let fieldNames = _.map(data, field);
    return (_.uniq(fieldNames).length !== fieldNames.length) ? false : true;
}

export function assignJSONDB(orgDB, baseDB, compare = true) {
    formatJSONList([orgDB], baseDB, compare);
    for (let k in orgDB) {
        if (!Array.isArray(baseDB[k]) && typeof baseDB[k] === 'object') {
            formatJSONList([orgDB[k]], baseDB[k], compare);
        }
    }
}

export function formatJSONList(list, fieldObj, compare = true) {
    let data = list;
    if (typeof list === 'string') {
        data = JSON.parse(list);
    }
    for (let item of data) {
        for (let fKey in fieldObj) {
            if (!item.hasOwnProperty(fKey)) {
                Vue.set(item, fKey, _.cloneDeep(fieldObj[fKey]));
            }
        }
        if (compare) {
            for (let key in item) {
                if (!fieldObj.hasOwnProperty(key)) {
                    Vue.delete(item, key);
                    delete item.key
                }
            }
        }

    }
    return data;
}

export function assignList({ target, source, base, tid, sid, assemble, replaceField = [] }) {
    for (let i = target.length - 1; i >= 0; i--) {
        const t = target[i];
        if (!t) {
            target.splice(i, 1);
            continue;
        }
        const exist = _.find(source, { [sid]: t[tid] });
        if (!exist) {
            target.splice(i, 1)
        }
    }
    source.forEach(s => {
        const exist = _.find(target, { [tid]: s[sid] });
        if (exist) {
            formatJSONList([exist], base);
            for (let k of replaceField) {
                if (typeof s[k] !== 'undefined') {
                    exist[k] = s[k]
                }
            }
        } else {
            if (assemble) {
                target.push({ ...base, ...assemble(s) })
            } else {
                target.push({ ...base, ...s })
            }
        }
    })
}

export function desensitize(val) {
    if (val) {
        let value = val + '';
        const length = Math.round(value.length / 2);
        const start = Math.floor((value.length - length) / 2);
        return value.replace(value.slice(start, length), new Array(length).fill('*').join(''));
    } else {
        return val;
    }
}

export function makeDimension(group, source, dim) {
    //按维度分组
    if (_.isEmpty(group)) {
        //第一次
        return _.groupBy(source, dim);
    }
    (function recursion(data) {
        for (let key of Object.keys(data)) {
            if (Array.isArray(data[key])) {
                data[key] = _.groupBy(data[key], dim);
            } else {
                recursion(data[key]);
            }
        }
    })(group);
    return group;
}

export function makeTimeAgo(time) {
    const _time = dayjs(time);
    const pattens = [{ v: 'years', t: '年' }, { v: 'month', t: '月' }, { v: 'day', t: '天' }, { v: 'hour', t: '小时' }, { v: 'minute', t: '分钟' }, { v: 'second', t: '秒' }];
    for (let { v, t } of pattens) {
        const _diff = dayjs().diff(_time, v);
        if (_diff > 0) {
            return `${_diff}${t}前`;
        }
    }
    return time;
}

export function matchRegExp(input, regStr) {
    const reg = new RegExp(regStr, 'g');
    const matches = []
    while (true) {
        const match = reg.exec(input);
        if (!match) break;
        matches.push(match[0]);
    }
    return matches;
}

export function decode16(str) {
    return str.replace(/\\x(\w{2})/g, function (_, $1) {
        return String.fromCharCode(parseInt($1, 16))
    });
}

export function decodejson(data) {
    for (let key in data) {
        if (data[key] && typeof data[key] === 'string') {
            data[key] = decode16(data[key])
        }
    }
}