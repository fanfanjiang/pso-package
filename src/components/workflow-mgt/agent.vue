<template>
  <div style="margin-top:15px">
    <div class="pso-table-controller">
      <el-button size="small" type="primary" plain @click="addHandler()">新增</el-button>
      <el-button size="small" type="primary" plain @click="submitHandler()">保存</el-button>
    </div>
    <el-table key="field" :data="data" style="width: 100%" height="600">
      <el-table-column type="index" :index="1"></el-table-column>
      <el-table-column label="审批人">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.rList" :key="index">{{item.user_name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="代理人">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.aList" :key="index">{{item.user_name}}</el-tag>
        </template>
      </el-table-column>
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
        <pso-form-user :cpnt="{data:reviewer}" @value-change="handleReviewChange"></pso-form-user>
        <pso-form-user :cpnt="{data:agent}" @value-change="handleAgentChange"></pso-form-user>
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
  props: ["data"],
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
      agentList: [],
      reviewerList: []
    };
  },
  methods: {
    delHandler(index) {
      this.data.splice(index, 1);
    },
    editHandler(index) {
      this.curIndex = index;

      this.reviewer._val = this.data[index].reviewer;
      this.agent._val = this.data[index].agent;
      this.deadline = this.data[index].agent_time;
      this.$nextTick(() => {
        this.showEditor = true;
      });
    },
    addHandler() {
      this.curIndex = -1;
      this.showEditor = true;
    },
    saveHandler() {
      const data = {
        reviewer: this.reviewer._val,
        agent: this.agent._val,
        agent_time: this.deadline,
        rList: _.cloneDeep(this.reviewerList),
        aList: _.cloneDeep(this.agentList)
      };
      if (this.curIndex === -1) {
        this.data.push(data);
      } else {
        this.data.splice(this.curIndex, 1, data);
      }
      this.showEditor = false;
    },
    handleReviewChange({ proxy }) {
      this.reviewerList = proxy.list;
    },
    handleAgentChange({ proxy }) {
      this.agentList = proxy.list;
    },
    async submitHandler() {
      const ret = await this.API.updateWfAgent({
        
      });
    }
  }
};
</script>