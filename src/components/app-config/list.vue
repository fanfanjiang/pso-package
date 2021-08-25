<template>
  <div class="pso-view" v-loading="operating">
    <div class="pso-view-body">
      <div class="pso-view-fun">
        <div class="pso-view-fun-l">
          <div class="view-table-fun">
            <template v-for="(v, key) in keywords">
              <pso-search v-if="checkKeyWords(key)" :text="checkKeyWords(key).n" v-model="keywords[key]" :key="key"></pso-search>
            </template>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" icon="el-icon-refresh" @click="fetch">刷新</el-button>
          </div>
        </div>
        <div class="pso-view-fun-r">
          <div class="view-data-fun">
            <el-button size="mini" type="primary" plain @click="addHandler">新增</el-button>
            <el-button size="mini" type="primary" plain @click="editHandler" :disabled="selected.length !== 1">编辑</el-button>
            <el-popconfirm title="你确定要删除吗？" @confirm="delHandler">
              <el-button size="mini" type="danger" slot="reference" :disabled="selected.length !== 1">删除</el-button>
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
              <el-table-column :prop="item.k" :label="item.n" :key="item.k" v-for="item in config.column"></el-table-column>
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
            :page-sizes="[limit, 200, 500]"
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
    <el-dialog title="设置" append-to-body :visible.sync="showEditor" width="500px">
      <el-form label-width="120px" label-position="left" v-if="showEditor">
        <cfg-editor :id="cfgId" :data="formData"></cfg-editor>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showEditor = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveHandler()" :disabled="operating">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CfgEditor from "./edit";
import { CONFIG_TYPE } from "../../const/app";
import debounce from "throttle-debounce/debounce";
const KEYS = {
  map_key0: "",
  map_key1: "",
  map_key2: "",
  map_key3: "",
  map_key4: "",
  map_key5: "",
  map_key6: "",
  map_key7: "",
  map_key8: "",
  map_key9: "",
  map_key10: "",
  map_key11: "",
  map_key12: "",
  map_key13: "",
  map_key14: "",
  map_key15: "",
};
export default {
  components: { CfgEditor },
  props: {
    cfgId: {
      type: Number,
      default: "",
    },
  },
  data() {
    return {
      initializing: false,
      operating: false,
      showEditor: false,
      loading: false,
      dataTotal: 0,
      limit: 100,
      page: 1,
      keys: {},
      instances: [],
      selected: [],
      optype: "",
      keywords: {
        ...KEYS,
      },
      formData: {
        config_type: this.cfgId,
        ...KEYS,
      },
    };
  },
  computed: {
    config() {
      return _.find(CONFIG_TYPE, { id: this.cfgId });
    },
    defWhere() {
      return {
        limit: this.limit,
        page: this.page - 1,
      };
    },
  },
  watch: {
    defWhere: {
      deep: true,
      handler() {
        this.fetch();
      },
    },
    cfgId() {
      this.fetch();
    },
    keywords: {
      deep: true,
      handler() {
        this.deFetch();
      },
    },
  },
  created() {
    this.deFetch = debounce(500, this.fetch);
    this.initialize();
    this.fetch();
  },
  methods: {
    initialize() {
      this.formData = {
        config_type: this.cfgId,
        ...KEYS,
      };
    },
    async fetch() {
      this.loading = true;
      const params = { ...this.defWhere, keys: {} };
      params.keys.config_type = { value: this.cfgId, type: 1 };

      for (let key in this.keywords) {
        if (this.keywords[key]) {
          params.keys[key] = { value: this.keywords[key], type: 2 };
        }
      }
      params.keys = JSON.stringify(params.keys);
      const ret = await this.API.getSysConfig(params);
      this.instances = ret.data;
      this.dataTotal = ret.count;
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
    addHandler() {
      this.initialize();
      this.optype = 0;
      this.showEditor = true;
    },
    editHandler() {
      this.optype = 1;
      this.formData = Object.assign(this.formData, this.selected[0]);
      this.showEditor = true;
    },
    async delHandler() {
      this.optype = 2;
      this.formData = Object.assign(this.formData, this.selected[0]);
      this.saveHandler();
    },
    async saveHandler() {
      if (this.operating) return;
      this.operating = true;
      const ret = await this.API.updateSysConfig({ optype: this.optype, ...this.formData });
      this.initialize();
      this.ResultNotify(ret);
      this.fetch();
      this.showEditor = false;
      this.operating = false;
    },
    checkKeyWords(k) {
      return _.find(this.config.column, { k });
    },
  },
};
</script>
