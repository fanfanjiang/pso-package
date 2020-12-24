<template>
  <div class="pso-view" v-loading="initializing">
    <div class="pso-view-body">
      <div class="pso-view-fun" style="margin-bottom: 10px">
        <div class="pso-view-fun-l">
          <div class="view-table-fun"></div>
        </div>
        <div class="pso-view-fun-r">
          <div class="view-data-fun">
            <el-button size="mini" type="primary" @click="addHandler">新增</el-button>
            <el-popconfirm title="你确定要删除吗？" @confirm="delHandler">
              <el-button size="mini" type="danger" slot="reference" :disabled="!selected.length">删除</el-button>
            </el-popconfirm>
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
            @selection-change="selectHandler"
            @row-dblclick="rowdbClickHandler"
          >
            <template #default>
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column type="index" label="序号" :index="1" width="50"></el-table-column>
              <el-table-column :prop="f.field" :label="f.name" v-for="(f, i) in FIELDS" :key="i">
                <template slot-scope="scope">
                  <span v-if="f.field === 'site_cate'">{{ getParentName(scope.row[f.field]) }}</span>
                  <span v-else-if="f.field === 'sec_cate'">{{ getSubName(scope.row[f.field]) }}</span>
                  <span v-else>{{ scope.row[f.field] }}</span>
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
            :page-sizes="[15, 30, 50, 100, 200, 500]"
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
    <el-dialog title="应用编辑" append-to-body :visible.sync="showEditor" width="35%">
      <el-form label-width="80px" v-if="showEditor">
        <el-form-item label="应用分类">
          <el-select size="mini" clearable v-model="data.site_cate">
            <el-option v-for="(f, i) in pTypes" :key="i" :label="f.map_key0" :value="f.auto_no"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select size="mini" clearable v-model="data.sec_cate">
            <el-option v-for="(f, i) in types" :key="i" :label="f.map_key0" :value="f.auto_no"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否默认">
          <el-checkbox v-model="data.is_default" true-label="1" false-label="0"></el-checkbox>
        </el-form-item>
        <div v-for="(f, i) in FIELDS" :key="i">
          <el-form-item v-if="f.type === 'input'" :label="f.name">
            <el-input size="mini" v-model="data[f.field]" autocomplete="off"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmSave()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
const FIELDS = [
  { name: "应用分类", field: "site_cate" },
  { name: "二级分类", field: "sec_cate" },
  { name: "站点类型", field: "site_type", type: "input" },
  { name: "站点名称", field: "site_name", type: "input" },
  { name: "站点APP", field: "site_app", type: "input" },
  { name: "站点链接", field: "site_link", type: "input" },
  { name: "站点备注", field: "site_note", type: "input" },
  { name: "默认登录", field: "is_default" },
];

export default {
  mixins: [PagingMixin],
  props: {},
  data() {
    this.FIELDS = FIELDS;
    return {
      initializing: false,
      operating: false,
      showEditor: false,
      dataTotal: 0,
      instances: [],
      selected: [],
      optype: "",
      data: {},
      pTypes: [],
      types: [],
    };
  },
  async created() {
    this.initializing = true;
    FIELDS.forEach(({ field, name }) => {
      this.$set(this.data, field, "");
    });
    this.startWatch();
    this.$on("load", () => {
      this.fetch();
    });
    this.pTypes = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 4, type: 1 } }) })).data;
    this.types = (await this.API.getSysConfig({ keys: JSON.stringify({ config_type: { value: 5, type: 1 } }) })).data;
    this.fetch();
    this.initializing = false;
  },
  methods: {
    getParentName(auto_no) {
      return _.find(this.pTypes, { auto_no }).map_key0;
    },
    getSubName(auto_no) {
      return _.find(this.types, { auto_no }).map_key0;
    },
    async fetch() {
      this.loading = true;
      const ret = await this.API.getSites({ ...this.getFetchParams() });
      this.instances = ret.data.data;
      this.dataTotal = ret.page;
      this.loading = false;
    },
    selectHandler(selected) {
      this.selected = selected;
    },
    rowdbClickHandler(row) {
      this.editHandler(row);
    },
    editHandler(data) {
      this.data = Object.assign(this.data, data);
      this.optype = "1";
      this.showEditor = true;
    },
    reset() {
      this.data.site_id = "";
    },
    delHandler(data) {
      this.saveHandler({ site_id: this.selected.map((d) => d.site_id).join(","), optype: "2" });
    },
    addHandler() {
      this.reset();
      this.optype = "0";
      this.showEditor = true;
    },
    async confirmSave() {
      await this.saveHandler({ ...this.data, optype: this.optype });
      this.reset();
    },
    async saveHandler(data) {
      this.operating = true;
      this.showEditor = false;
      const ret = await this.API.updateSite(data);
      this.ResultNotify(ret);
      await this.fetch();
      this.operating = false;
    },
  },
};
</script>
