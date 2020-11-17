<template>
  <common-panel :cpnt="cpnt" info="将记录生成一个自动递增的唯一编号" :needPlaceholder="true">
    <template v-if="cpnt.data._fieldFormat === FIELD_FORMAT.autocode.value">
      <el-form-item label="指定编号位数">
        <el-select size="small" v-model="cpnt.data._digit" placeholder="请选择">
          <el-option v-for="item in digit" :key="item" :label="digitName(item)" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="指定日期格式">
        <el-select size="small" v-model="cpnt.data._format" placeholder="请选择">
          <el-option v-for="item in dateFormat" :key="item.v" :label="item.n" :value="item.v"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自定义脚本">
        <el-button icon="el-icon-plus" plain size="small" @click="showDesigner = true">编辑脚本</el-button>
      </el-form-item>
      <span>示例：{{ sample }}</span>
    </template>
    <el-form-item label="关联标签字段" v-else-if="cpnt.data._fieldFormat === FIELD_FORMAT.autotag.value">
      <el-select size="mini" v-model="cpnt.data._bind" placeholder="请选择" clearable>
        <el-option v-for="item in fieldOptions" :key="item.fid" :label="item._fieldName" :value="item.fid"></el-option>
      </el-select>
    </el-form-item>
    <pso-drawer size="50%" :visible="showDesigner" title="设计脚本" @close="showDesigner = false">
      <template v-slot:whole>
        <formula-designer
          :formulable="false"
          :value="cpnt.data._source"
          :cpnts="formulaOptions"
          @cancel="showDesigner = false"
          @confirm="handleConfirm"
        ></formula-designer>
      </template>
    </pso-drawer>
  </common-panel>
</template>
<script>
import commonPanel from "../common/common-panel";

import dayjs from "dayjs";
import { common, FormulaMixin } from "../mixin";
import { genComponentData } from "../helper";
import formulaDesigner from "../../form-designer/formula-designer";
import { FIELD_FORMAT } from "../../../const/form";

export default {
  props: ["cpnt"],
  mixins: [common, FormulaMixin],
  components: {
    commonPanel,
    formulaDesigner,
  },
  data() {
    return {
      digit: ["1", "2", "3", "4", "5", "6"],
      dateFormat: [
        { n: "年月日", v: "YYYYMMDD" },
        { n: "年月日时", v: "YYYYMMDDHH" },
      ],
      options: [
        { n: "日期", v: "date" },
        { n: "编号", v: "no" },
      ],
      showDrop: false,
      mirrorCursor: {
        cursorHeight: 0.8,
      },
      coding: false,
      code: "",
      show: false,
      showDesigner: false,
      FIELD_FORMAT: FIELD_FORMAT,
    };
  },
  computed: {
    sample() {
      return this.cpnt.data._source
        .replace(/@__date__@/g, `${dayjs().format(this.cpnt.data._format || this.dateFormat[0].v)}`)
        .replace(/@__no__@/g, `${new Array(parseInt(this.cpnt.data._digit) - 1).fill(0).join("") + "1"}`);
    },
    fieldOptions() {
      return this.cpnt.store.search({
        options: { db: true },
        onlyData: true,
        beforePush: (item) => {
          if (item.fid === this.cpnt.fid) return false;
          return true;
        },
      });
    },
    formulaOptions() {
      const cpnts = this.numOptions;
      cpnts.push(
        genComponentData({ _fieldValue: "__date__", _fieldName: "系统日期", componentid: "text" }),
        genComponentData({ _fieldValue: "__no__", _fieldName: "系统编号", componentid: "text" })
      );
      return cpnts;
    },
  },
  watch: {
    "cpnt.data._source"() {
      this.format();
    },
    "cpnt.data._digit"() {
      this.format();
    },
    "cpnt.data._format"() {
      this.format();
    },
  },
  created() {
    if (!this.cpnt.data._format) {
      this.cpnt.data._format = this.dateFormat[0].v;
    }
  },
  methods: {
    digitName(d) {
      return `${d}位数`;
    },
    format() {
      if (this.cpnt.data._source) {
        this.cpnt.data._outputFormat = this.cpnt.data._source
          .replace(/@__date__@/g, `[date(${this.cpnt.data._format})]`)
          .replace(/@__no__@/g, `%0${this.cpnt.data._digit}d`);
      } else {
        this.cpnt.data._outputFormat = "";
      }
    },
    handleConfirm(code) {
      this.cpnt.data._source = code;
      this.showDesigner = false;
    },
  },
};
</script>
