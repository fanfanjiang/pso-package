import XLSX from 'xlsx';
import x2js from 'x2js';
import Vue from 'vue';

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

export async function parseXML(file) {
    let input = await readFile(file);
    let xjs = new x2js({ attributePrefix: '' });
    return xjs.xml2js(input);
}

export async function checkUniq(data, field) {
    let fieldNames = _.map(data, field);
    return (_.uniq(fieldNames).length !== fieldNames.length) ? false : true;
}

export function formatJSONList(list, fieldObj, compare = true) {
    let data = list;
    if (typeof list === 'string') {
        data = JSON.parse(list);
    }
    for (let item of data) {
        for (let fKey in fieldObj) {
            if (!item.hasOwnProperty(fKey) || (typeof item[fKey] === "object" && typeof fieldObj[fKey] !== 'object') || (typeof item[fKey] !== "object" && typeof fieldObj[fKey] === 'object')) {
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

export function assignList({ target, source, base, tid, sid, assemble }) {
    target.forEach((t, i) => {
        const exist = _.find(source, { [sid]: t[tid] });
        if (!exist) {
            delete target[i]
        }
    })
    source.forEach(s => {
        const exist = _.find(target, { [tid]: s[sid] });
        if (exist) {
            formatJSONList([exist], base)
        } else {
            target.push({ ...base, ...assemble(s) })
        }
    })
}

