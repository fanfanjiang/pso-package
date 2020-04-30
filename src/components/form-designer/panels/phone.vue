<template>
  <div class="act-text-body">
    <common-panel
      :cpnt="cpnt"
      info="可设为手机 或 座机，并验证格式"
      :needPlaceholder="true"
      :needUnique="true"
    >
      <el-form-item label="选择类型">
        <el-radio v-model="cpnt.data._type" label="cellphone">手机</el-radio>
        <el-radio v-model="cpnt.data._type" label="fixedphone">座机</el-radio>
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
