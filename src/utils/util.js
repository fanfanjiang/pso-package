import XLSX from 'xlsx';
import x2js from 'x2js';

export function listToTree({ list, pid = "pid", children = "children", id = "id", afterPush, beforePush }) {
    let map = {};
    let tree = [];
    list.forEach(item => map[item[id]] = item);
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

export function formatJSONList(list, fieldObj) {
    let data = list;
    if (typeof list === 'string') {
        data = JSON.parse(list);
    }
    for (let item of data) {
        for (let key in item) {
            if (!fieldObj.hasOwnProperty(key)) {
                delete item.key
            }
        }
        Object.assign(item, { ...fieldObj }, { ...item });
    }
    return data;
}