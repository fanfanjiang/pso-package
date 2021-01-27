export const TYPE = [
    { v: "0", n: "纯脚本" },
    { v: "1", n: "psoscript" },
    { v: "2", n: "pso纯脚本" },
];

export const OP = [
    { v: "0", n: "选择" },
    { v: "1", n: "插入" },
    { v: "2", n: "更新" },
    { v: "3", n: "插入或更新" },
    { v: "4", n: "删除" },
];

export const OPTYPE = [
    { v: "0", n: "表单" },
    { v: "1", n: "包含记录" },
];

export const RELATE = [
    { v: "0", n: "单表" },
    { v: "1", n: "子查主表" },
    { v: "2", n: "主查子表" },
    { v: "3", n: "ALL" },
];

export const FORMULAR = [
    { v: "0", n: "无" },
    { v: "1", n: "等于" },
    { v: "2", n: "加" },
    { v: "3", n: "减" },
    { v: "4", n: "乘" },
    { v: "5", n: "除" },
];

export const CONDITION = [
    { v: "0", n: "否" },
    { v: "1", n: "是" },
];

export const INDEX = [
    { n: "CONFIRM", v: "$CONFIRM;select count(1) from T[] where;$" },
    { n: "NEXT", v: "NEXT||SELECT COUNT(1) FROM" },
    { n: "LINKLEAF", v: "COPYLEAF||@main@||主表子表字段||@sub@" },
    { n: "COPYLEAF", v: "LINKLEAF||@main@||主表子表字段" },
    { n: "OVERRUN", v: "OVERRUN||psoscript" },
    { n: "FIELDLEAF", v: "FIELDLEAF||@main@||主表字段||主表关联字段||子表关联字段" },
];

export const NOTICE_WAY = [
    { v: "0", n: "默认" },
    { v: "1", n: "登录强制提醒" },
];

export const MSG_SENDER = [
    { v: "0", n: "system" },
    { v: "1", n: "当前用户" },
];

export const MSG_TARGET = [
    { v: "0", n: "系统内" },
    { v: "1", n: "其它平台" },
];

export const MSG_RECEIVER = [
    { v: "0", n: "用户" },
    { v: "1", n: "部门" },
    { v: "2", n: "职位" },
    { v: "3", n: "岗位" },
    { v: "4", n: "所有人" },
];

export const MSG_EXPIRE_HANDLER = [
    { v: "0", n: "不处理" },
    { v: "1", n: "催发" },
    { v: "2", n: "直接关闭" },
];

export const MSG_FIELDS = [
    { fieldDisplay: "主键", field_name: "主键", _fieldValue: "msg_id", is_sys: "1", efield: '' },
    { fieldDisplay: "消息标题", field_name: "消息标题", _fieldValue: "msg_title", is_sys: "1", efield: '' },
    { fieldDisplay: "消息主体", field_name: "消息主体", _fieldValue: "msg_body", is_sys: "1", efield: '' },
    { fieldDisplay: "消息分类", field_name: "消息分类", _fieldValue: "msg_type", is_sys: "1", efield: '' },
    { fieldDisplay: "消息子类", field_name: "消息子类", _fieldValue: "msg_sub_type", is_sys: "1", efield: '' },
    { fieldDisplay: "消息引导URL", field_name: "消息引导URL", _fieldValue: "msg_url", is_sys: "1", efield: '' },
    { fieldDisplay: "提醒方式", field_name: "提醒方式", _fieldValue: "msg_notice", is_sys: "1", efield: '' },
    { fieldDisplay: "第三方平台", field_name: "第三方平台", _fieldValue: "msg_notice_other", is_sys: "1", efield: '' },
    { fieldDisplay: "发送主体", field_name: "发送主体", _fieldValue: "msg_sender", is_sys: "1", efield: '' },
    { fieldDisplay: "收件编号", field_name: "收件编号", _fieldValue: "msg_rec_id", is_sys: "1", efield: '' },
    { fieldDisplay: "收件人", field_name: "收件人", _fieldValue: "msg_receiver", is_sys: "1", efield: '' },
    { fieldDisplay: "消息状态", field_name: "消息状态", _fieldValue: "msg_status", is_sys: "1", efield: '' },
    { fieldDisplay: "到期时间", field_name: "到期时间", _fieldValue: "msg_expire", is_sys: "1", efield: '' },
    { fieldDisplay: "到期处理方式", field_name: "到期处理方式", _fieldValue: "msg_expire_act", is_sys: "1", efield: '' },
    { fieldDisplay: "消息目标", field_name: "消息目标", _fieldValue: "msg_goal", is_sys: "1", efield: '' },
];

export default {
    TYPE,
    OP,
    OPTYPE,
    RELATE,
    FORMULAR,
    CONDITION,
    INDEX,
    MSG_FIELDS,
    NOTICE_WAY,
    MSG_SENDER,
    MSG_TARGET,
    MSG_RECEIVER,
    MSG_EXPIRE_HANDLER
}

