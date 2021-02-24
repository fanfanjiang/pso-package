<template>
  <div class="pso-view">
    <div class="pso-view-body">
      <div ref="header">
        <div class="pso-view-header">
          <div class="pso-view-header__l">
            <div class="pso-view-title">
              <i class="el-icon-coin"></i>
              <span>数据表配置及同步</span>
            </div>
          </div>
        </div>
        <div class="pso-view-fun">
          <div class="pso-view-fun-l">
            <div class="view-table-fun">
              <pso-search text="搜索" v-model="fetchParams.keywords"></pso-search>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
            </div>
          </div>
          <div class="pso-view-fun-r">
            <div class="view-data-fun">
              <el-button type="primary" size="mini" @click="addHandler">新增</el-button>
              <el-button type="danger" size="mini" @click="delHandler">删除</el-button>
              <pso-picker-tree :request-options="{ dimen: '3' }" pattern="checkbox" @confirm="confirmWipe">
                <el-button type="danger" size="mini">清空数据库</el-button>
              </pso-picker-tree>
              <el-button style="margin-left: 10px" type="success" size="mini" @click="asyncHandler">同步系统表</el-button>
              <pso-picker-tree :request-options="{ dimen: '3' }" pattern="checkbox" @confirm="confirmForm">
                <el-button type="success" size="mini">同步表单数据</el-button>
              </pso-picker-tree>
            </div>
          </div>
        </div>
      </div>
      <div class="pso-view-table">
        <el-table
          v-loading="fetching"
          size="small"
          border
          :data="instances"
          style="width: 100%"
          @row-dblclick="rowdbClickHandler"
          @selection-change="changeHandler"
        >
          <template #default>
            <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
            <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
            <el-table-column prop="table_id" label="表ID"></el-table-column>
            <el-table-column prop="table_name" label="表名"></el-table-column>
            <el-table-column prop="child_config" label="子类配置"></el-table-column>
            <el-table-column prop="table_cate" label="分类"></el-table-column>
            <el-table-column prop="table_order" label="排序"></el-table-column>
            <el-table-column prop="table_note" label="说明"></el-table-column>
          </template>
          <template #empty>
            <pso-empty></pso-empty>
          </template>
        </el-table>
        <div class="pso-view-table__footer">
          <el-pagination
            background
            :page-sizes="[20, 30, 50, 100]"
            :total="dataTotal"
            :page-size="fetchParams.limit"
            :current-page="fetchParams.start"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChangeHandler"
            @current-change="currentChangeHandler"
            @prev-click="prevClickHandler"
            @next-click="nextClickHandler"
          ></el-pagination>
        </div>
      </div>
    </div>
    <pso-dialog :visible="showEditor" width="40%" @close="showEditor = false">
      <template #title>
        <div class="form-executor-header" v-loading="editing">
          <div class="form-executor-header__l">
            <div class="form-executor-title">
              <i class="el-icon-edit-outline"></i>
              <span>数据表配置</span>
            </div>
          </div>
          <div class="form-executor-header__r">
            <el-button type="primary" size="mini" @click="saveHandler()">保存</el-button>
          </div>
        </div>
      </template>
      <div style="height: 100%; padding: 15px; overflow: auto" v-loading="editing">
        <el-form label-position="left" label-width="100px" size="small">
          <el-form-item label="表ID" required>
            <el-input v-model="curInstance.table_id" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="表名" required>
            <el-input v-model="curInstance.table_name" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="子类配置" required>
            <el-input v-model="curInstance.child_config" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类" required>
            <el-input v-model="curInstance.table_cate" size="mini" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序" required>
            <el-input-number size="mini" v-model="curInstance.table_order" controls-position="right" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="说明" required>
            <el-input v-model="curInstance.table_note" size="mini" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </pso-dialog>
    <pso-dialog :visible="syncProxy.visible" width="60%" @close="syncProxy.visible = false">
      <template #title>
        <pso-dialog-header v-loading="syncProxy.doing">
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>数据表同步</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="goAsync()">同步</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content" v-loading="editing">
        <el-form label-position="left" label-width="110px" size="small">
          <el-form-item label="同步目标APP" required>
            <el-select filterable clearable size="small" v-model="syncProxy.tid">
              <el-option v-for="(s, i) in sites" :key="i" :label="s.site_name" :value="s.site_app"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="同步类型" required>
            <el-select filterable clearable size="small" v-model="syncProxy.type">
              <el-option v-for="(t, i) in ASYNC_TYPE" :key="i" :label="t.n" :value="t.v"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="同步表单" required>
            <div class="pso-picker__showlist">
              <span v-for="(d, i) in syncProxy.data" :key="i">
                <el-tag size="medium" closable @close="closeHandler(i)">
                  {{ d[syncProxy.nameField] }}
                </el-tag>
              </span>
            </div>
          </el-form-item>
          <pso-form-interpreter
            v-if="syncProxy.entity"
            :form-entity="syncProxy.entity"
            @data-loaded="formLoadHandler"
          ></pso-form-interpreter>
          <sys-table v-if="couldSyncSys" ref="systable" :code="syncProxy.data[0].table_name"></sys-table>
        </el-form>
      </div>
    </pso-dialog>
    <wipe-dialog :store="$data" @wipe="wipe">
      <div style="margin: 10px" v-if="wipeProxy.data.length">除以下表单以外</div>
      <div class="pso-picker__showlist">
        <span v-for="(d, i) in wipeProxy.data" :key="i">
          <el-tag size="medium">
            {{ d.n }}
          </el-tag>
        </span>
      </div>
    </wipe-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
import WipeDialog from "../form-view/wipe-dialog";
import FormAsstable from "../form-interpreter/components/asstable";
import SysTable from "./sys-table";

