<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="只能输入数字" :needPlaceholder="true">
      <el-form-item label="单位">
        <el-input size="mini" v-model="cpnt.data._unit"></el-input>
      </el-form-item>
      <el-form-item label="小数点">
        <el-input-number size="mini" v-model="cpnt.data._decimalPlaces" :min="0" :max="5"></el-input-number>
      </el-form-item>
      <el-form-item label="百分比模式">
        <el-switch size="mini" v-model="cpnt.data._usePercent"></el-switch>
      </el-form-item>
      <common-range :cpnt="cpnt"></common-range>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import commonRange from "../common/common-range";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    commonRange,
  },
  watch: {
    "cpnt.data._usePercent"(val) {
      this.cpnt.data._unit = val ? "%" : "";
    },
  },
  created() {},
};
</script>
