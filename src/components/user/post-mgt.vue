<template>
  <div class="pso-view-user" :class="viewClass">
    <div class="pso-view-extend" v-loading="initializing">
      <div class="pso-tabs">
        <div class="pso-tabs-header">
          <div class="pso-tabs-title">
            <i class="el-icon-s-custom"></i>
            <span>岗位</span>
          </div>
          <div class="pso-tabs-r">
            <el-button size="mini" icon="el-icon-plus" circle @click="addRole"></el-button>
          </div>
        </div>
        <el-tabs tab-position="left" v-model="curNode">
          <el-tab-pane v-for="(n, i) in nodes" :label="n.post_name" :name="n.post_id" :key="i">
            <div class="pso-tabs-item" slot="label">
              <span>{{ n.post_name }}</span>
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
    <div class="pso-view-body" style="padding: 0 0 0 10px;" v-loading="initializing">
      <div v-if="curNode">
        <users user-rel="2" :post-id="curNode" :node-id="nodeId"></users>
      </div>
    </div>
    <el-dialog title="岗位编辑" append-to-body :visible.sync="showEditor" :width="'400px'">
      <el-form label-width="80px">
        <el-form-item label="岗位名称">
          <el-input size="small" v-model="data.post_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗位编号">
          <el-input size="small" v-model="data.post_class" autocomplete="off"></el-input>
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

export default {
  components: { ButtonTabs, Users, NodeAuth },
  mixins: [MgtMixin],
  props: {
    nodeId: Number,
  },
  data() {
    return {
      initializing: false,
      showEditor: false,
      curNode: "",
      nodes: [],
      optype: "",
      data: {
        post_id: "",
        post_class: "",
        post_name: "",
      },
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const ret = await this.API.getOrgs("post");
      this.nodes = ret.data;
      if (this.nodes.length) {
        this.curNode = this.nodes[0].post_id;
      }
      this.initializing = false;
    },
    editRole(node) {
      this.data = Object.assign(this.data, node);
      this.optype = "1";
      this.showEditor = true;
    },
    reset() {
      this.data.post_name = "";
      this.data.post_id = "";
      this.data.post_class = "";
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
      const ret = await this.API.updatePost(data);
      this.ResultNotify(ret);
      await this.initialize();
      this.showEditor = false;
      this.operating = false;
    },
  },
};
</script>