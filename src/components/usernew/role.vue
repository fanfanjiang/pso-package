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
          <el-tab-pane v-for="(n, i) in nodes" :label="n.type_name" :name="n.user_type" :key="i">
            <div class="pso-tabs-item" slot="label">
              <span>{{ n.type_name }}</span>
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
        <div class="pso-view-table">
          <user-view user-rel="3" :type-id="curNode"></user-view>
        </div>
      </template>
    </div>
    <el-dialog title="角色编辑" append-to-body :visible.sync="showEditor" :width="'400px'">
      <el-form label-width="80px">
        <el-form-item label="类型名称">
          <el-input size="small" v-model="data.type_name" autocomplete="off"></el-input>
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
import UserView from "./user-view";

export default {
  components: { UserView },
  mixins: [MgtMixin],
  data() {
    return {
      initializing: false,
      showEditor: false,
      curNode: "",
      curTab: 0,
      nodes: [],
      optype: "",
      data: {
        type_name: "",
        user_type: "",
        apply_id: "",
        role_type: 0,
        manager_type: 0,
      },
      entrance: [],
      setting: {
        entrance: [],
        desk: "",
      },
      templetes: [],
    };
  },
  computed: {
    curRole() {
      return _.find(this.nodes, { user_type: this.curNode });
    },
  },
  watch: {
    curNode() {
      this.makeSetting();
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    async initialize() {
      this.initializing = true;
      const ret = await this.API.getUserType();
      this.nodes = ret.data;
      if (this.nodes.length) {
        this.curNode = this.nodes[0].user_type;
      }
      this.entrance = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { type: 1, value: 12 } }) })).data;
      this.templetes = await this.API.getTempleteTree([2]);
      this.initializing = false;
    },
    async makeSetting() {
      if (this.curRole) {
        this.setting.entrance = this.curRole.setting_block ? this.curRole.setting_block.split(",") : [];
        this.setting.desk = this.curRole.user_main_page;
      }
    },
    editRole(node) {
      this.data = Object.assign(this.data, node);
      this.optype = "1";
      this.showEditor = true;
    },
    reset() {
      this.data.type_name = "";
      this.data.user_type = "";
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
      data.apply_id = this.__CONST__.SHITID;
      data.is_default = data.is_default || 0;
      data.role_type = data.role_type || 0;
      data.manager_type = data.manager_type || 0;
      const ret = await this.API.updateUserType(data);
      this.ResultNotify(ret);
      await this.initialize();
      this.showEditor = false;
      this.operating = false;
    },
    setHandler() {
      this.saveRole({
        ...this.curRole,
        setting_block: this.setting.entrance.join(","),
        user_main_page: this.setting.desk,
        optype: "1",
      });
    },
  },
};
</script>