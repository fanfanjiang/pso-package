<template>
  <div style="padding: 15px; height: 100%">
    <div style="background: #fff; padding: 15px; height: 100%；overflow: auto;">
      <pso-title>打印预览</pso-title>
      <div class="print-preview">
        <div class="print-preview-body" :style="preStyle">
          <div class="print-preview-content">
            <div class="print-preview-title">标题</div>
            <div class="print-preview-header">头部</div>
            <div class="print-preview-list">
              <p v-for="(c, i) in config.count" :key="i">第{{ i + 1 }}行</p>
            </div>
            <div class="print-preview-footer">底部</div>
          </div>
        </div>
      </div>
      <pso-title>整体配置</pso-title>
      <el-form size="small" label-position="top" style="margin-bottom: 30px">
        <div class="form-wrapper">
          <el-form-item label="数据源">
            <el-select size="mini" v-model="config.source">
              <el-option v-for="(t, i) in asstables" :key="i" :label="t._fieldName" :value="t._fieldValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="每页数量">
            <el-input-number size="mini" v-model="config.count" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="打印方向">
            <el-select size="mini" v-model="config.orientation">
              <el-option label="纵向" value="portrait"></el-option>
              <el-option label="横向" value="landscape"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="纸张尺寸">
            <el-select size="mini" v-model="config.size">
              <el-option label="A5" value="A5"></el-option>
              <el-option label="A4" value="A4"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-wrapper">
          <el-form-item label="左边距">
            <el-input-number size="mini" v-model="config.margins[0]" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="上边距">
            <el-input-number size="mini" v-model="config.margins[1]" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="右边距">
            <el-input-number size="mini" v-model="config.margins[2]" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="下边距">
            <el-input-number size="mini" v-model="config.margins[3]" controls-position="right" :min="0"></el-input-number>
          </el-form-item>
        </div>
        <div class="form-wrapper">
          <el-form-item label="数据头部样式">
            <el-select clearable size="mini" v-model="config.dheaderStyle">
              <el-option v-for="(t, i) in config.styles" :key="i" :label="t.name" :value="t.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据主体样式">
            <el-select clearable size="mini" v-model="config.dbodyStyle">
              <el-option v-for="(t, i) in config.styles" :key="i" :label="t.name" :value="t.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=""> </el-form-item>
          <el-form-item label=""> </el-form-item>
        </div>
      </el-form>
      <pso-title>样式配置</pso-title>
      <print-style :data="config.styles"></print-style>
      <pso-title>标题设置</pso-title>
      <print-table :styles="config.styles" :data="config.title" :fields="fields"></print-table>
      <pso-title>头部设置</pso-title>
      <print-table :styles="config.styles" :data="config.header" :fields="fields"></print-table>
      <pso-title>底部设置</pso-title>
      <print-table :styles="config.styles" :data="config.footer" :fields="fields"></print-table>
    </div>
  </div>
</template>
<script>
import { formatJSONList } from "../../utils/util";
import PrintStyle from "./list-style";
import PrintTable from "./list-table";

const FIELDS = {
  source: "",
  count: 5,
  orientation: "landscape",
  size: "A5",
  margins: [5, 20, 5, 20],
  dbodyStyle: "", //数据主体样式
  dheaderStyle: "", //数据头部样式
  styles: [],
  title: [],
  header: [],
  footer: [],
};

export default {
  components: { PrintStyle, PrintTable },
  props: {
    config: Object,
    fields: Array,
  },
  computed: {
    asstables() {
      return this.fields.filter((d) => d.componentid === "asstable");
    },
    preStyle() {
      const mg = this.config.margins;
      return {
        padding: `${mg[1]}px ${mg[2]}px ${mg[3]}px ${mg[0]}px`,
      };
    },
  },
  created() {
    formatJSONList([this.config], FIELDS);
  },
};
</script>