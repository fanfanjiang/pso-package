export const REVIEW_TYPE = {
    tag: {
        name: '快速标签审批',
        id: "tag"
    },
    opinion: {
        name: '意见审批',
        id: "opinion"
    },
    sign: {
        name: '会签审批',
        id: "sign"
    },
    form: {
        name: '表单',
        id: "form"
    }
}

export const REVIEW_STATUS = {
    save: {
        name: '待提交',
        id: "save",
        value: 0,
        stamp: "待提交",
        color: "#2d8cf0"
    },
    submited: {
        name: '审批中',
        id: "submited",
        value: 1,
        stamp: "审批中",
        color: "#2d8cf0"
    },
    pass: {
        name: '审批通过',
        id: "pass",
        value: 8,
        stamp: "审批<br>通过",
        color: "#67C23A"
    },
    reject: {
        name: '审批拒绝',
        id: "reject",
        value: 2,
        stamp: "审批<br>拒绝",
        color: "#F56C6C"
    },
    backout: {
        name: '已撤销',
        id: "backout",
        value: 7,
        stamp: "已撤销",
        color: "#909399"
    },
    archive: {
        name: '已归档',
        id: "archive",
        value: 9,
        stamp: "已归档",
        color: "#E6A23C"
    }
}

export const REVIEW_OP_TYPE = {
    confirm: {
        name: '通过',
        id: "confirm",
        type: 'next',
        value: 2,
        scriptable: true,
        updatable: true
    },
    end: {
        name: '结束',
        id: "end",
        type: 'finish',
        value: 4,
        scriptable: true,
        updatable: true
    },
    rollback: {
        name: '回退',
        id: "rollback",
        type: 'back',
        value: 8,
        scriptable: true,
        updatable: true
    },
    reject: {
        name: '打回',
        id: "reject",
        type: 'return',
        value: 16,
        scriptable: true,
        updatable: true
    },
    pickreject: {
        name: '指定',
        id: "pickreject",
        type: 'appoint',
        value: 32
    },
    copy: {
        name: '抄送',
        id: "copy",
        type: 'copy',
        value: 64
    },
    distribute: {
        name: '分发',
        id: "distribute",
        type: 'distribute',
        value: 128
    },
    countersign: {
        name: '转交',
        id: "countersign",
        type: 'append',
        value: 256
    },
    sign: {
        name: '加签',
        id: "sign",
        type: 'sign',
        value: 514
    }
}

export const REVIEW_OP_APPEND = 'append';

export const REVIEW_OP_USER = [REVIEW_OP_TYPE.copy.type, REVIEW_OP_TYPE.distribute.type, REVIEW_OP_TYPE.countersign.type, REVIEW_OP_TYPE.sign.type];

export const REVIEW_AUTH_TYPE = {
    anybody: {
        name: '指定用户任一',
        id: "anybody",
        value: 0,
        idName: 'user_id',
        opaId: 'uid',
        opaName: 'user_name'
    },
    one: {
        name: '指定用户',
        id: "one",
        value: 1,
        idName: 'user_id',
        opaId: 'uid',
        opaName: 'user_name'
    },
    anyPosition: {
        name: '指定职位任一',
        id: "anyPosition",
        value: 2,
        idName: 'duty_id',
        opaId: 'did',
        opaName: 'duty_name'
    },
    position: {
        name: '指定职位',
        id: "position",
        value: 3,
        idName: 'duty_id',
        opaId: 'did',
        opaName: 'duty_name'
    },
    anyJob: {
        name: '指定岗位任一',
        id: "anyJob",
        value: 4,
        idName: 'post_id',
        opaId: 'pid',
        opaName: 'post_name'
    },
    job: {
        name: '指定岗位',
        id: "job",
        value: 5,
        idName: 'post_id',
        opaId: 'pid',
        opaName: 'post_name'

    }
}

export const WF_IMPORTANCE = ['普通', '重要', '非常重要'];
export const WF_SECTRE = ['普通', '秘密', '机密', '绝密'];
export const WF_URGENT = ['普通', '急件', '加急', '特急'];

export const WF_TAG_TEXT_PASS = ['通过', '同意', '没问题'];
export const WF_TAG_TEXT_REJECT = ['不同意', '请完善'];


export const UPDATE_TYPE = [{
    include: ['time'],
    type: 'date'
}]

export const REVIEW_LOG_FORMAT = [
    { name: "审核人", id: "#man#" },
    { name: "审核时间", id: "#time#" },
    { name: "审核意见", id: "#content#" }
]

export const WF_AUTH_TYPE = [
    { n: "正常流程", v: 0 },
    { n: "仅保留重复审批人第一步", v: 1 },
    { n: "仅保留重复审批人最后一步", v: 2 }
]

export const WF_FIELD_AUTH = [
    { n: "查看", v: 1 },
    { n: "编辑", v: 2 },
    { n: "必填", v: 4 },
];

export const WF_EMPTY_TYPE = [
    { n: "流程中选择", v: '0' },
    { n: "第一步选择", v: '1' },
    { n: "绑定表单字段", v: '2' },
];