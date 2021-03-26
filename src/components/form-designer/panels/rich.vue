<template>
  <div class="act-select-body">
    <common-panel :cpnt="cpnt" info="富文本编辑器" :needPlaceholder="false" :needDefaultValue="false" :needUnique="false">
      <el-form-item label="类型">
        <el-radio v-model="cpnt.data._type" label="1">富文本</el-radio>
        <el-radio v-model="cpnt.data._type" label="2">Markdown</el-radio>
      </el-form-item>
    </common-panel>
  </div>
</template>
<script>
import commonPanel from "../common/common-panel";

export default {
  props: ["cpnt"],
  components: {
    commonPanel,
  },
};
</script>
