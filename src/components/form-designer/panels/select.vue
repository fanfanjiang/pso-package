<template>
  <div class="act-select-body">
    <common-panel :cpnt="cpnt" info="从预设的选项中选择一项，可设为将可以选择下拉菜单或是单选框的展示形式" :needPlaceholder="false">
      <el-form-item label="展示类型">
        <el-radio v-model="cpnt.data._showType" label="select">下拉菜单</el-radio>
        <el-radio v-model="cpnt.data._showType" label="radio">单选框</el-radio>
      </el-form-item>
      <el-form-item label="选项设置">
        <common-option :cpnt="cpnt"></common-option>
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
