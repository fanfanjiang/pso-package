<template>
  <div class="printgod-paper" style="width: 270px">
    <el-form size="mini" label-position="left" label-width="80px">
      <el-form-item label="纸张大小">
        <el-select filterable size="mini" v-model="print.page.type">
          <el-option v-for="(d, i) in _CONST.PAGE" :key="i" :label="d.n" :value="d.v"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="纸张方向">
        <el-select filterable size="mini" v-model="print.page.layout">
          <el-option v-for="(d, i) in _CONST.PAGE_DIRECT" :key="i" :label="d.n" :value="d.v"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form size="mini" label-position="left" label-width="30px" :inline="true">
      <el-divider v-if="print.page.type === 'custom'" content-position="left">大小 (单位：mm)</el-divider>
      <div class="form-wrapper" v-if="print.page.type === 'custom'">
        <el-form-item label="宽">
          <el-input-number :precision="2" :controls="false" size="mini" v-model="print.page.width"></el-input-number>
        </el-form-item>
        <el-form-item label="高">
          <el-input-number :precision="2" :controls="false" size="mini" v-model="print.page.height"></el-input-number>
        </el-form-item>
      </div>
      <el-divider content-position="left">页边距 (单位：mm)</el-divider>
      <div class="form-wrapper">
        <el-form-item label="上">
          <el-input-number :precision="2" :controls="false" size="mini" v-model="print.page.margin[0]"> </el-input-number>
        </el-form-item>
        <el-form-item label="下">
          <el-input-number :precision="2" :controls="false" size="mini" v-model="print.page.margin[2]"></el-input-number>
        </el-form-item>
      </div>
      <div class="form-wrapper">
        <el-form-item label="左">
          <el-input-number :controls="false" size="mini" v-model="print.page.margin[1]"></el-input-number>
        </el-form-item>
        <el-form-item label="右">
          <el-input-number :precision="2" :controls="false" size="mini" v-model="print.page.margin[3]"></el-input-number>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import _CONST from "./const";
export default {
  props: {
    print: Object,
  },
  data() {
    this._CONST = _CONST;
    return {};
  },
  watch: {
    "print.page.type"(v) {
      const TYPE = _.find(_CONST.PAGE, { v });
      this.print.page.width = TYPE.w;
      this.print.page.height = TYPE.h;
    },
  },
};
</script>