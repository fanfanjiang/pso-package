<template>
  <el-form style="width: 200px" size="mini" label-position="left" label-width="80px">
    <el-form-item label="打印背景">
      <el-switch size="mini" v-model="print.sheet.background.show"> </el-switch>
    </el-form-item>
    <el-form-item v-show="print.sheet.background.id" label="背景">
      <el-button size="mini" @click="delHandler">删除</el-button>
    </el-form-item>
    <pso-form-attach v-show="!print.sheet.background.id" ref="attach" :cpnt="attach" @value-change="attchHandler">
      <el-button size="mini"><i class="el-icon-paperclip el-icon--left"></i>上传</el-button>
    </pso-form-attach>
  </el-form>
</template>
<script>
import { Attach } from "../../mixin/form";
export default {
  mixins: [Attach],
  props: {
    print: Object,
  },
  created() {
    this.createCpnt(this.print.sheet.background.id, "背景");
  },
  methods: {
    attchHandler({ value, proxy }) {
      this.print.sheet.background.id = value;
      this.print.sheet.background.url = proxy.length ? proxy[0].url : "";
    },
    delHandler() {
      this.$refs.attach.deleteFile({ res_id: this.print.sheet.background.id });
    },
  },
};
</script>