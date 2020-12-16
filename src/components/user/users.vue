<template>
  <div style="pso-view" v-loading="operating">
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
            <pso-picker-dept pattern="radio" @confirm="addHandler" text="新增用户"></pso-picker-dept>
            <el-popconfirm title="你确定要删除吗？" @confirm="delHandler">
              <el-button size="small" type="danger" plain slot="reference" :disabled="!selected.length">删除用户</el-button>
            </el-popconfirm>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <div class="pso-view-table__body">
          <el-table v-loading="loading" size="small" border :data="instances" style="width: 100%" @selection-change="handleSelectionChange">
            <template #default>
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
              <el-table-column prop="user_name" label="用户名"></el-table-column>
              <el-table-column prop="user_id" label="用户id"></el-table-column>
              <el-table-column prop="user_sex" label="性别"></el-table-column>
              <el-table-column prop="node_display" label="部门"></el-table-column>
              <el-table-column prop="user_type" label="角色"></el-table-column>
              <el-table-column label="操作" fixed="right" width="166">
                <template slot-scope="scope">
                  <el-button style="margin-right: 5px" size="mini" type="plain" @click="setHandler(scope.row.user_id)">配置</el-button>
                  <el-popconfirm title="你确定要重置吗？" @confirm="resetPass(scope.row.user_id)">
                    <el-button size="mini" type="danger" plain slot="reference">重置密码</el-button>
                  </el-popconfirm>
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
            :page-sizes="[limit, 30, 50, 100, 200, 500]"
            :total="dataTotal"
            :page-size="limit"
            :current-page="page"
            @size-change="sizeChangeHandler"
            @current-change="currentChangeHandler"
            @prev-click="prevClickHandler"
            @next-click="nextClickHandler"
          ></el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="职位" append-to-body :visible.sync="showEditor" :width="'400px'">
      <el-form label-width="80px" v-if="showEditor">
        <el-form-item label="用户ID">
          <el-input size="small" v-model="formData.user" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input size="small" v-model="formData.user_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input size="small" v-model="formData.user_pwd" autocomplete="off"></el-input>
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
export default {
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
  },
  data() {
    return {
      initializing: false,
      operating: false,
      showEditor: false,
      loading: false,
      keywords: "",
      dataTotal: 0,
      limit: 20,
      page: 1,
      keys: {},
      instances: [],
      selected: [],
      isSys: "",
      formData: {
        user: "",
        user_name: "",
        user_pwd: "",
        node_id: "",
      },
    };
  },
  computed: {
    defWhere() {
      return {
        limit: this.limit,
        start: this.page - 1,
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
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.loading = true;
      const params = { ...this.defWhere, keys: {} };
      if (this.keywords) {
        params.keys.user_name = { value: this.keywords, type: 2 };
      }
      if (this.isSys) {
        params.keys.is_sys = { value: this.isSys, type: 1 };
      }
      const ret = await this.API.searchUsers(params);
      this.instances = ret.data.data;
      this.dataTotal = ret.data.page;
      this.loading = false;
    },
    handleSelectionChange(val) {
      this.selected = val;
      this.$emit("select", val);
    },
    sizeChangeHandler(size) {
      this.limit = size;
    },
    currentChangeHandler(page) {
      this.page = page;
    },
    prevClickHandler() {
      this.page -= 1;
    },
    nextClickHandler() {
      this.page += 1;
    },
    setHandler(uid) {
      this.$router.push({ name: "userConfig", params: { uid } });
    },
    addHandler(data) {
      if (data.length) {
        this.formData.node_id = data[0].node_id;
      } else {
        this.formData.node_id = "";
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
      if (!this.formData.user_pwd || !this.formData.user_name || !this.formData.user) {
        return this.$message("请完善信息");
      }
      this.operating = true;
      const data = { ...this.formData, user_pwd: md5(this.formData.user_pwd), user_type: "PSOPLATFORM101" };
      if (!data.node_id) delete data.node_id;
      const ret = await this.API.addUser(data);
      this.formData = {
        user: "",
        user_name: "",
        user_pwd: "",
        node_id: "",
      };
      this.ResultNotify(ret);
      this.fetch();
      this.showEditor = false;
      this.operating = false;
    },
    async resetPass(user_id) {
      const ret = await this.API.resetUser({ users: user_id });
      this.ResultNotify(ret);
    },
  },
};
</script>
