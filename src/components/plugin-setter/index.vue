<template>
  <div class="plugin-setter" v-loading="initializing">
    <el-form label-position="left" label-width="180px" v-if="!initializing">
      <el-form-item label="选择插件">
        <el-select size="mini" filterable v-model="node[field]" clearable @change="pluginChangeHandler">
          <el-option v-for="item in templetes" :key="item.node_name" :label="item.node_display" :value="item.node_name"></el-option>
        </el-select>
      </el-form-item>
      <transition name="el-zoom-in-top">
        <div v-if="node[field] && data.length && !loadingTp">
          <el-form-item v-for="p in data" :key="p.field" :label="p.name">
            <template v-if="p.picker === 'picker-form' || p.picker === 'picker-wf'">
              <el-select
                v-if="p.picker === 'picker-form'"
                filterable
                clearable
                size="mini"
                @change="handleFormChange($event, p)"
                v-model="p.value"
              >
                <el-option v-for="item in forms" :key="item.node_name" :label="item.node_display" :value="item.node_name"></el-option>
              </el-select>
              <el-select
                v-if="p.picker === 'picker-wf'"
                filterable
                clearable
                size="mini"
                @change="handleWfChange($event, p)"
                v-model="p.value"
              >
                <el-option v-for="item in workflows" :key="item.node_name" :label="item.node_display" :value="item.node_name"></el-option>
              </el-select>
              <slot v-bind:data="p"></slot>
            </template>
            <el-select v-if="p.picker === 'picker-tag'" filterable clearable size="mini" v-model="p.value">
              <el-option v-for="item in tags" :key="item.dimen_tag" :label="item.tag_name" :value="item.dimen_tag"></el-option>
            </el-select>
            <el-input v-if="p.picker === 'input'" clearable v-model="p.value" size="mini" autocomplete="off"></el-input>
            <el-switch v-if="p.picker === 'picker-yes'" v-model="p.value"></el-switch>
            <el-select v-if="p.picker === 'picker-text'" filterable clearable size="mini" v-model="p.value">
              <el-option v-for="item in text" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select
              v-if="p.picker === 'picker-field' && !loadingFields && formCfg[getRelateItem(p)]"
              filterable
              clearable
              size="mini"
              :multiple="p.saveType === '2'"
              v-model="p.value"
            >
              <el-option
                v-for="item in formCfg[getRelateItem(p)].fields"
                :key="item.field_name"
                :label="item.fieldDisplay"
                :value="item.field_name"
              ></el-option>
            </el-select>
            <el-select
              v-if="p.picker === 'picker-column' && !loadingFields && !loadingWf && getRelateItem(p) && formCfg[getRelateItem(p)]"
              filterable
              clearable
              size="mini"
              v-model="p.value"
            >
              <el-option
                v-for="item in formCfg[getRelateItem(p)].column"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-select
              v-if="p.picker === 'picker-stafield'"
              filterable
              clearable
              size="mini"
              :multiple="p.saveType === '2'"
              v-model="p.value"
            >
              <el-option v-for="f in fields" :key="f.field" :label="f.name" :value="f.field"></el-option>
            </el-select>
            <el-button v-if="p.picker === 'picker-staFormula'" size="mini" type="primary" plain @click="editScript(p)">编辑脚本</el-button>
            <pso-picker-resource
              v-if="p.picker === 'picker-file'"
              source="list"
              pattern="checkbox"
              @confirm="handlefileChecked($event, p)"
            ></pso-picker-resource>
            <el-select
              v-if="p.picker === 'picker-select'"
              filterable
              clearable
              size="mini"
              :multiple="p.saveType === '2'"
              v-model="p.value"
            >
              <el-option v-for="(d, i) in p.options" :key="i" :label="d.n" :value="d.v"></el-option>
            </el-select>
            <dfilter
              v-if="p.picker === 'picker-dfilter' && !loadingFields && formCfg[getRelateItem(p)]"
              :fields="formCfg[getRelateItem(p)].fields"
              :data="p"
            ></dfilter>
            <el-button v-if="p.picker === 'picker-sql'" size="mini" type="primary" plain @click="editSql(p)"> 编辑脚本 </el-button>
            <el-button v-if="p.picker === 'picker-stats'" size="mini" type="primary" plain @click="setStats(p)"> 设置关联统计 </el-button>
            <template #label>
              {{ p.name }}
              <el-tooltip v-if="p.tip" effect="dark" placement="top-start">
                <div slot="content" v-html="p.tip"></div>
                <i class="tip el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-form-item>
        </div>
      </transition>
      <component v-if="cid" v-bind:is="getCpntEl(cid)" :node="node" :data="data"></component>
    </el-form>
    <pso-drawer size="50%" :visible="showDesigner" title="设计脚本" @close="showDesigner = false">
      <template v-slot:whole>
        <formula-designer
          v-if="curSet && curSet.picker === 'picker-staFormula'"
          :value="curSet.value"
          :cpnts="cpnts"
          @cancel="showDesigner = false"
          @confirm="handleConfirm"
        ></formula-designer>
      </template>
    </pso-drawer>
    <sql-designer :opener="showDeisgner" :sql="curSql.value"></sql-designer>
    <stats-picker :opener="statsOpener" :code="statsOpener.code" :stats="statsOpener.data"></stats-picker>
  </div>
