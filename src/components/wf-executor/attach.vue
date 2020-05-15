<template>
  <div class="pso-wf-executor__attach">
    <el-form label-width="80px" size="medium">
      <pso-form-attach :cpnt="{data:store.data.attach}" @delete="deleteFile">
        <el-button icon="el-icon-paperclip" plain size="small">上传附件</el-button>
      </pso-form-attach>
    </el-form>
  </div>
</template>
<script>
import PsoFormAttach from "../form-interpreter/components/attachment";

export default {
  components: {  PsoFormAttach },
  props: {
    store: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    async deleteFile(file) {
      if (!this.store.data.instanceId) return;
      let ret = await this.API.file({
        data: { att_id: file.res_id, mtype: "Flow", mkey: "InstAtt", keys: { att_id: file.res_id } },
        method: "delete"
      });
      this.$notify({ title: ret.success ? "成功删除" : "删除失败", type: ret.success ? "success" : "warning" });
    }
  }
};
</script>