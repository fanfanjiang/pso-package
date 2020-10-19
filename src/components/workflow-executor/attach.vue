<template>
  <div class="pso-wf-executor__attach">
    <el-form label-width="80px" size="medium">
      <pso-form-attach :cpnt="attach" @value-change="handleAttachChange">
        <el-button icon="el-icon-paperclip" plain size="small">上传附件</el-button>
      </pso-form-attach>
    </el-form>
  </div>
</template>
<script>
import PsoFormAttach from "../form-interpreter/components/attachment";
import { genComponentData } from "../form-designer/helper";

export default {
  components: { PsoFormAttach },
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      attach: { data: {} },
    };
  },
  created() {
    this.attach.data = genComponentData({ componentid: "attachment", _fieldName: "", _val: this.store.data.attach || "" });
    this.attach.data._fieldName = "";
    this.attach.data._read = this.store.data.instanceId; 
  },
  methods: {
    handleAttachChange({ value }) {
      this.store.data.attach = value;
    },
  },
};
</script>