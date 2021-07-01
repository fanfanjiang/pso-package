<template>
  <div>
    <div class="pso-table-controller">
      <el-button size="mini" type="primary" plain @click="addHandler">添加</el-button>
    </div>
    <el-table key="status" size="mini" border :data="data" style="width: 100%">
      <el-table-column label="用户">
        <template slot-scope="scope">
          <el-select size="mini" filterable multiple clearable v-model="scope.row.users">
            <el-option v-for="(f, i) in users" :key="i" :label="f.user_name" :value="f.user_id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="权限">
        <template slot-scope="scope">
          <auth-edit v-model="scope.row.auth" :data="MENU_LEAF_AUTH"></auth-edit>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="delHandler(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import AuthEdit from "../common-auth/edit";
import { formatJSONList } from "../../utils/util";
import { MENU_LEAF_AUTH } from "../../const/menu";
const FIELDS = {
  users: [],
  auth: 1,
};
export default {
  components: { AuthEdit },
  props: ["data"],
  data() {
    this.MENU_LEAF_AUTH = MENU_LEAF_AUTH;
    return {
      users: [],
    };
  },
  async created() {
    formatJSONList(this.data, FIELDS);
    let ret = await this.API.searchUsers({ limit: 99999, user_rel: "0", search_type: "0", node_id: "", post_id: "", duty_id: "" });
    if (ret.success) {
      this.users = ret.data.data;
    }
  },
  methods: {
    addHandler() {
      this.data.push(_.cloneDeep(FIELDS));
    },
    delHandler(index) {
      this.data.splice(index, 1);
    },
  },
};
</script>