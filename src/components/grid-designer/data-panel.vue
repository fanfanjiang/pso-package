<template>
  <div v-loading="initializing">
    <el-form-item label="数据源类型" v-if="checkAvailable('sourceType')">
      <el-radio-group v-model="cpnt.data.sourceType" @change="sourceChangeHandler">
        <el-radio label="0">表单</el-radio>
        <el-radio label="1">脚本</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="cpnt.data.sourceType === '0'">
      <el-form-item label="选择表单" v-if="checkAvailable('source')">
        <el-select filterable clearable size="mini" v-model="cpnt.data.source" @change="formChangeHandler">
          <el-option v-for="(f, i) in forms" :key="i" :label="f.node_display" :value="f.node_name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表单列表" v-if="checkAvailable('useCloumn')">
        <el-select filterable clearable size="mini" v-model="cpnt.data.useCloumn">
          <el-option v-for="(c, i) in columns" :key="i" :label="c.name" :value="c.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="动作" v-if="checkAvailable('actions')">
        <el-select multiple filterable clearable size="mini" v-model="cpnt.data.actions">
          <el-option v-for="(c, i) in actions" :key="i" :label="c.name" :value="c.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手动设置数据地址" v-if="checkAvailable('fetchManually')">
        <el-switch size="mini" v-model="cpnt.data.fetchManually"></el-switch>
      </el-form-item>
      <el-form-item label="数据地址" v-if="cpnt.data.fetchManually && checkAvailable('fetchAPI')">
        <el-input size="mini" v-model.trim="cpnt.data.fetchAPI" clearable></el-input>
      </el-form-item>
    </template>
    <el-form-item label="数据权限" v-if="checkAvailable('viewAuth')">
      <el-select filterable clearable size="mini" v-model="cpnt.data.viewAuth">
        <el-option v-for="(a, i) in AUTHS" :key="i" :label="a.n" :value="a.v"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="筛选条件(keys)" v-if="checkAvailable('defKeys')">
      <el-input size="mini" v-model.trim="cpnt.data.defKeys" clearable></el-input>
    </el-form-item>
    <el-form-item label="复杂筛选条件" v-if="checkAvailable('defComplexity')">
      <el-input size="mini" v-model.trim="cpnt.data.defComplexity" clearable></el-input>
    </el-form-item>
    <el-form-item label="显示数量（若为0则不限制）" v-if="checkAvailable('limit')">
      <el-input-number size="mini" v-model="cpnt.data.limit" :min="0"></el-input-number>
    </el-form-item>
    <el-form-item label="分页(如果为否则会在滚动到底部时加载)" v-if="checkAvailable('paging')">
      <el-switch size="mini" v-model="cpnt.data.paging"></el-switch>
    </el-form-item>
    <el-form-item label="标题字段" v-if="checkAvailable('fieldTitle')">
      <el-select filterable clearable size="mini" v-model="cpnt.data.fieldTitle">
        <el-option v-for="(c, i) in curColums" :key="i" :label="c[curFName] || c[curFField]" :value="c[curFField]"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题是否可点击">
      <el-switch size="mini" v-model="cpnt.data.titleClickable"></el-switch>
    </el-form-item>
    <template v-if="cpnt.data.titleClickable">
      <el-form-item label="点击后执行操作">
        <el-select filterable clearable size="mini" v-model="cpnt.data.titleClickType">
          <el-option label="打开表单" value="1"></el-option>
          <el-option label="跳转链接" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-tooltip effect="dark" content="“:id”代表数据ID,“:pid”代表插件ID,“:fid”代表表单ID,“:mid”代表模块ID" placement="bottom-start">
        <el-form-item label="链接" v-if="cpnt.data.titleClickType === '2'">
          <el-input size="mini" v-model.trim="cpnt.data.titleClickVal" clearable></el-input>
        </el-form-item>
      </el-tooltip>
    </template>
    <el-form-item label="摘要字段" v-if="checkAvailable('fieldAbs')">
      <el-select filterable clearable size="mini" v-model="cpnt.data.fieldAbs">
        <el-option v-for="(c, i) in curColums" :key="i" :label="c[curFName] || c[curFField]" :value="c[curFField]"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="正文字段" v-if="checkAvailable('fieldMain')">
      <el-select filterable clearable size="mini" v-model="cpnt.data.fieldMain">
        <el-option v-for="(c, i) in curColums" :key="i" :label="c[curFName] || c[curFField]" :value="c[curFField]"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="头图字段" v-if="checkAvailable('fieldPic')">
      <el-select filterable clearable size="mini" v-model="cpnt.data.fieldPic">
        <el-option v-for="(c, i) in curColums" :key="i" :label="c[curFName] || c[curFField]" :value="c[curFField]"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="图片模式">
      <el-switch size="mini" v-model="cpnt.data.picMode"></el-switch>
    </el-form-item>
    <el-form-item label="时间字段" v-if="checkAvailable('fieldTime')">
      <el-select filterable clearable size="mini" v-model="cpnt.data.fieldTime">
        <el-option v-for="(c, i) in curColums" :key="i" :label="c[curFName] || c[curFField]" :value="c[curFField]"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="时间转换（一天前、几小时前...）" v-if="checkAvailable('timeAgo')">
      <el-switch size="mini" v-model="cpnt.data.timeAgo"></el-switch>
    </el-form-item>
    <el-form-item label="额外信息字段（可多选）" v-if="checkAvailable('fieldContent')">
      <el-select multiple filterable clearable size="mini" v-model="cpnt.data.fieldContent">
        <el-option v-for="(c, i) in curColums" :key="i" :label="c[curFName] || c[curFField]" :value="c[curFField]"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="绑定日历" v-if="checkAvailable('withCalendar')">
      <el-switch size="mini" v-model="cpnt.data.withCalendar"></el-switch>
    </el-form-item>
    <el-form-item label="日历绑定字段" v-if="cpnt.data.withCalendar">
      <el-select filterable clearable size="mini" v-model="cpnt.data.calendarTime" v-if="checkAvailable('calendarTime')">
        <el-option v-for="(c, i) in curColums" :key="i" :label="c[curFName] || c[curFField]" :value="c[curFField]"></el-option>
      </el-select>
    </el-form-item>
    <slot></slot>
  </div>
