<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="只能输入数字" :needPlaceholder="true">
      <el-form-item label="单位">
        <el-input size="small" v-model="cpnt.data._unit"></el-input>
      </el-form-item>
      <el-form-item label="小数点">
        <el-input-number size="small" v-model="cpnt.data._decimalPlaces" :min="0" :max="5"></el-input-number>
      </el-form-item>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel
  },
  created() {}
};
</script>