</template>
<script>
import formulaDesigner from "../form-designer/formula-designer";
import { formOp } from "../form-designer/mixin.js";
import { genComponentData } from "../form-designer/helper";
import { assignList } from "../../utils/util";
import { PLUGIN_PARAMS } from "../../const/sys";
import SqlDesigner from "../sql-designer";
import StatsPicker from "./picker/stats-picker";
import Dfilter from "./picker/filter";

const componentsMap = {};
const requireComponent = require.context("./cpnts", true);
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = _.upperFirst(
    _.camelCase(
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );
  componentsMap[`PluginCpntPso${componentName}`] = componentConfig.default;
});

export default {
  mixins: [formOp],
  components: { formulaDesigner, SqlDesigner, StatsPicker, Dfilter, ...componentsMap },
  props: {
    data: Array,
    node: Object,
    field: String,
    filter: Array,
  },
  data() {
    return {
      initializing: true,
      loadingFields: true,
      loadingTp: false,
      loadingWf: false,
      templetes: [],
      forms: [],
      workflows: [],
      tags: [],
      text: [],
      formCfg: {},
      fields: [],
      showDesigner: false,
      curSet: null,
      cpnts: [],
      curSql: {},
      showDeisgner: { show: false },
      statsOpener: {
        show: false,
        code: "",
        data: {},
      },
      cid: "",
    };
  },
  async created() {
    this.initializing = true;

    this.templetes = await this.API.getTempleteTree(this.filter);
    this.forms = await this.API.getFormTree();
    this.workflows = await this.API.getWfTree();
    this.tags = (await this.API.getTreeDimen()).data;

    if (this.node[this.field]) {
      await this.getTpDetail(this.node[this.field]);
    }

    //初始获取表单和流程字段
    for (let d of this.data) {
      if (d.picker === "picker-wf" && d.value) {
        await this.handleWfChange(d.value);
      }
      if (d.picker === "picker-form" && d.value) {
        await this.handleFormChange(d.value);
      }
    }
    this.initializing = false;
  },
  methods: {
    async pluginChangeHandler(code) {
      this.data.splice(0, this.data.length - 1);
      await this.getTpDetail(code);
    },
    async getTpDetail(code) {
      this.loadingTp = true;

      const ret = await this.API.getTreeNode({ code });

      if (ret.success) {
        const cfg = ret.data.data;

        if (cfg.route_setting) {
          const setting = JSON.parse(cfg.route_setting);
          assignList({
            target: this.data,
            source: setting,
            tid: "field",
            sid: "field",
            base: PLUGIN_PARAMS,
            replaceField: ["name", "picker", "saveType", "tip", "options", "relateParam", "order"],
          });
        }

        const ordered = _.orderBy(this.data, ["order"], ["asc"]);
        this.data.splice(0, this.data.length, ...ordered);

        if (cfg.tp_component) {
          this.cid = cfg.tp_component;
        } else {
          this.cid = "";
        }
        if (cfg.tp_content) {
          this.fields = JSON.parse(cfg.tp_content);
          if (Array.isArray(this.fields)) {
            this.makeCpnts(this.fields);
          }
        }

        //加载文本组
        if (cfg.tp_text) {
          this.text = JSON.parse(cfg.tp_text);
        }
      } else {
        this.data.splice(0, this.data.length - 1);
      }

      this.loadingTp = false;
    },
    async handleFormChange(val, tpItem) {
      if (!this.formCfg[val]) {
        await this.getFormCfg(val);
      }
    },
    getRelateItem(tpItem) {
      return _.find(this.data, { field: tpItem.relateParam }).value;
    },
    async handleWfChange(val, tpItem) {
      this.loadingWf = true;
      const wfRet = await this.API.workflowcfg({ data: { node_id: val } });
      const data_code = wfRet.data.map_data_code;
      if (!this.formCfg[data_code]) {
        await this.getFormCfg(data_code, val);
      }
      this.loadingWf = false;
    },
    async getFormCfg(value, field) {
      this.loadingFields = true;
      try {
        const formStore = await this.makeFormStore(value);
        if (formStore) {
          const fields = await this.makeFormFields({ store: formStore, source: "3", code: value });
          const column = formStore.display_columns ? JSON.parse(formStore.display_columns).column : [];
          this.formCfg[field || value] = { fields, column };
        }
      } catch (error) {}

      this.loadingFields = false;
    },
    editScript(set) {
      this.curSet = set;
      this.showDesigner = true;
    },
    handleConfirm(val) {
      this.curSet.value = val;
      this.showDesigner = false;
    },
    makeCpnts(data) {
      const cpnts = [];
      data.forEach((item) => {
        cpnts.push(genComponentData({ componentid: "text", fid: item.field, _fieldName: item.name }));
      });
      this.cpnts = cpnts;
    },
    handlefileChecked(files, item) {
      const list = [];
      files.forEach((f) => {
        if (f.map_key) {
          list.push(f.map_key);
        }
      });
      item.value = list.join(",");
    },
    editSql(param) {
      if (!param.value) {
        this.$set(param, "value", []);
      }
      this.curSql = param;
      this.showDeisgner.show = true;
    },
    setStats(data) {
      if (data.relateParam) {
        this.statsOpener.code = this.getRelateItem(data);
        this.statsOpener.data = data.value;
        this.statsOpener.show = true;
      }
    },
    getCpntEl(id) {
      return `plugin-cpnt-${id}`;
    },
  },
};
</script>