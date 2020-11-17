<template>
  <div>
    <div>
      <div v-if="viewAuths.length > 1">
        <el-tabs v-model="activeView">
          <el-tab-pane :label="a.n" :name="a.v + ''" v-for="a in viewAuths" :key="a.v"></el-tab-pane>
        </el-tabs>
      </div>
      <div style="margin-top: 10px">
        <el-button size="mini" type="primary" @click="addHandler()">新增</el-button>
      </div>
    </div>
    <el-table v-loading="loading" ref="multipleTable" height="500" size="small" :data="data" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="r_name" label="资源名"></el-table-column>
      <el-table-column prop="r_time" label="添加时间"></el-table-column>
      <el-table-column label="操作" fixed="right" width="290">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editHandler(scope.row)">编辑</el-button>
          <el-button size="mini" @click="$emit('go', { data: scope.row, node })">查看</el-button>
          <pso-picker-user pattern="radio" @confirm="shareHandler($event, scope.row)">
            <span style="margin: 0 10px">
              <el-button size="mini" type="warning">转发</el-button>
            </span>
          </pso-picker-user>
          <el-button size="mini" type="danger" @click="delHandler(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pso-table-footer">
      <el-pagination
        background
        layout="total, prev, next"
        :total="dataTotal"
        :page-size="30"
        :current-page="page"
        @prev-click="prevClickHandler"
        @next-click="nextClickHandler"
      ></el-pagination>
    </div>
    <el-dialog title="资源" append-to-body :visible.sync="showEditor" :width="'500px'">
      <el-form label-width="80px" v-if="showEditor">
        <el-form-item label="资源名称" required>
          <el-input size="mini" :clearable="true" v-model="curData.r_name"></el-input>
        </el-form-item>
        <form-attachment :cpnt="{ data: curCpnt }"></form-attachment>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveHandler()" :disabled="saving">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import FormAttachment from "../form-interpreter/components/attachment";
import { MENU_LEAF_AUTH } from "../../const/menu";
export default {
  props: {
    node: Object,
    viewAuth: {
      type: Number,
      default: 0,
    },
    defKeys: String,
  },
  components: { FormAttachment },
  data() {
    return {
      initializing: false,
      loading: false,
      data: [],
      page: 1,
      limit: 20,
      dataTotal: 0,
      showEditor: false,
      curCpnt: {
        _fieldName: "文件",
        _required: true,
        _val: "",
        _limit: 1,
      },
      curData: {
        r_name: "",
      },
      optype: "",
      shareuid: "",
      saving: false,
      viewAuths: [],
      activeView: "",
      defaultKeys: [],
    };
  },
  computed: {
    where() {
      return {
        page: this.page - 1,
        limit: this.limit,
      };
    },
  },
  watch: {
    "node.node_id"() {
      this.fetch();
    },
    where() {
      this.fetch();
    },
    activeView() {
      this.fetch();
    },
  },
  async created() {
    await this.initializ();
  },
  methods: {
    async initializ() {
      this.initializing = true;

      if (this.defKeys) {
        this.defKeys.split(";").forEach((item) => {
          const key = item.split(",");
          this.defaultKeys[key[0]] = { value: key[1], type: key[2] };
        });
      }

      if (typeof this.viewAuth !== "undefined") {
        MENU_LEAF_AUTH.forEach((a) => {
          if ((a.v & this.viewAuth) === a.v) {
            this.viewAuths.push(a);
          }
        });
        this.viewAuths = _.orderBy(this.viewAuths, ["v"], ["desc"]);
        this.activeView = this.viewAuths[0].v + "";
      } else {
        await this.fetch();
      }
      console.log(this.viewAuths);
      this.initializing = false;
    },
    async fetch() {
      this.loading = true;
      const ret = await this.API.resource({
        data: {
          ...this.where,
          leaf_auth: this.activeView,
          node_id: this.node.node_id,
          keys: JSON.stringify({ ...this.defaultKeys }),
        },
      });
      if (ret.success) {
        this.data = ret.data;
        this.dataTotal = ret.count;
      }
      this.loading = false;
    },
    prevClickHandler() {
      this.page -= 1;
    },
    nextClickHandler() {
      this.page += 1;
    },
    addHandler() {
      this.curData = {
        r_name: "",
        leaf_id: "",
      };
      this.curCpnt._val = "";
      this.optype = 0;
      this.showEditor = true;
    },
    editHandler(data) {
      this.curData = data;
      this.curCpnt._val = data.map_key;
      this.optype = 1;
      this.showEditor = true;
    },
    delHandler(data) {
      this.optype = 2;
      this.curData = data;
      this.saveHandler();
    },
    shareHandler(users, data) {
      if (!users.length) return;
      this.shareuid = users[0].user_id;
      this.optype = 3;
      this.curData = data;
      this.saveHandler();
    },
    async saveHandler() {
      this.saving = true;
      const ret = await this.API.resource({
        data: { ...this.curData, map_key: this.curCpnt._val, r_user: this.shareuid, node_id: this.node.node_id, optype: this.optype },
        method: this.curData.leaf_id ? "put" : "post",
      });
      this.ResultNotify(ret);
      this.showEditor = false;
      this.saving = false;
      await this.fetch();
    },
  },
};
</script>