</template>
<script>
import { formOp } from "../form-designer/mixin.js";

export default {
  mixins: [formOp],
  props: {
    cpnt: Object,
  },
  data() {
    this.AUTHS = [
      { n: "全部", v: "4" },
      { n: "仅岗位", v: "2" },
      { n: "仅部门", v: "1" },
      { n: "仅个人", v: "0" },
    ];
    return {
      initializing: true,
      forms: [],
      columns: [],
      actions: [],
    };
  },
  computed: {
    curFName() {
      return this.cpnt.data.sourceType === "0" ? "display" : "name";
    },
    curFField() {
      return this.cpnt.data.sourceType === "0" ? "field_name" : "field";
    },
    curColums() {
      const { sourceType, source, useCloumn } = this.cpnt.data;
      if (sourceType === "0") {
        if (useCloumn) {
          const exist = _.find(this.columns, { name: useCloumn });
          return exist ? exist.data : [];
        }
      } else {
        return this.cpnt.urine.child_content;
      }
      return [];
    },
  },
  async created() {
    this.initializing = true;

    this.forms = await this.API.getFormTree();
    this.sourceChangeHandler();

    this.initializing = false;
  },
  methods: {
    checkAvailable(field) {
      return typeof this.cpnt.data[field] !== "undefined";
    },
    async sourceChangeHandler() {
      const { sourceType, source } = this.cpnt.data;
      if (sourceType === "0" && source) {
        await this.formChangeHandler(source);
      }
    },
    async formChangeHandler(id) {
      await this.makeFormStore(id);
      if (this.formConfig.display_columns) {
        const { column, def } = JSON.parse(this.formConfig.display_columns);
        this.columns = column;
        if (def && !this.cpnt.data.useCloumn) {
          this.cpnt.data.useCloumn = def;
        }
      }
      if (this.formConfig.data_button) {
        this.actions = JSON.parse(this.formConfig.data_button);
      }
    },
  },
};
</script>