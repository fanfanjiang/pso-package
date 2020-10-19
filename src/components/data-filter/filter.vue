<template>
  <div class="branch-picker">
    <div class="branch-picker__name" v-if="refreshable">
      <el-select :size="size" filterable v-model="pick.field" @change="fieldChange" placeholder="请选择" :disabled="fixed || fixedfield">
        <el-option v-for="item in fieldsOptions" :key="item.fid" :label="item.displayName || item._fieldName" :value="item.fid"></el-option>
      </el-select>
    </div>
    <div class="branch-picker__body">
      <div class="branch-picker__op" v-if="!fixed">
        <el-select :size="size" filterable v-model="pick.op" @change="opChange" placeholder="请选择">
          <el-option v-for="item in opOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="branch-picker__value" v-show="pick.op">
        <el-input :size="size" v-if="pick.match === 1" v-model="pick.data" placeholder="请输入内容" clearable></el-input>
        <el-select
          :size="size"
          v-else-if="pick.match === 2 || pick.match === 3"
          v-model="pick.data"
          placeholder="请选择"
          :multiple="pick.match === 3"
        >
          <el-option
            v-for="item in dataOptions"
            :key="item._optionValue"
            :label="item._optionName || item._optionValue"
            :value="item._optionValue"
          ></el-option>
        </el-select>
        <el-date-picker
          v-else-if="pick.match === 4"
          :size="size"
          v-model="pick.data"
          type="datetime"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          align="right"
          clearable
        ></el-date-picker>
        <div class="branch-picker__split" v-else-if="pick.match === 5">
          <el-input-number :size="size" v-model="minNum" controls-position="right" clearable></el-input-number>
          <span class="branch-picker__split-line">-</span>
          <el-input-number :size="size" v-model="maxNum" controls-position="right" clearable></el-input-number>
        </div>
        <el-date-picker
          :size="size"
          v-else-if="pick.match === 6"
          v-model="pick.data"
          :type="curOp.type || 'daterange'"
          :value-format="curOp.vformat || curOp.format || 'yyyy-MM-dd'"
          :format="curOp.format || 'yyyy-MM-dd'"
        ></el-date-picker>
        <div class="branch-picker__checkbox" v-else-if="pick.match === 7">
          <el-checkbox :size="size" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="pick.data" @change="handleCheckItemChange">
            <el-checkbox
              v-for="o in dataOptions"
              :label="o._optionValue || o._optionName"
              :key="o._optionValue || o._optionName"
              :size="size"
              >{{ o._optionName || o._optionValue }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <date-week v-else-if="pick.match === 8" v-model="pick.data" :size="size"></date-week>
        <div v-else-if="pick.match === 99">
          <el-form>
            <pso-form-component :force-show="true" :cpnt="cpnt" @value-change="valueChangeHandler"></pso-form-component>
          </el-form>
        </div>
        <div v-else>
          <el-input :size="size" :disabled="true" placeholder></el-input>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import { CPNT } from "../../const/form";
import PsoFormComponent from "../form-interpreter/cpnt";
import FormStore from "../form-designer/model/store.js";
import DateWeek from "../date/date-week";

export default {
  componentName: "PsoDatafilterItem",
  components: { PsoFormComponent, DateWeek },
  props: {
    pick: {
      type: Object,
    },
    fieldsOptions: {
      type: Array,
    },
    size: {
      type: String,
      default: "mini",
    },
    fixed: {
      type: Boolean,
      default: false,
    },
    fixedfield: {
      type: Boolean,
      default: false,
    },
    refreshable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      cpnt: {},
      minNum: 0,
      maxNum: 0,
      checkAll: false,
      isIndeterminate: false,
      store: null,
    };
  },
  computed: {
    opOptions() {
      return (this.cpnt && this.cpnt.componentid && CPNT[this.cpnt.componentid].op) || [];
    },
    dataOptions() {
      return (this.cpnt && this.cpnt.data._option) || [];
    },
    curOp() {
      if (this.cpnt && this.pick.op) {
        const exist = _.find(CPNT[this.cpnt.componentid].op, { id: this.pick.op });
        if (exist) {
          return exist;
        }
      }
      return {};
    },
  },
  watch: {
    minNum(val) {
      this.pick.data.splice(0, 1, val);
    },
    maxNum(val) {
      this.pick.data.splice(1, 1, val);
    },
  },
  created() {
    this.store = new FormStore({
      data_name: "0",
      data_code: "0",
      data_id: "0",
      data_config: this.fieldsOptions,
      designMode: false,
      forceInsertSys: false,
    });
    if (this.pick.cpnt) {
      this.makeCpnt(this.pick.cpnt.fid);
      if (this.pick.op && !this.pick.match) {
        this.opChange();
      }
    }

    this.$on("refresh", () => {
      this.valueChangeHandler({ value: this.curOp.arraytype ? [] : "" });
    });
  },
  methods: {
    makeCpnt(fid) {
      //生成真实CPNT
      this.cpnt = this.store.search({ options: { fid } });
      this.store.updateInstance({
        [this.cpnt.data._fieldValue]: (Array.isArray(this.pick.data) ? this.pick.data.join(",") : this.pick.data) || "",
      });
      const { _fieldName, _fieldValue, componentid } = this.cpnt.data;
      this.cpnt.data._fieldName = "";
      this.cpnt.data._hideForever = false;
      this.cpnt.data._hideOnNew = false;

      if (!this.pick.cpnt) this.pick.cpnt = {};
      Object.assign(this.pick.cpnt, { fid, componentid, _fieldName, _fieldValue });
    },
    fieldChange(fid) {
      this.makeCpnt(fid);
      this.pick.op = "";
      this.pick.match = "";
      this.pick.data = "";
    },
    opChange(change) {
      this.pick.match = this.curOp.match;
      if (this.curOp.arraytype) {
        if (!Array.isArray(this.pick.data) || change) {
          this.pick.data = [];
        }
      } else {
        if (change) {
          this.pick.data = "";
        }
      }
      if (this.curOp.defaultVal) {
        this.pick.data = _.cloneDeep(this.curOp.defaultVal);
      }
    },
    handleCheckAllChange(isCheckAll) {
      this.pick.data = isCheckAll ? _.map(this.dataOptions, "_optionValue") : [];
      this.isIndeterminate = false;
    },
    handleCheckItemChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.dataOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataOptions.length;
    },
    valueChangeHandler({ value }) {
      this.pick.data = value;
    },
  },
};
</script>