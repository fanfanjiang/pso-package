<template>
  <div class="pso-view" v-loading="operating">
    <div class="pso-view-body">
      <div class="pso-view-fun">
        <div class="pso-view-fun-l">
          <div class="view-table-fun">
            <el-select size="mini" v-model="isSys" placeholder="请选择" clearable>
              <el-option label="全部用户" value=""> </el-option>
              <el-option label="注册用户" value="0"> </el-option>
              <el-option label="系统用户" value="1"> </el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <pso-search text="搜索" v-model="keywords"></pso-search>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
          </div>
        </div>
        <div class="pso-view-fun-r">
          <div class="view-data-fun">
            <slot name="fun" :selected="selected"></slot>
            <el-button v-if="nodeId" size="mini" type="primary" @click="addHandler()">新增用户</el-button>
            <pso-picker-dept v-else pattern="radio" @confirm="addHandler" @cancel="addHandler" text="新增用户"></pso-picker-dept>
            <el-popconfirm title="你确定要重置吗？" @confirm="resetPass">
              <el-button size="mini" type="warning" plain slot="reference" :disabled="!selected.length">重置密码</el-button>
            </el-popconfirm>
            <!-- <el-button size="mini" type="plain" :disabled="!selected.length" @click="setHandler">配置</el-button> -->
            <el-popconfirm title="你确定要删除吗？" @confirm="delHandler">
              <el-button size="mini" type="danger" plain slot="reference" :disabled="!selected.length">删除</el-button>
            </el-popconfirm>
            <el-button v-if="syncable" size="mini" type="primary" @click="syncSys" :disabled="syncing" :loading="syncing">同步</el-button>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <div class="pso-view-table__body">
          <el-table
            v-loading="loading"
            size="small"
            border
            :data="instances"
            style="width: 100%"
            :rowStyle="analyzeRowStyle"
            @row-click="rowClickHandler"
            @row-dblclick="rowdbClickHandler"
            @selection-change="handleSelectionChange"
          >
            <template #default>
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
              <el-table-column prop="user_name" label="用户名"></el-table-column>
              <el-table-column prop="user_id" label="用户id"></el-table-column>
              <el-table-column prop="user_sex" label="性别">
                <template slot-scope="scope">
                  <span>{{ getSex(scope.row.user_sex) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="node_display" label="部门"></el-table-column>
              <el-table-column prop="user_type" label="角色">
                <template slot-scope="scope">
                  <span>{{ getRole(scope.row.user_type) }}</span>
                </template>
              </el-table-column>
            </template>
            <template #empty>
              <pso-empty></pso-empty>
            </template>
          </el-table>
        </div>
        <div class="pso-view-table__footer">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 15, 20, 30, 50]"
            :total="dataTotal"
            :page-size="fetchParams.limit"
            :current-page="fetchParams.start"
            @size-change="sizeChangeHandler"
            @current-change="currentChangeHandler"
            @prev-click="prevClickHandler"
            @next-click="nextClickHandler"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="编辑用户" append-to-body :visible.sync="showEditor" :width="'420px'">
      <el-form label-width="80px" v-if="showEditor">
        <el-form-item label="用户ID">
          <el-input v-if="data.user_id" size="small" :disabled="true" v-model="data.user_id" autocomplete="off"></el-input>
          <el-input v-else size="small" v-model="data.user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input size="small" v-model="data.user_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select size="mini" clearable v-model="data.user_sex">
            <el-option v-for="(f, i) in SEX" :key="i" :label="f.name" :value="f.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select size="mini" clearable v-model="data.user_type">
            <el-option v-for="(r, i) in roles" :key="i" :label="r.type_name" :value="r.user_type"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" v-if="!data.user_id">
          <el-input size="small" v-model="data.user_pwd" autocomplete="off"></el-input>
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
import { md5 } from "../../utils/md5";
import { PagingMixin } from "../../mixin/view";

const SEX = [
  { name: "男", value: "1" },
  { name: "女", value: "2" },
  { name: "未知", value: "0" },
];

const USER = { user_id: "", user: "", user_name: "", user_pwd: "", user_sex: "", user_type: "", node_id: "", is_sys: "" };
export default {
  mixins: [PagingMixin],
  props: {
    searchType: {
      type: String,
      default: "0",
    },
    funType: {
      type: String,
      default: "UserPage",
    },
    userRel: {
      type: String,
      default: "0",
    },
    nodeId: {
      type: String,
      default: "",
    },
    dutyId: {
      type: String,
      default: "",
    },
    postId: {
      type: String,
      default: "",
    },
    typeId: {
      type: String,
      default: "",
    },
    syncable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.SEX = SEX;
    return {
      syncing: false,
      initializing: false,
      operating: false,
      showEditor: false,
      loading: false,
      keywords: "",
      dataTotal: 0,
      instances: [],
      selected: [],
      isSys: "",
      roles: [],
      data: { ...USER },
      curUser: null,
    };
  },
  computed: {
    defWhere() {
      return {
        duty_id: this.dutyId,
        node_id: this.nodeId,
        post_id: this.postId,
        search_type: this.searchType,
        type: this.funType,
        user_rel: this.userRel,
        type_id: this.typeId,
      };
    },
  },
  watch: {
    defWhere: {
      deep: true,
      handler() {
        !this.initializing && this.fetch();
      },
    },
    keywords: {
      handler() {
        this.fetch();
      },
    },
    isSys: {
      handler() {
        this.fetch();
      },
    },
  },
  async created() {
    this.fetchParams.limit = 15;
    this.roles = (await this.API.getUserType()).data;
    this.resetUser();
    this.startWatch();
    this.$on("load", () => {
      this.fetch();
    });
    this.fetch();
  },
  methods: {
    resetUser() {
      this.data = { ...USER, user_type: this.typeId, node_id: this.nodeId, is_sys: this.isSys || "0" };
    },
    async fetch() {
      this.loading = true;
      const params = { ...this.defWhere, ...this.getFetchParams(), keys: {} };
      if (this.keywords) {
        params.keys.user_name = { value: this.keywords, type: 2 };
      }
      if (this.isSys) {
        params.keys.is_sys = { value: this.isSys, type: 1 };
      }
      const ret = await this.API.searchUsers(params);
      this.instances = ret.data.data;
      if (this.instances.length) {
        this.rowClickHandler(this.instances[0]);
      }
      this.dataTotal = ret.data.page;
      this.loading = false;
    },
    handleSelectionChange(val) {
      this.selected = val;
      this.$emit("select", val);
    },
    setHandler() {
      this.$router.push({ name: "userConfig", params: { uid: _.map(this.selected, "user_id").join(",") } });
    },
    addHandler(data) {
      this.resetUser();
      if (data && data.length) {
        this.data.node_id = data[0].node_id;
      }
      this.showEditor = true;
    },
    async delHandler() {
      this.operating = true;
      const ret = await this.API.delUsers({ users: this.selected.map((item) => item.user_id).join(",") });
      this.ResultNotify(ret);
      this.fetch();
      this.operating = false;
    },
    async saveHandler() {
      if (!this.data.user_name) {
        return this.$message("请完善信息");
      }
      const data = { ...this.data };
      if (!this.data.user_id) {
        if (!this.data.user_pwd || !this.data.user) {
          return this.$message("请完善信息");
        }
        data.user_pwd = md5(this.data.user_pwd);
      } else {
        delete data.user_pwd;
      }
      if (!data.node_id) delete data.node_id;

      this.operating = true;
      const ret = await this.API.addUser(data);
      this.ResultNotify(ret);
      if (ret.success) {
        this.$emit("adduser", [{ user_id: this.data.user }]);
      }
      this.fetch();
      this.showEditor = false;
      this.operating = false;
    },
    async resetPass() {
      const ret = await this.API.resetUser({ users: this.selected[0].user_id });
      this.ResultNotify(ret);
    },
    getSex(value) {
      const exist = _.find(this.SEX, { value });
      return exist ? exist.name : "未知";
    },
    getRole(user_type) {
      const exist = _.find(this.roles, { user_type });
      return exist ? exist.type_name : "";
    },
    rowClickHandler(user) {
      this.curUser = user;
      this.$emit("clickinstance", user);
    },
    analyzeRowStyle({ row, rowIndex }) {
      if (this.curUser && this.curUser.user_id === row.user_id) {
        return { "background-color": "#DCF1FF" };
      }
    },
    rowdbClickHandler(user) {
      for (let key in this.data) {
        if (this.data.hasOwnProperty(key)) {
          this.data[key] = user[key];
        }
      }
      this.showEditor = true;
    },
    async syncSys() {
      this.syncing = true;
      const ret = await this.API.syncUsers();
      this.ResultNotify(ret);
      this.syncing = false;
    },
  },
};
</script>
