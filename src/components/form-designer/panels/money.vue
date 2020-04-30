<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="输入货币金额，可设置货币格式" :needPlaceholder="true">
      <el-form-item label="单位">
        <el-input v-model="cpnt.data._unit"></el-input>
      </el-form-item>
      <el-form-item label="小数点">
        <el-input-number v-model="cpnt.data._decimalPlaces" :min="0" :max="5"></el-input-number>
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
