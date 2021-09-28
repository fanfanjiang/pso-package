<template>
  <div class="pso-view" ref="view" v-loading="operating">
    <div class="pso-view-body">
      <div ref="header">
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
              <el-button v-if="defopable" size="mini" type="primary" @click="addHandler()">新增职员</el-button>
              <slot name="fun" :selected="selected"></slot>
              <template v-if="defopable">
                <el-popconfirm title="你确定要重置吗？" @confirm="resetPass">
                  <el-button size="mini" type="warning" plain slot="reference" :disabled="!selected.length">重置密码</el-button>
                </el-popconfirm>
                <el-popconfirm title="你确定要删除吗？" @confirm="delHandler">
                  <el-button size="mini" type="danger" plain slot="reference" :disabled="!selected.length">物理删除</el-button>
                </el-popconfirm>
                <el-popconfirm title="你确定要冻结吗？" @confirm="shitHandler">
                  <el-button size="mini" type="danger" plain slot="reference" :disabled="!selected.length">冻结</el-button>
                </el-popconfirm>
                <el-button v-if="syncable" size="mini" type="primary" @click="syncSys" :disabled="syncing" :loading="syncing">
                  同步
                </el-button>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-view-table" v-if="heightchecked">
        <div class="pso-view-table__body">
          <el-table
            v-loading="loading"
            size="small"
            border
            :data="instances"
            style="width: 100%"
            :rowStyle="analyzeRowStyle"
            :height="tableHeight"
            @row-click="rowClickHandler"
            @row-dblclick="rowdbClickHandler"
            @selection-change="handleSelectionChange"
          >
            <template #default>
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column type="index" label="序号" :index="1" width="50" align="center"></el-table-column>
              <el-table-column prop="user_id" label="账号"></el-table-column>
              <el-table-column prop="user_name" label="姓名"></el-table-column>
              <el-table-column prop="user_phone" label="手机号"></el-table-column>
              <el-table-column prop="user_email" label="邮箱"></el-table-column>
              <el-table-column prop="user_sex" label="性别" align="center" width="100">
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
    <el-dialog :title="data.user_id ? '编辑职员' : '新增职员'" append-to-body :visible.sync="showEditor" :width="'440px'">
      <el-form label-width="60px" v-if="showEditor">
        <el-form-item label="账号" required>
          <el-input v-if="data.user_id" size="medium" :disabled="true" v-model="data.user_id" autocomplete="off"></el-input>
          <el-input v-else-if="base.userGenFun !== '1'" size="medium" v-model="data.user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="!data.user_id" required>
          <el-input size="medium" v-model="data.user_pwd" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input size="medium" v-model="data.user_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" required>
          <el-input size="medium" v-model="data.user_phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" required>
          <el-input size="medium" v-model="data.user_email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group size="medium" v-model="data.user_sex">
            <el-radio v-for="(f, i) in SEX" :key="i" :label="f.value">{{ f.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" required>
          <el-select size="medium" clearable v-model="data.user_type">
            <el-option v-for="(r, i) in roles" :key="i" :label="r.type_name" :value="r.user_type"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="showEditor = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="saveHandler()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { md5 } from "../../utils/md5";
import { PagingMixin } from "../../mixin/view";
import { mapState } from "vuex";

const SEX = [
  { name: "男", value: "1" },
  { name: "女", value: "2" },
  { name: "未知", value: "0" },
];

const STATUS = [
  { name: "激活", value: 1 },
  { name: "冻结", value: 0 },
];

const USER = {
  user_id: "",
  user: "",
  user_name: "",
  user_pwd: "",
  user_sex: "",
  user_phone: "",
  user_email: "",
  user_type: "",
  node_id: "",
  is_sys: "",
  d_status: 1,
};
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
    defopable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    this.SEX = SEX;
    this.STATUS = STATUS;
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
      tableHeight: 200,
      heightchecked: false,
    };
  },
  computed: {
    ...mapState(["base"]),
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
  mounted() {
    const height = $(this.$refs.view).height() - $(this.$refs.header).height() - 50;
    if (height > 100) {
      this.tableHeight = height;
    }
    this.heightchecked = true;
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
        if (!this.data.user_pwd) {
          return this.$message("请完善信息");
        }
        const regex = new RegExp("(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{6,16}");
        if (!regex.test(this.data.user_pwd)) {
          return this.$message("您的密码复杂度太低（密码中必须包含大小写字母、数字）,长度为6到16位");
        }
        if (this.base.userGenFun !== "1") {
          if (!data.user) {
            return this.$message("请完善信息");
          }
        }
        data.user_pwd = md5(this.data.user_pwd);
      } else {
        delete data.user_pwd;
      }
      if (!data.user_type) {
        return this.$message("请完善角色信息");
      }
      if (!this.data.user_id && !data.node_id) {
        return this.$message("请完善部门信息");
      }

      this.operating = true;
      const ret = await this.API.addUser(data);
      this.ResultNotify(ret);
      if (ret.success) {
        if (data.user) {
          this.$emit("adduser", [{ user_id: data.user }]);
        }
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
    async shitHandler() {
      this.operating = true;
      const ret = await this.API.request("/api/user/freeze", {
        data: { users: this.selected.map((item) => item.user_id).join(",") },
        method: "put",
      });
      this.ResultNotify(ret);
      this.fetch();
      this.operating = false;
    },
  },
};
</script>
