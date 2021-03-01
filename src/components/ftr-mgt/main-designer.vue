<template>
  <div style="padding-bottom: 20px">
    <div style="text-align: right; padding-bottom: 20px">
      <el-button size="small" type="primary" @click="$emit('save', data)" :disabled="store.saving" :loading="store.saving">保存</el-button>
      <template v-if="data.solr_id">
        <el-button size="small" @click="$emit('save-pub', data)" :disabled="store.pubing" :loading="store.pubing"> 保存并发布 </el-button>
        <el-button size="small" @click="makeIndexes" :disabled="store.indexing" :loading="store.indexing"> 生成索引 </el-button>
      </template>
    </div>
    <el-form label-position="left" label-width="90px" size="small">
      <el-form-item label="配置名称">
        <el-input v-model="data.solr_name" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="配置核心">
        <el-input v-model="data.solr_core" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="data.solr_link" size="mini" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="默认查询">
        <el-select size="mini" placeholder="" v-model="data.solr_df" clearable filterable>
          <el-option v-for="(d, i) in data.solr_field" :key="i" :label="d.name" :value="d.field"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="脚本">
        <el-button size="mini" type="success" @click="openSql">设计脚本</el-button>
      </el-form-item>
    </el-form>
    <great-panel :padding="0" color="#f7f7f7">
      <template #header>
        <i class="el-icon-s-operation"></i>
        <span>字段配置</span>
      </template>
      <div style="text-align: right">
        <el-button type="success" size="mini" @click="syncHandler">同步字段</el-button>
        <el-button type="primary" size="mini" @click="addHandler">新增字段</el-button>
        <el-button type="danger" size="mini" :disabled="!selected.length" @click="delHandler">删除字段</el-button>
      </div>
      <el-table
        border
        size="mini"
        height="300"
        style="width: 100%; margin-top: 5px"
        :data="data.solr_field"
        @selection-change="changeHandler"
      >
        <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
        <el-table-column type="index" label="序号" :index="1" width="50" header-align="center" align="center"></el-table-column>
        <el-table-column prop="field" label="字段" width="110">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.field"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="fieldtype" label="字段类型" width="120" align="center">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.fieldtype">
              <el-option v-for="(t, i) in TYPE" :key="i" :label="t.n" :value="t.v"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.type">
              <el-option v-for="(t, i) in FTYPE" :key="i" :label="t.n" :value="t.v"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="titled" label="显示" width="120" align="center">
          <template slot-scope="scope">
            <el-switch size="mini" v-model="scope.row.show"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="titled" label="是否标题" width="120" align="center">
          <template slot-scope="scope">
            <el-switch size="mini" v-model="scope.row.titled" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="indexed" label="索引" width="70" align="center">
          <template slot-scope="scope">
            <el-switch size="mini" v-model="scope.row.indexed" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="stored" label="存储" width="70" align="center">
          <template slot-scope="scope">
            <el-switch size="mini" v-model="scope.row.stored" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="mv" label="多值" width="70" align="center">
          <template slot-scope="scope">
            <el-switch size="mini" v-model="scope.row.mv" active-value="1" inactive-value="0"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="source" label="源字段" width="240" align="center">
          <template slot-scope="scope">
            <el-select
              size="mini"
              placeholder=""
              v-model="scope.row.source"
              clearable
              multiple
              filterable
              collapse-tags
              @change="srcChangge(scope.row)"
            >
              <el-option v-for="(d, i) in data.solr_field" :key="i" :label="d.name" :value="d.field"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </great-panel>
    <sql-designer :opener="showDeisgner" :sql="proxy" @gencolumn="gencolumn"></sql-designer>
  </div>
</template> 
<script>
import SqlDesigner from "../sql-designer";
import GreatPanel from "../great-panel";
import { formatJSONList } from "../../utils/util";
const BASE = {
  solr_id: "",
  solr_name: "",
  solr_core: "",
  solr_link: "",
  solr_script: "",
  solr_df: "",
  solr_field: [],
};

const TYPE = [
  { n: "常规", v: "common" },
  { n: "复制", v: "copy" },
  { n: "动态", v: "dmic" },
];

const FTYPE = [
  { n: "string", v: "string" },
  { n: "text_ik", v: "text_ik" },
  { n: "pdates", v: "pdates" },
  { n: "pdoubles", v: "pdoubles" },
];

const FIELD = {
  name: "",
  field: "",
  fieldtype: "common",
  type: "string",
  indexed: "1",
  stored: "1",
  mv: "0",
  source: [],
  titled: "0",
  show: true,
};

export default {
  components: { SqlDesigner, GreatPanel },
  props: {
    store: Object,
  },
  data() {
    this.TYPE = TYPE;
    this.FTYPE = FTYPE;
    return {
      syncing: false,
      showDeisgner: { show: false },
      proxy: [],
      data: _.cloneDeep(BASE),
      selected: [],
    };
  },
  watch: {
    "showDeisgner.show": {
      handler(value) {
        if (!value) {
          this.data.solr_script = JSON.stringify(this.proxy);
        }
      },
    },
  },
  methods: {
    extandData(extend) {
      if (!extend) {
        extend = _.cloneDeep(BASE);
      }
      this.proxy = [];
      this.data = extend;
      if (this.data.solr_script) {
        this.proxy = JSON.parse(this.data.solr_script);
      }
      if (!this.data.solr_field || this.data.solr_field === "null") {
        this.data.solr_field = [];
      } else if (typeof this.data.solr_field === "string") {
        this.data.solr_field = JSON.parse(this.data.solr_field);
      }
      formatJSONList(this.data.solr_field, FIELD);
    },
    addHandler() {
      this.data.solr_field.push(_.cloneDeep(FIELD));
    },
    changeHandler(data) {
      this.selected = data;
    },
    delHandler() {
      this.selected.forEach((t) => {
        this.data.solr_field.splice(_.findIndex(this.data.solr_field, t), 1);
      });
    },
    openSql() {
      this.syncing = false;
      this.showDeisgner.show = true;
    },
    syncHandler() {
      this.syncing = true;
      this.showDeisgner.show = true;
    },
    gencolumn(column) {
      if (!this.syncing) return;
      this.showDeisgner.show = false;
      this.syncing = false;
      this.data.child_content = JSON.stringify(column.map(({ display, field }) => ({ display, field })));
      // this.data.solr_field = [];

      column.forEach(({ display: name, field }) => {
        const exist = _.find(this.data.solr_field, { field });
        if (!exist) {
          this.data.solr_field.push({ ..._.cloneDeep(FIELD), name, field });
        }
      });
    },
    srcChangge(data) {
      data.mv = data.source.length ? "1" : "0";
    },
    async makeIndexes() {
      this.store.makeIndexes({ solr_id: this.data.solr_id });
    },
  },
};
</script>