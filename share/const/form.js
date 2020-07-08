const OP_TYPE = require('./op');
const OP_FILTER = require('./op-filter');

const CPNT = {
  text: {
    icon: "fa fa-font",
    name: "文本",
    componentid: "text",
    class: '',
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1 }],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_type', v: 'text' }, { n: '_scannable', v: false }, { n: '_scanType', v: 'qr' }]
  },
  number: {
    icon: "fa fa-sort-numeric-desc",
    name: "数值",
    componentid: "number",
    class: '',
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1 }],
    type: 'number',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    figure: true,
    data: [{ n: '_fieldRealType', v: 'decimal' }, { n: '_unit', v: '' }, { n: '_decimalPlaces', v: 0 }]
  },
  money: {
    icon: "fa fa-jpy",
    name: "金额",
    componentid: "money",
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1 }],
    type: 'number',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    figure: true,
    data: [{ n: '_fieldRealType', v: 'decimal' }, { n: '_unit', v: '' }, { n: '_decimalPlaces', v: 0 }]
  },
  select: {
    icon: "el-icon-turn-off",
    name: "单选",
    componentid: "select",
    op: [
      Object.assign({ match: 2 }, OP_TYPE.op1),
      Object.assign({ match: 3 }, OP_TYPE.op2),
    ],
    fop: [{ ...OP_FILTER.op1 }],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_showType', v: 'radio' }, { n: '_defaultValueList', v: [] }, { n: '_option', v: [{ _optionValue: '选项一', _optionName: '选项一' }, { _optionValue: '选项二', _optionName: '选项二' }] }]
  },
  unit: {
    icon: "el-icon-cpu",
    name: "单位",
    componentid: "unit",
    type: 'text',
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: false,
    data: [
      { n: '_type', v: 'radio' },
      { n: '_source', v: 'table' },
      { n: '_treeOptions', v: '' },
      { n: '_relateUnit', v: '' },
      { n: '_relateNum', v: '' },
      { n: '_relateStandardNum', v: '' },
      { n: '_relatePrice', v: '' },
      { n: '_relateSummary', v: '' },
      { n: '_relateWarehouse', v: '' },
      { n: '_relateStandardUnit', v: '' },
      { n: '_relateDisUnitName', v: '' },
      { n: '_relateStandardUnit', v: '' },
      { n: '_relateName', v: '' },
    ]
  },
  checkbox: {
    icon: "el-icon-set-up",
    name: "多选",
    componentid: "checkbox",
    op: [
      Object.assign({ match: 3 }, OP_TYPE.op1),
      Object.assign({ match: 3 }, OP_TYPE.op2),
    ],
    fop: [{ ...OP_FILTER.op1 }],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_defaultValueList', v: [] }, { n: '_option', v: [{ _optionValue: '选项一', _optionName: '选项一' }, { _optionValue: '选项二', _optionName: '选项二' }] }]
  },
  cascader: {
    icon: "el-icon-s-operation",
    name: "级联选择",
    componentid: "cascader",
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_option', v: [] }]
  },
  time: {
    icon: "el-icon-date",
    name: "日期",
    componentid: "time",
    op: [
      Object.assign({ match: 4 }, OP_TYPE.op1),
      Object.assign({ match: 4 }, OP_TYPE.op2),
      Object.assign({ match: 4 }, OP_TYPE.op3),
      Object.assign({ match: 4 }, OP_TYPE.op4),
      Object.assign({ match: 4 }, OP_TYPE.op5),
      Object.assign({ match: 4 }, OP_TYPE.op6),
    ],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_fieldRealType', v: 'datetime' }, { n: '_type', v: 'date' }, { n: '_defaultType', v: '' }]
  },
  phone: {
    icon: "el-icon-phone",
    name: "电话",
    componentid: "phone",
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_type', v: 'cellphone' }]
  },
  autoid: {
    icon: "fa fa-hashtag",
    name: "自动编号",
    componentid: "autoid",
    type: 'string',
    layout: false,
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_digit', v: '3' }, { n: '_format', v: '' }, { n: '_bind', v: '' }, { n: '_source', v: '#date##no#' }]
  },
  email: {
    icon: "fa fa-envelope",
    name: "邮箱",
    componentid: "email",
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true
  },
  area: {
    icon: "el-icon-place",
    name: "地区",
    componentid: "area",
    type: 'string',
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_type', v: 'county' }]
  },
  attachment: {
    icon: "el-icon-paperclip",
    name: "附件",
    componentid: "attachment",
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    chart: true,
    table_show: true,
    value_format_id: 'leaf_id',
    data: [{ n: '_limit', v: 5 }]
  },
  row: {
    icon: "el-icon-crop",
    name: "行",
    componentid: "row",
    class: 'unSubTable',
    layout: true,
    db: false,
    host_db: false,
    chart: false,
    table_show: false
  },
  div: {
    icon: "el-icon-crop",
    name: "列",
    componentid: "div",
    class: 'unSubTable',
    layout: true,
    db: false,
    host_db: false,
    chart: false,
    table_show: false
  },
  table: {
    icon: "fa fa-table",
    name: "表格",
    componentid: "table",
    class: 'unSubTable',
    layout: false,
    db: false,
    host_db: true,
    chart: false,
    table_show: true
  },
  asstable: {
    icon: "el-icon-share",
    name: "关联表",
    componentid: "asstable",
    class: 'unSubTable',
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: true,
    ass_db: true,
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    data: [{ n: '_option', v: '' }, { n: '_type', v: 1 }, { n: '_showFields', v: '' }, { n: '_new', v: true }, { n: '_relate', v: true }]
  },
  assfield: {
    icon: "el-icon-view",
    name: "关联字段",
    componentid: "assfield",
    class: 'unSubTable',
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: true,
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1, match: 1 }],
    data: [{ n: '_selectedTable', v: '' }, { n: '_selectedField', v: '' }]
  },
  summary: {
    icon: "el-icon-coin",
    name: "汇总",
    componentid: "summary",
    class: 'unSubTable',
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: true,
    figure: true,
    data: [{ n: '_fieldRealType', v: 'decimal' }, { n: '_selectedTable', v: '' }, { n: '_selectedField', v: '' }, { n: '_selectedOp', v: '' }, { n: '_unit', v: '' }, { n: '_decimalPlaces', v: 0 }],
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1, match: 1 }],
  },
  formula: {
    icon: "fa fa-superscript",
    name: "公式",
    componentid: "formula",
    class: 'unSubTable',
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: true,
    figure: true,
    data: [{ n: '_type', v: 1 }, { n: '_fieldRealType', v: 'decimal' }, { n: '_numComputeMode', v: '' }, { n: '_dateComputeMode', v: '' }
      , { n: '_unit', v: '' }, { n: '_decimalPlaces', v: '' }, { n: '_datasource', v: '' }],
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1, match: 1 }],
  },
  rate: {
    icon: "el-icon-star-off",
    name: "评分",
    componentid: "rate",
    type: 'number',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1 }],
  },
  credential: {
    icon: "fa fa-id-card-o",
    name: "证件",
    componentid: "credential",
    type: 'text',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_type', v: '1' }],
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
  },
  rich: {
    icon: "fa fa-header",
    name: "富文本",
    componentid: "rich",
    type: 'text',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    data: [{ n: '_fieldType', v: 'text' }],
    fop: [{ ...OP_FILTER.op1, match: 1 }],
  },
  user: {
    icon: "el-icon-user",
    name: "人员",
    componentid: "user",
    type: 'text',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    value_format_id: 'user_id',
    data: [{ n: '_type', v: 'radio' }, { n: '_defaultValType', v: 'choose' }, { n: '_bindForm', v: '' }, { n: '_bindFormField', v: '' }],
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1 }],
  },
  department: {
    icon: "fa fa-users",
    name: "部门",
    componentid: "department",
    type: 'text',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    value_format_id: 'node_id',
    data: [{ n: '_type', v: 'radio' }, { n: '_defaultValType', v: 'choose' }],
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1 }],
  },
  tag: {
    icon: "el-icon-s-help",
    name: "标签",
    componentid: "tag",
    type: 'text',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    value_format_id: 'node_id',
    data: [
      { n: '_type', v: 'radio' },
      { n: '_copy', v: false },
      { n: '_source', v: 'tree' },
      { n: '_treeOptions', v: '' }
    ],
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
    fop: [{ ...OP_FILTER.op1 }],
  },
  signature: {
    icon: "el-icon-edit",
    name: "签名",
    componentid: "signature",
    type: 'text',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: false
  },
  aiw: {
    icon: "fa fa-jpy",
    name: "大写金额",
    componentid: "aiw",
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: true,
    data: [{ n: '_option', v: '' }]
  },
  timerange: {
    icon: "el-icon-date",
    name: "时间范围",
    componentid: "timerange",
    type: 'text',
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: true,
    data: [{ n: '_type', v: '' }, { n: '_relatedField', v: '' }],
    op: [
      Object.assign({ match: 1 }, OP_TYPE.op1),
      Object.assign({ match: 1 }, OP_TYPE.op2),
      Object.assign({ match: 1 }, OP_TYPE.op3),
      Object.assign({ match: 1 }, OP_TYPE.op4),
      Object.assign({ match: 1 }, OP_TYPE.op5),
      Object.assign({ match: 1 }, OP_TYPE.op6),
      Object.assign({ match: 1 }, OP_TYPE.op7),
      Object.assign({ match: 1 }, OP_TYPE.op8),
      Object.assign({ match: 1 }, OP_TYPE.op9),
    ],
  },
  section: {
    icon: "fa fa-exchange",
    class: 'unSubTable',
    name: "分段",
    componentid: "section"
  },
  remark: {
    icon: "fa fa-file-text",
    class: 'unSubTable',
    name: "备注",
    componentid: "remark"
  },
  carousel: {
    icon: "fa fa-font",
    class: 'unSubTable',
    name: "走马灯",
    componentid: "carousel"
  },
  chart: {
    icon: "el-icon-pie-chart",
    class: 'unSubTable',
    name: "图表",
    componentid: "chart"
  },
  tree: {
    icon: "el-icon-pie-chart",
    class: 'unSubTable',
    name: "树",
    componentid: "tree"
  },
  formtable: {
    icon: "el-icon-pie-chart",
    class: 'unSubTable',
    name: "数据表格",
    componentid: "formtable"
  },
  graphiccard: {
    icon: "el-icon-picture",
    class: 'unSubTable',
    name: "图文列表",
    componentid: "graphiccard",
    data: [{ n: '_selectedTable', v: '' }, { n: '_titleField', v: '' }, { n: '_imgField', v: '' }, { n: '_infoField', v: '' }]
  }
}

module.exports = CPNT;

