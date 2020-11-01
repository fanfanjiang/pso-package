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
import { REVIEW_STATUS } from "../../const/workflow";

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
    this.attach.data._read = this.store.data.status === REVIEW_STATUS.archive.value;
  },
  methods: {
    async handleAttachChange({ value }) {
      const preValue = this.store.data.attach ? this.store.data.attach.split(",") : [];
      const newValue = value ? value.split(",") : [];
      if (this.store.data.instanceId) {
        const addIds = [];
        const delIds = [];
        for (let id of preValue) {
          if (newValue.indexOf(id) === -1) {
            delIds.push(id);
          }
        }
        for (let id of newValue) {
          if (preValue.indexOf(id) === -1) {
            addIds.push(id);
          }
        }
        if (addIds.length) {
          await this.updateAttach(addIds);
        }
        if (delIds.length) {
          await this.updateAttach(delIds, 2);
        }
      }
      this.store.data.attach = value;
    },
    async updateAttach(attid, optype = 0) {
      const ret = await this.API.updateWfAttach({ instance_id: this.store.data.instanceId, attid: attid.join(","), optype });
      this.ResultNotify(ret);
    },
  },
};
</script>