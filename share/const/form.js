const OP_FILTER = require('./op-filter');
const { FILTER_TYPE } = require('./filter');

const CPNT = {
  text: {
    icon: "fa fa-font",
    name: "文本",
    componentid: "text",
    class: '',
    op: FILTER_TYPE.string.op,
    fop: [{ ...OP_FILTER.op1 }],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [
      { n: '_type', v: 'text' },
      { n: '_scannable', v: false },
      { n: '_scanType', v: 'qr' },
      { n: '_searchable', v: false },
      { n: '_searchForm', v: '' },
      { n: '_searchField', v: '' },
      { n: '_searchDisplay', v: [] },
      { n: '_bindFields', v: [] },
    ]
  },
  number: {
    icon: "fa fa-sort-numeric-desc",
    name: "数值",
    componentid: "number",
    class: '',
    op: FILTER_TYPE.number.op,
    fop: [{ ...OP_FILTER.op1 }],
    type: 'number',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    figure: true,
    data: [
      { n: '_fieldRealType', v: 'decimal' },
      { n: '_unit', v: '' },
      { n: '_decimalPlaces', v: 0 },
      { n: '_useRange', v: false },
      { n: '_min', v: '' },
      { n: '_max', v: '' },
      { n: '_minField', v: '' },
      { n: '_maxField', v: '' },
    ]
  },
  money: {
    icon: "fa fa-jpy",
    name: "金额",
    componentid: "money",
    op: FILTER_TYPE.number.op,
    fop: [{ ...OP_FILTER.op1 }],
    type: 'number',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    figure: true,
    data: [
      { n: '_fieldRealType', v: 'decimal' },
      { n: '_unit', v: '' },
      { n: '_decimalPlaces', v: 0 },
      { n: '_useRange', v: false },
      { n: '_min', v: '' },
      { n: '_max', v: '' },
      { n: '_minField', v: '' },
      { n: '_maxField', v: '' },
    ]
  },
  select: {
    icon: "el-icon-turn-off",
    name: "单选",
    componentid: "select",
    op: FILTER_TYPE.select.op,
    fop: [{ ...OP_FILTER.op1 }],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [
      { n: '_showType', v: 'radio' },
      { n: '_defaultValueList', v: [] },
      { n: '_option', v: [{ _optionValue: '选项一', _optionName: '选项一' }, { _optionValue: '选项二', _optionName: '选项二' }] },
      { n: '_datasource', v: '' },
      { n: '_prefix', v: false },
      { n: '_prefixType', v: '' },
      { n: '_prefixList', v: [] },
    ]
  },
  checkbox: {
    icon: "el-icon-set-up",
    name: "多选",
    componentid: "checkbox",
    op: FILTER_TYPE.select.op,
    fop: [{ ...OP_FILTER.op1 }],
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [
      { n: '_defaultValueList', v: [] },
      { n: '_option', v: [{ _optionValue: '选项一', _optionName: '选项一' }, { _optionValue: '选项二', _optionName: '选项二' }] },
      { n: '_datasource', v: '' },
      { n: '_prefix', v: false },
      { n: '_prefixType', v: '' },
      { n: '_prefixList', v: [] },
    ]
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
    data: [
      { n: '_type', v: '1' },
      { n: '_source', v: '' },
      { n: '_id', v: '' },
      { n: '_name', v: '' },
      { n: '_parentId', v: '' },
      { n: '_initParentVal', v: '' },
      { n: '_level', v: 1 },
      { n: '_bindTarget', v: '' },
      { n: '_bindField', v: { 1: '' } },
      { n: '_option', v: [] }
    ]
  },
  time: {
    icon: "el-icon-date",
    name: "日期",
    componentid: "time",
    op: FILTER_TYPE.time.op,
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_fieldRealType', v: 'datetime' }, { n: '_type', v: 'date' }, { n: '_defaultType', v: '' }, { n: '_defaultFormat', v: '' }]
  },
  phone: {
    icon: "el-icon-phone",
    name: "电话",
    componentid: "phone",
    op: FILTER_TYPE.string.op,
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
    op: FILTER_TYPE.string.op,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_read', v: true }, { n: '_digit', v: '3' }, { n: '_format', v: '' }, { n: '_bind', v: '' }, { n: '_source', v: '@__date__@@__no__@' }]
  },
  email: {
    icon: "fa fa-envelope",
    name: "邮箱",
    componentid: "email",
    op: FILTER_TYPE.string.op,
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
    op: FILTER_TYPE.string.op,
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    data: [{ n: '_type', v: 'county' }, { n: '_saveType', v: 'radio' }]
  },
  attachment: {
    icon: "el-icon-paperclip",
    name: "附件",
    componentid: "attachment",
    type: 'string',
    layout: false,
    db: true,
    host_db: false,
    chart: true,
    table_show: true,
    value_format_id: 'leaf_id',
    data: [{ n: '_limit', v: 10 }, { n: '_showwidth', v: '' }, { n: '_showheight', v: '' }, { n: '_source', v: [1, 2] }]
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
    op: FILTER_TYPE.asstable.op,
    data: [
      { n: '_option', v: '' },
      { n: '_type', v: 1 },
      { n: '_showFields', v: '' },
      { n: '_new', v: true },
      { n: '_relate', v: true },
      { n: '_radioField', v: '' },
      { n: '_filter', v: [] },
      { n: '_displayType', v: '' },
      { n: '_printCount', v: 99999 },
      { n: '_printFields', v: '' },
      { n: '_selectMode', v: '1' },
      { n: '_selectFields', v: [] },
      { n: '_actionable', v: false },
    ]
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
    op: FILTER_TYPE.string.op,
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
    data: [
      { n: '_fieldRealType', v: 'decimal' },
      { n: '_selectedTable', v: '' },
      { n: '_selectedField', v: '' },
      { n: '_selectedOp', v: '' },
      { n: '_unit', v: '' },
      { n: '_decimalPlaces', v: 0 }
    ],
    op: FILTER_TYPE.number.op,
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
    op: FILTER_TYPE.number.op,
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
    op: FILTER_TYPE.number.op,
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
    op: FILTER_TYPE.string.op,
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
    op: FILTER_TYPE.string.op,
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
    op: FILTER_TYPE.user.op,
    fop: [{ ...OP_FILTER.op1 }],
    data: [
      { n: '_fieldFormat', v: 'user' },
      { n: '_type', v: 'radio' },
      { n: '_defaultValType', v: 'choose' },
      { n: '_bindForm', v: '' },
      { n: '_bindFormField', v: 'user_id' },
      { n: '_sourceType', v: '1' },
    ],
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
    data: [{ n: '_fieldFormat', v: 'dept' }, { n: '_type', v: 'radio' }, { n: '_defaultValType', v: 'choose' }, { n: '_bindUser', v: '' }],
    op: FILTER_TYPE.dept.op,
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
      { n: '_fieldFormat', v: 'tag' },
      { n: '_type', v: 'radio' },
      { n: '_copy', v: false },
      { n: '_source', v: 'tree' },
      { n: '_treeOptions', v: '' },
      { n: '_filterOptions', v: [] },
    ],
    op: FILTER_TYPE.tag.op,
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
    table_show: true
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
    data: [{ n: '_type', v: '' }, { n: '_relatedField', v: '' }]
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
  },
  pscript: {
    icon: "el-icon-monitor",
    name: "脚本数据",
    componentid: "pscript",
    class: 'unSubTable',
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: true,
    ass_db: false,
    data: [
      { n: '_script', v: [] },
      { n: '_type', v: '1' },
      { n: '_saveOnce', v: false },
      { n: '_option', v: [] },
      { n: '_column', v: [] },
      { n: '_saveField', v: '' },
      { n: '_copyType', v: '1' },
      { n: '_copyTarget', v: '' },
      { n: '_copySource', v: '' },
      { n: '_copyTargetAutoLimit', v: [] },
      { n: '_selectType', v: 'radio' },
      { n: '_copyNotDump', v: false },
    ]
  },
  qrcode: {
    icon: "el-icon-monitor",
    name: "二维码",
    componentid: "qrcode",
    class: 'unSubTable',
    layout: false,
    db: true,
    host_db: false,
    chart: false,
    table_show: false,
    ass_db: false,
    data: [
      { n: '_option', v: [] },
    ]
  }
}

module.exports = CPNT;

