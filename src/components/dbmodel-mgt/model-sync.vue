<template>
  <div v-loading="srcMaping || tgeMaping">
    <el-form label-position="left" label-width="110px" size="small">
      <el-form-item label="源APP" required>
        <el-select filterable clearable size="small" v-model="data.target_site">
          <el-option v-for="(s, i) in excludeSelfSite" :key="i" :label="s.site_name" :value="s.site_app"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div v-if="data.target_site">
      <div style="margin-bottom: 10px; text-align: right">
        <el-button type="primary" size="mini" plain @click="addHandler">新增配置项</el-button>
        <el-button type="danger" size="mini" plain @click="delHandler" :disabled="!selected.length">删除</el-button>
      </div>
      <el-table
        size="mini"
        border
        :data="data.data_config"
        style="width: 100%"
        @row-click="rowClickHandler"
        @selection-change="changeHandler"
      >
        <template #default>
          <el-table-column type="selection" width="40" header-align="center" align="center"></el-table-column>
          <el-table-column label="序号" type="index" align="center" :index="1" width="50"></el-table-column>
          <el-table-column label="目标表" align="center" width="180">
            <template slot-scope="scope">
              <el-select size="mini" filterable clearable v-model="scope.row.src" @change="checkSrcSelect(scope.$index)">
                <el-option v-for="(t, i) in sourceForms" :key="i" :label="t.node_display" :value="t.node_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="源表" align="center" width="180">
            <template slot-scope="scope">
              <el-select size="mini" filterable clearable v-model="scope.row.tge" @change="checkTgeSelect(scope.$index)">
                <el-option v-for="(t, i) in targetForms" :key="i" :label="t.node_display" :value="t.node_name"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="流程" align="center" width="80">
            <template slot-scope="scope">
              <el-switch size="mini" v-model="scope.row.iswf" active-value="1" inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="同步数据" align="center" width="80">
            <template slot-scope="scope">
              <el-switch size="mini" v-model="scope.row.syncdata" active-value="1" inactive-value="0"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="增量条件" align="center">
            <template slot-scope="scope">
              {{ JSON.stringify(scope.row.keys) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                :disabled="!scope.row.src || !scope.row.tge || !scope.row.syncdata"
                size="mini"
                type="success"
                @click="makeCondition(scope.$index)"
                >增量
              </el-button>
              <el-button :disabled="!scope.row.src || !scope.row.tge" size="mini" type="success" @click="makeMap(scope.$index)"
                >映射
              </el-button>
            </template>
          </el-table-column>
        </template>
        <template #empty>
          <pso-empty></pso-empty>
        </template>
      </el-table>
    </div>
    <div v-if="srcMaping">
      <picker-form v-show="false" form-field="code" source="3" :data="srcformProxy" @loaded="srcformLoaded"></picker-form>
    </div>
    <div v-if="tgeMaping">
      <picker-form
        v-show="false"
        form-field="code"
        :requiredappid="data.target_site"
        source="3"
        :data="tgeformProxy"
        @loaded="tgeformLoaded"
      ></picker-form>
    </div>
    <pso-dialog :visible="showEditor" width="50%" @close="showEditor = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>映射配置</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="dbmodel-sync" style="height: 100%; padding: 15px; overflow: auto" v-loading="srcMaping || tgeMaping">
        <el-table v-if="curMap" size="mini" border :data="curMap.map" style="width: 100%">
          <template #default>
            <el-table-column label="序号" type="index" :index="1" width="50"></el-table-column>
            <el-table-column label="源字段">
              <template slot-scope="scope">
                {{ getSrcFields(scope.row.sf) }}
              </template>
            </el-table-column>
            <el-table-column label="目标字段">
              <template slot-scope="scope">
                <el-select size="mini" filterable clearable v-model="scope.row.tf">
                  <el-option v-for="(t, i) in curMap.tgeFields" :key="i" :label="t.fieldDisplay" :value="t._fieldValue"></el-option>
                </el-select>
              </template>
            </el-table-column>
          </template>
          <template #empty>
            <pso-empty></pso-empty>
          </template>
        </el-table>
      </div>
    </pso-dialog>
    <pso-dialog :visible="showRule" width="50%" @close="showRule = false">
      <template #title>
        <pso-dialog-header>
          <template #title>
            <i class="el-icon-edit-outline"></i>
            <span>增量条件</span>
          </template>
        </pso-dialog-header>
      </template>
      <div class="pso-dialog-content" v-if="curMap">
        <dynamic-filter :targets="curMap.tgeFields" :sources="curMap.tgeFields" v-model="curMap.condition"></dynamic-filter>
      </div>
    </pso-dialog>
  </div>
</template>
<script>
import { assignList } from "../../utils/util";
import PickerForm from "../picker/pso-picker-form";
import DynamicFilter from "../dynamic-filter";

const TARGET_TYPE = [
  { n: "等级", v: "0" },
  { n: "站点", v: "1" },
];

const MODEL_TYPE = [
  { n: "单表", v: "0" },
  { n: "关联", v: "1" },
];

const MAP_PARAMS = {
  sf: "",
  tf: "",
  is_sys: "",
};

const FIELD_PARAMS = {
  src: "",
  tge: "",
  iswf: "0",
  syncdata: "0",
  condition: [],
  keys: {},
  map: [],
};

export default {
  components: { PickerForm, DynamicFilter },
  props: {
    sites: Array,
    data: Object,
  },
  data() {
    this.TARGET_TYPE = TARGET_TYPE;
    this.MODEL_TYPE = MODEL_TYPE;
    return {
      initializing: false,
      sourceForms: [],
      targetForms: [],
      selected: [],
      showEditor: false,
      srcMaping: false,
      tgeMaping: false,
      curMap: null,
      srcformProxy: { code: "" },
      tgeformProxy: { code: "" },
      showRule: false,
    };
  },
  computed: {
    excludeSelfSite() {
      return this.sites.filter((d) => d.site_app !== this.$store.state.base.user.appid);
    },
  },
  watch: {
    "data.target_site": {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchForms();
        }
      },
    },
    "curMap.condition": {
      deep: true,
      handler() {
        this.makeKeys();
      },
    },
  },
  async created() {
    if (this.data.data_config && typeof this.data.data_config === "string") {
      this.data.data_config = JSON.parse(this.data.data_config);
    }
    if (!this.data.data_config) {
      this.data.data_config = [];
    }
    this.sourceForms = await this.API.getFormTree();
  },
  methods: {
    rowClickHandler() {},
    changeHandler(data) {
      this.selected = data;
    },
    getSourceFormName() {},
    async fetchForms() {
      this.targetForms = await this.API.getFormTree({ requiredappid: this.data.target_site });
    },
    addHandler() {
      this.data.data_config.push(_.cloneDeep(FIELD_PARAMS));
    },
    delHandler() {
      this.selected.forEach(({ src }) => {
        this.data.data_config.splice(_.findIndex(this.data.data_config, { src }), 1);
      });
    },
    makeMap(index) {
      this.curMap = this.data.data_config[index];
      this.showEditor = true;
    },
    srcformLoaded({ fields }) {
      this.curMap.srcFields = fields;
      assignList({
        target: this.curMap.map,
        source: fields,
        tid: "sf",
        sid: "_fieldValue",
        base: MAP_PARAMS,
        assemble(src) {
          return { sf: src._fieldValue, is_sys: src.is_sys };
        },
      });
      this.srcMaping = false;
      this.checkFields();
    },
    tgeformLoaded({ fields }) {
      this.curMap.tgeFields = fields;
      this.tgeMaping = false;
      this.checkFields();
    },
    getSrcFields(_fieldValue) {
      return _.find(this.curMap.srcFields, { _fieldValue }).fieldDisplay;
    },
    checkFields() {
      if (!this.srcMaping && !this.tgeMaping) {
        for (let m of this.curMap.map) {
          if (m.tf) {
            const exist = _.find(this.curMap.tgeFields, { _fieldValue: m.tf });
            if (!exist) m.tf = "";
          } else {
            const exist = _.find(this.curMap.tgeFields, { _fieldValue: m.sf });
            if (exist) m.tf = m.sf;
          }
        }
      }
    },
    checkSrcSelect(index) {
      const data = this.data.data_config[index];
      if (data.src) {
        this.curMap = data;
        if (!data.tge) {
          const exist = _.find(this.targetForms, { node_name: data.src });
          if (exist) {
            data.tge = exist.node_name;
            this.changeTge(data);
          }
        }
        this.srcformProxy.code = data.src;
        this.srcMaping = true;
      } else {
        this.curMap.srcFields = [];
      }
    },
    checkTgeSelect(index) {
      const data = this.data.data_config[index];
      if (data.tge) {
        this.curMap = data;
        this.changeTge(data);
      } else {
        this.curMap.tgeFields = [];
      }
    },
    changeTge(data) {
      this.tgeformProxy.code = data.tge;
      this.tgeMaping = true;
    },
    makeCondition(index) {
      this.curMap = this.data.data_config[index];
      this.showRule = true;
    },
    makeKeys() {
      this.curMap.keys = {};
      this.curMap.condition.forEach(({ value, op, tid }) => {
        if (value !== "" && typeof value !== "undefined") {
          this.curMap.keys[tid] = { value, type: op };
        }
      });
    },
  },
};
</script>
<style lang="less">
.dbmodel-sync {
  .el-select {
    width: 100%;
  }
}
</style>