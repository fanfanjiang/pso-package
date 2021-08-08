<template>
  <div class="pso-view" v-loading="initializing">
    <div class="pso-view-body">
      <div class="pso-view-header" v-if="header">
        <div class="pso-view-header__l">
          <div class="pso-view-title">
            <i class="el-icon-cpu"></i>
            <span>站点配置</span>
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
                  <span v-else-if="f.field === 'site_level'">{{ getLevelName(scope.row.site_level) }}</span>
                  <span v-else>{{ scope.row[f.field] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" @click="publish(scope.$index)">发布</el-button>
                  <el-button size="mini" type="success" @click="makeRelation(scope.$index)">站点关系</el-button>
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
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>应用编辑</span>
          </template>
          <template #action>
            <el-button type="primary" size="mini" @click="confirmSave()">确 定</el-button>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content">
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
          <el-form-item label="站点类型">
            <el-select size="mini" clearable v-model="data.site_type">
              <el-option v-for="(f, i) in SITE_TYPES" :key="i" :label="f.n" :value="f.v"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="站点等级">
            <el-select size="mini" clearable v-model="data.site_level">
              <el-option v-for="(f, i) in sitelevle" :key="i" :label="f.level_name" :value="f.auto_no"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否默认">
            <el-checkbox v-model="data.is_default" true-label="1" false-label="0"></el-checkbox>
          </el-form-item>
          <el-form-item label="过期时间" required>
            <el-date-picker v-model="data.site_expire" size="mini" type="datetime" :value-format="format" :format="format">
            </el-date-picker>
          </el-form-item>
          <div v-for="(f, i) in FIELDS" :key="i">
            <el-form-item v-if="f.type === 'input'" :label="f.name">
              <el-input size="mini" v-model="data[f.field]" autocomplete="off"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showRelation" width="40%" @close="showRelation = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>选择子应用</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content" v-loading="relationing">
        <el-checkbox-group v-if="showRelation" v-model="checkedRelation">
          <template v-for="(d, i) in instances">
            <el-checkbox v-if="d.site_id !== curInst.site_id" :label="d.site_id" :key="i">{{ d.site_name }}</el-checkbox>
          </template>
        </el-checkbox-group>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { PagingMixin } from "../../mixin/view";
const FIELDS = [
  { name: "站点名称", field: "site_name", type: "input" },
  { name: "应用分类", field: "site_cate" },
  { name: "二级分类", field: "sec_cate" },
  { name: "站点类型", field: "site_type" },
  { name: "站点等级", field: "site_level" },
  { name: "站点APP", field: "site_app", type: "input" },
  { name: "站点链接", field: "site_link", type: "input" },
  { name: "站点备注", field: "site_note", type: "input" },
  { name: "默认登录", field: "is_default" },
  { name: "过期时间", field: "site_expire" },
];

const SITE_TYPES = [
  { n: "中心库", v: "0" },
  { n: "非中心库", v: "1" },
];

export default {
  mixins: [PagingMixin],
  props: {
    header: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    this.FIELDS = FIELDS;
    this.SITE_TYPES = SITE_TYPES;
    this.format = "yyyy-MM-dd HH:mm:ss";
    return {
      initializing: false,
      operating: false,
      showEditor: false,
      showRelation: false,
      dataTotal: 0,
      instances: [],
      selected: [],
      optype: "",
      data: {},
      pTypes: [],
      types: [],
      sitelevle: [],
      checkedRelation: [],
      curInst: {},
      relationing: false,
      relations: [],
      watchFun: [],
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

    this.sitelevle = (await this.API.siteLevel({ limit: 999 }, "get")).data;
    this.fetch();
    this.initializing = false;
  },
  methods: {
    getParentName(auto_no) {
      const exist = _.find(this.pTypes, { auto_no });
      return exist ? exist.map_key0 : "";
    },
    getSubName(auto_no) {
      const exist = _.find(this.types, { auto_no });
      return exist ? exist.map_key0 : "";
    },
    async fetch() {
      this.loading = true;
      const ret = await this.API.getSites({ ...this.getFetchParams("site_name") });
      if (ret.data.data) {
        this.instances = ret.data.data;
        this.dataTotal = ret.data.data.length;
      }
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
    delHandler() {
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
    getLevelName(auto_no) {
      const level = _.find(this.sitelevle, { auto_no });
      return level ? level.level_name : "未设置";
    },
    async publish(index) {
      const { site_id } = this.instances[index];
      const ret = await this.API.request("/api/sys/site/publish", { data: { site_id }, method: "post" });
      this.ResultNotify(ret);
    },
    async makeRelation(index) {
      this.curInst = this.instances[index];
      await this.getRelation(this.curInst);
      this.showRelation = true;
    },
    async getRelation(data) {
      if (this.watchFun.length) {
        this.watchFun.forEach((f) => f());
        this.watchFun = [];
      }
      this.relations = (await this.API.sitebranch({}, "get")).data.filter((d) => d.site_id === data.site_id);
      this.checkedRelation = this.relations.map((d) => d.map_id);
      this.watchFun.push(
        this.$watch("checkedRelation", {
          handler: (newVal, oldVal) => {
            this.relationHandler(newVal, oldVal);
          },
        })
      );
    },
    async relationHandler(newVal, oldVal) {
      const { site_id } = this.curInst;
      let ret;
      this.relationing = true;
      for (let map_id of newVal) {
        if (oldVal.indexOf(map_id) === -1) {
          ret = await this.API.sitebranch({ optype: 0, site_id, map_id }, "put");
        }
      }
      for (let ov of oldVal) {
        if (newVal.indexOf(ov) === -1) {
          const ovd = _.find(this.relations, { map_id: ov });
          if (ovd) {
            ret = await this.API.sitebranch({ auto_no: ovd.auto_no }, "delete");
          }
        }
      }
      if (ret) {
        this.ResultNotify(ret);
      }
      await this.getRelation(this.curInst);
      this.relationing = false;
    },
  },
};
</script>
