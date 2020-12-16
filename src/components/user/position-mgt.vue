<template>
  <div class="pso-view-user" :class="viewClass">
    <div class="pso-view-extend" v-loading="initializing">
      <div class="pso-tabs">
        <div class="pso-tabs-header">
          <div class="pso-tabs-title">
            <i class="el-icon-s-custom"></i>
            <span>角色</span>
          </div>
          <div class="pso-tabs-r">
            <el-button size="mini" icon="el-icon-plus" circle @click="addRole"></el-button>
          </div>
        </div>
        <el-tabs tab-position="left" v-model="curNode">
          <el-tab-pane v-for="(n, i) in nodes" :label="n.duty_name" :name="n.duty_id" :key="i">
            <div class="pso-tabs-item" slot="label">
              <span>{{ n.duty_name }}</span>
              <div class="pso-tabs-item__ctrl">
                <i class="el-icon-edit-outline" @click.stop="editRole(n)"></i>
                <el-popconfirm title="你确定要删除吗？" @confirm="delRole(n)">
                  <i slot="reference" class="el-icon-delete"></i>
                </el-popconfirm>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="pso-view-body" v-loading="initializing">
      <template v-if="curNode">
        <div class="pso-view-mgt-tabs">
          <button-tabs v-model="curTab" :data="TABS"></button-tabs>
        </div>
        <div class="pso-view-table">
          <users v-if="curTab === 0" user-rel="1" :duty-id="curNode"></users>
          <node-auth v-if="curTab === 1" key="form" type="form" :bind-id="curNode" bind-type="2"></node-auth>
          <node-auth v-if="curTab === 2" key="wf" type="wf" :bind-id="curNode" bind-type="2"></node-auth>
        </div>
      </template>
    </div>
    <el-dialog title="职位编辑" append-to-body :visible.sync="showEditor" :width="'400px'">
      <el-form label-width="80px">
        <el-form-item label="职位名称">
          <el-input size="small" v-model="data.duty_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="职位编号">
          <el-input size="small" v-model="data.duty_code" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmSave()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { MgtMixin } from "../../mixin/view";
import ButtonTabs from "../button-tabs";
import Users from "./users";
import NodeAuth from "./auth";

const TABS = [{ label: "用户" }, { label: "表单权限" }, { label: "流程权限" }];

export default {
  components: { ButtonTabs, Users, NodeAuth },
  mixins: [MgtMixin],
  data() {
    this.TABS = TABS;
    return {
      initializing: false,
      showEditor: false,
      curNode: "",
      curTab: 0,
      nodes: [],
      optype: "",
      data: {
        duty_name: "",
        duty_id: "",
        duty_code: "",
      },
    };
  },
  computed: {},
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const ret = await this.API.getOrgs("position");
      this.nodes = ret.data;
      if (this.nodes.length) {
        this.curNode = this.nodes[0].duty_id;
      }
      this.initializing = false;
    },
    editRole(node) {
      this.data = Object.assign(this.data, node);
      this.optype = "1";
      this.showEditor = true;
    },
    reset() {
      this.data.duty_name = "";
      this.data.duty_id = "";
      this.data.duty_code = "";
    },
    delRole(node) {
      this.saveRole({ ...node, optype: "2" });
    },
    addRole() {
      this.reset();
      this.optype = "0";
      this.showEditor = true;
    },
    async confirmSave() {
      await this.saveRole({ ...this.data, optype: this.optype });
      this.reset();
    },
    async saveRole(data) {
      this.operating = true;
      const ret = await this.API.updatePosition(data);
      this.ResultNotify(ret);
      await this.initialize();
      this.showEditor = false;
      this.operating = false;
    },
  },
};
</script>