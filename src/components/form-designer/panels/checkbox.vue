<template>
  <div class="act-checkbox-body">
    <common-panel
      :cpnt="cpnt"
      :info="'从预设的选项中选择一项或者多项'"
      :needDefaultValue="false"
      :needPlaceholder="false"
    >
      <el-form-item label="选项设置">
        <common-option :cpnt="cpnt" :key="cpnt.fid" :multiple="true"></common-option>
      </el-form-item>
      <common-prefix :cpnt="cpnt"></common-prefix>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";
import commonOption from "../common/common-option";
import commonPrefix from "../common/common-prefix";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
    commonOption,
    commonPrefix,
  },
};
</script>
<style lang="less" scoped>
</style>