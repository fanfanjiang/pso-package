<template>
  <div>
    <el-form-item label="">
      <el-tag v-if="curDept" size="small" closable @close="delHandler">{{ curDept.node_display }}</el-tag>
      <pso-picker-dept pattern="radio" @confirm="addHandler"></pso-picker-dept>
    </el-form-item>
    <el-form-item label="" v-if="typeof node.bind_field !== 'number'">
      <el-select v-model="node.bind_field" placeholder="岗位绑定表单字段" filterable clearable @change="fieldsChange">
        <el-option v-for="f in wfDesigner.fieldsOptions" :key="f._fieldValue" :label="f.displayName" :value="f._fieldValue"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    node: {
      type: Object,
    },
  },
  data() {
    return {
      loading: false,
      curDept: null,
    };
  },
  computed: {
    ...mapState(["wfDesigner"]),
  },
  created() {
    if (this.node.bind_field) {
      this.checkDept();
    }
  },
  methods: {
    delHandler() {
      this.curDept = null;
      this.node.bind_field = "";
    },
    addHandler(data) {
      if (data && data.length) {
        this.curDept = data[0];
        this.node.bind_field = data[0].node_id;
      }
    },
    fieldsChange() {
      this.curDept = null;
    },
    async checkDept() {
      const orgTree = await this.API.getOrgTree();
      this.curDept = _.find(orgTree, { node_id: parseInt(this.node.bind_field) });
    },
  },
};
</script>