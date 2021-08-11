export const OCR_WAY = {
    0: {
        name: "离线",
        id: 0
    },
    1: {
        name: "在线",
        id: 1
    }
}

export const OCR_VENDOR = {
    '合合': {
        name: "合合",
        id: "合合",
        enable: {
            [OCR_WAY[0].id]: true,
            [OCR_WAY[1].id]: true,
        },
        params: {
            [OCR_WAY[0].id]: {
                ai_cert: { _fieldValue: 'ai_cert', _fieldName: 'AI事项', componentid: 'text', group: "api", _fieldLen: 200 },
                id_card: { _fieldValue: 'id_card', _fieldName: '身份证接口', componentid: 'text', group: "api", _fieldLen: 200 },
                bank_card: { _fieldValue: 'bank_card', _fieldName: '银行卡接口', componentid: 'text', group: "api", _fieldLen: 200 },
                b_lic: { _fieldValue: 'b_lic', _fieldName: '营业执照', componentid: 'text', group: "api", _fieldLen: 200 },
                stamp: { _fieldValue: 'stamp', _fieldName: '印章识别', componentid: 'text', group: "api", _fieldLen: 200 },
            },
            [OCR_WAY[1].id]: {
                ai_cert: { _fieldValue: 'ai_cert', _fieldName: 'AI事项', componentid: 'text', group: "api", _fieldLen: 200 },
                id_card: { _fieldValue: 'id_card', _fieldName: '身份证接口', componentid: 'text', group: "api", _fieldLen: 200 },
                bank_card: { _fieldValue: 'bank_card', _fieldName: '银行卡接口', componentid: 'text', group: "api", _fieldLen: 200 },
                b_lic: { _fieldValue: 'b_lic', _fieldName: '营业执照', componentid: 'text', group: "api", _fieldLen: 200 },
                appkey: { _fieldValue: 'appkey', _fieldName: 'APPKEY', componentid: 'text', group: "params" },
                appsecret: { _fieldValue: 'appsecret', _fieldName: 'APP密钥', componentid: 'text', group: "params" },
            }
        }
    },
    '百度': {
        name: "百度",
        id: "百度",
        enable: {
            [OCR_WAY[0].id]: false,
            [OCR_WAY[1].id]: false,
        },
    },
    '阿里云': {
        name: "阿里云",
        id: "阿里云",
        enable: {
            [OCR_WAY[0].id]: false,
            [OCR_WAY[1].id]: false,
        },
    }
}

export default {
    OCR_WAY,
    OCR_VENDOR
}