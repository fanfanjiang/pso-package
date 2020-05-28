<template>
  <div style="margin-top:15px">
    <div class="pso-table-controller">
      <el-button size="small" type="primary" plain @click="addHandler()">新增</el-button>
    </div>
    <el-table key="field" :data="data" style="width: 100%" height="600" v-loading="loading">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column prop="auth_name" label="审批人"></el-table-column>
      <el-table-column prop="agent_name" label="代理人"></el-table-column>
      <el-table-column prop="agent_time" label="有效期至"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="editHandler(scope.$index)">编辑</el-button>
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="设置代理人" append-to-body :visible.sync="showEditor" :width="'400px'">
      <el-form label-width="80px" v-if="showEditor">
        <pso-form-user :cpnt="{data:reviewer}"></pso-form-user>
        <pso-form-user :cpnt="{data:agent}"></pso-form-user>
        <el-form-item label="有效期至">
          <el-date-picker
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            size="mini"
            type="datetime"
            placeholder="有效期至"
            v-model="deadline"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveHandler()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PsoFormUser from "../form-interpreter/components/user";

export default {
  components: { PsoFormUser },
  props: ["node"],
  data() {
    return {
      reviewer: {
        _fieldName: "审核人",
        _type: "radio",
        _val: ""
      },
      agent: {
        _fieldName: "代理人",
        _type: "checkbox",
        _val: ""
      },
      deadline: "",
      showEditor: false,
      curIndex: -1,
      data: [],
      loading: false
    };
  },
  watch: {
    "node.node_name": {
      immediate: true,
      handler() {
        this.fetch();
      }
    }
  },
  methods: {
    async fetch() {
      this.loading = true;
      const ret = await this.API.getTreeNode({ code: this.node.node_name });
      if (ret.success) {
        this.data = ret.data.agent;
      }
      this.loading = false;
    },
    delHandler(index) {
      this.submitHandler({ ...this.data[index], optype: 2, autono: this.data[index].auto_no });
    },
    editHandler(index) {
      this.curIndex = index;

      this.reviewer._val = this.data[index].auth_user;
      this.agent._val = this.data[index].agent_user;
      this.deadline = this.data[index].agent_time;
      this.$nextTick(() => {
        this.showEditor = true;
      });
    },
    addHandler() {
      this.curIndex = -1;
      this.showEditor = true;
    },
    async saveHandler() {
      const data = {
        auth_user: this.reviewer._val,
        agent_user: this.agent._val,
        agent_time: this.deadline
      };
      if (this.curIndex !== -1) {
        data.autono = this.data[this.curIndex].auto_no;
      } else {
        data.method = "AddWfAgent";
      }
      this.showEditor = false;
      this.submitHandler(data);
    },
    async submitHandler(data) {
      const ret = await this.API.updateWfAgent({ ...data, wf_code: this.node.node_name });
      this.fetch();
    }
  }
};
</script>