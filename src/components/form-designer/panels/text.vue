<template>
  <div class="act-text-body">
    <common-panel :cpnt="cpnt" info="可以输入一般文字" :needPlaceholder="true">
      <el-form-item label="显示方式">
        <el-radio v-model="cpnt.data._type" label="text">单行</el-radio>
        <el-radio v-model="cpnt.data._type" label="textarea">多行</el-radio>
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
  }
};
</script>