const DATA = {
  table_id: "",
  table_name: "",
  child_config: "",
  table_cate: "",
  table_order: "",
  table_note: "",
};

const ASYNC_TYPE = [
  { n: "插入", v: "0" },
  { n: "更新", v: "1" },
  { n: "插入或更新", v: "2" },
];

const FID = "ffuucckk";

export default {
  components: { WipeDialog, FormAsstable, SysTable },
  mixins: [PagingMixin],
  data() {
    this.ASYNC_TYPE = ASYNC_TYPE;
    return {
      fetching: false,
      editing: false,
      instances: [],
      dataTotal: 0,
      showEditor: false,
      curInstance: { ...DATA },
      selected: [],
      sites: [],
      syncProxy: {
        doing: false,
        visible: false,
        tid: "",
        data: [],
        idField: "",
        nameField: "",
        type: "0",
        entity: null,
        store: null,
      },
      wipeProxy: {
        visible: false,
        check: "",
        tip: "",
        data: [],
        doing: false,
      },
    };
  },
  computed: {
    couldSyncSys() {
      return this.syncProxy.idField === "table_id" && this.syncProxy.data.length === 1;
    },
  },
  watch: {
    "syncProxy.data": {
      deep: true,
      handler() {
        this.checkCouldSelectData();
      },
    },
  },
  async created() {
    this.startWatch();
    await this.fetch();
    this.$on("load", () => {
      this.fetch();
    });

    this.sites = (await this.API.getSites({ limit: 999, start: 0 })).data.data.filter(
      (d) => d.site_app !== this.$store.state.base.user.appid
    );
  },
  methods: {
    async fetch() {
      this.fetching = true;
      const ret = await this.API.dbtable({ data: this.getFetchParams("table_name") });
      this.instances = ret.data;
      this.dataTotal = ret.count;
      this.fetching = false;
    },
    addHandler() {
      this.curInstance = { ...DATA };
      this.showEditor = true;
    },
    rowdbClickHandler(row) {
      this.curInstance = row;
      this.showEditor = true;
    },
    async saveHandler(params) {
      if (this.editing) return;
      this.editing = true;
      let data = {};
      if (params) {
        data = { ...params, optype: 2 };
      } else {
        const { auto_no } = this.curInstance;
        data = { ...this.curInstance, optype: auto_no ? 1 : 0 };
      }
      const ret = await this.API.dbtable({ data, method: "post" });
      this.ResultNotify(ret);
      this.showEditor = false;
      this.fetch();
      this.editing = false;
    },
    async delHandler() {
      if (!this.selected.length) {
        return;
      }
      this.saveHandler({ auto_no: this.selected[0].auto_no });
    },
    changeHandler(rows) {
      this.selected = rows;
    },
    asyncHandler() {
      this.prepareAsync(this.selected, "table_id", "table_name");
    },
    confirmForm(data) {
      this.prepareAsync(data, "node_name", "node_display");
    },
    formLoadHandler(store) {
      this.syncProxy.store = store;
    },
    checkCouldSelectData() {
      const data = this.syncProxy.data;
      const id = this.syncProxy.idField;
      if (data.length === 1 && id === "node_name") {
        this.syncProxy.entity = {
          forceInsertSys: false,
          withSys: false,
          designMode: false,
          data_config: [
            {
              componentid: "asstable",
              _fieldValue: FID,
              _fieldName: "同步数据",
              _type: 2,
              _option: data[0].node_name,
              _displayType: "2",
              _relate: true,
              _new: false,
            },
          ],
        };
      } else {
        this.syncProxy.entity = null;
        this.syncProxy.store = null;
      }
      if (!data.length) {
        this.syncProxy.visible = false;
      }
    },
    prepareAsync(data, id, name) {
      if (!data.length) return this.$message({ type: "warning", message: "请选择需要同步的表单" });
      this.syncProxy.idField = id;
      this.syncProxy.nameField = name;
      this.syncProxy.data = data;
      this.syncProxy.visible = true;
    },
    getSelectedData() {
      if (this.couldSyncSys) {
        return _.map(this.$refs.systable.instances, "id").join(",");
      } else {
        if (this.syncProxy.store) {
          const cpnt = this.syncProxy.store.searchByField(FID, true);
          return cpnt._val;
        }
      }
      return "";
    },
    async goAsync() {
      if (this.syncProxy.doing) return;
      const { tid: custom_id, data, idField, type: async_type } = this.syncProxy;
      this.syncProxy.doing = true;
      const ret = await this.API.asyncDBTable({
        custom_id,
        async_type,
        code: data.map((d) => d[idField]).join(","),
        ids: this.getSelectedData(),
      });
      this.ResultNotify(ret);
      this.syncProxy.doing = false;
      this.syncProxy.visible = false;
    },
    confirmWipe(data) {
      let temp = this.selected.map((s) => ({ n: s.table_name, id: s.table_id }));
      this.wipeProxy.tip = data.length ? "所选表单以外" : "全部";
      this.wipeProxy.data = temp.concat(data.map((d) => ({ n: d.node_display, id: d.node_name })));
      this.wipeProxy.check = "";
      this.wipeProxy.visible = true;
    },
    async wipe() {
      if (this.wipeProxy.doing || this.wipeProxy.check !== "DELETE") return;
      this.wipeProxy.doing = true;
      const ret = await this.API.wipeDataAll({ wipe: true, data_code: this.wipeProxy.data.map(({ id }) => id).join(",") });
      this.ResultNotify(ret);
      this.wipeProxy.doing = false;
      this.wipeProxy.visible = false;
    },
    closeHandler(index) {
      this.syncProxy.data.splice(index, 1);
    },
  },
};
</script>
