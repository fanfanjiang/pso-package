<template>
  <panel-wrapper :cpnt="cpnt">
    <common-panel :cpnt="cpnt" position="top">
      <data-panel :cpnt="cpnt">
        <el-form-item label="样式类型">
          <el-select size="mini" v-model="cpnt.data.styleType">
            <el-option v-for="(c, i) in TYPES" :key="i" :label="c.n" :value="c.v"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示内容">
          <el-switch size="mini" v-model="cpnt.data.showBody"></el-switch>
        </el-form-item>
        <el-form-item label="内容高度">
          <el-input-number size="mini" v-model="cpnt.data.carBodyH" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="轮播方向">
          <el-select size="mini" v-model="cpnt.data.scrDrt">
            <el-option label="水平" value="horizontal"></el-option>
            <el-option label="垂直" value="vertical"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间背景色">
          <el-color-picker size="mini" v-model="cpnt.data.timerColor"></el-color-picker>
        </el-form-item>
      </data-panel>
    </common-panel>
  </panel-wrapper>
</template>   
<script>
import PanelWrapper from "../panel";
import CommonPanel from "../common-panel";
import DataPanel from "../data-panel";

import { CpntMixin } from "../mixin";
export default {
  components: { PanelWrapper, CommonPanel, DataPanel },
  mixins: [CpntMixin],
  data() {
    this.TYPES = [
      { n: "高度撑满，宽度自适应", v: "0" },
      { n: "宽度撑满，高度自适应", v: "1" },
      { n: "宽高都撑满（需要符合容器比例，否则变形）", v: "2" },
    ];
    return {};
  },
};
</script>