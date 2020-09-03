<template>
  <div>
    <div>
      <el-form-item label="选择插件">
        <el-select size="mini" filterable v-model="node[field]" clearable @change="getTpDetail">
          <el-option
            v-for="item in templetes"
            :key="item.node_name"
            :label="item.node_display"
            :value="item.node_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <transition name="el-zoom-in-top">
        <div v-if="node[field]&&data.length&&!loadingTp">
          <pso-title>插件参数</pso-title>
          <el-form-item v-for="tpItem in data" :key="tpItem.field" :label="tpItem.name">
            <template v-if="tpItem.picker==='picker-form'||tpItem.picker==='picker-wf'">
              <el-select
                v-if="tpItem.picker==='picker-form'"
                filterable
                clearable
                size="mini"
                @change="handleFormChange($event,tpItem)"
                v-model="tpItem.value"
              >
                <el-option
                  v-for="item in forms"
                  :key="item.node_name"
                  :label="item.node_display"
                  :value="item.node_name"
                ></el-option>
              </el-select>
              <el-select
                v-if="tpItem.picker==='picker-wf'"
                filterable
                clearable
                size="mini"
                @change="handleWfChange($event,tpItem)"
                v-model="tpItem.value"
              >
                <el-option
                  v-for="item in workflows"
                  :key="item.node_name"
                  :label="item.node_display"
                  :value="item.node_name"
                ></el-option>
              </el-select>
              <slot v-bind:data="tpItem"></slot>
            </template>
            <el-select
              v-if="tpItem.picker==='picker-tag'"
              filterable
              clearable
              size="mini"
              v-model="tpItem.value"
            >
              <el-option
                v-for="item in tags"
                :key="item.dimen_tag"
                :label="item.tag_name"
                :value="item.dimen_tag"
              ></el-option>
            </el-select>
            <el-input
              v-if="tpItem.picker==='input'"
              v-model="tpItem.value"
              size="mini"
              autocomplete="off"
            ></el-input>
            <el-switch v-if="tpItem.picker==='picker-yes'" v-model="tpItem.value"></el-switch>
            <el-select
              v-if="tpItem.picker==='picker-text'"
              filterable
              clearable
              size="mini"
              v-model="tpItem.value"
            >
              <el-option v-for="item in text" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select
              v-if="tpItem.picker==='picker-field'&&!loadingFields&&getRelateItem(tpItem)"
              filterable
              clearable
              size="mini"
              :multiple="tpItem.saveType==='2'"
              v-model="tpItem.value"
            >
              <el-option
                v-for="item in formCfg[getRelateItem(tpItem)].fields"
                :key="item.field_name"
                :label="item.field_display"
                :value="item.field_name"
              ></el-option>
            </el-select>
            <el-select
              v-if="tpItem.picker==='picker-column'&&!loadingFields&&getRelateItem(tpItem)"
              filterable
              clearable
              size="mini"
              v-model="tpItem.value"
            >
              <el-option
                v-for="item in formCfg[getRelateItem(tpItem)].column"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <el-select
              v-if="tpItem.picker==='picker-stafield'"
              filterable
              clearable
              size="mini"
              :multiple="tpItem.saveType==='2'"
              v-model="tpItem.value"
            >
              <el-option v-for="f in fields" :key="f.field" :label="f.name" :value="f.field"></el-option>
            </el-select>
            <el-button
              v-if="tpItem.picker==='picker-staFormula'"
              size="mini"
              type="primary"
              plain
              @click="editScript(tpItem)"
            >编辑脚本</el-button>
          </el-form-item>
        </div>
      </transition>
    </div>
    <pso-drawer size="50%" :visible="showDesigner" title="设计脚本" @close="showDesigner=false">
      <template v-slot:whole>
        <formula-designer
          v-if="curSet&&curSet.picker==='picker-staFormula'"
          :value="curSet.value"
          :cpnts="cpnts"
          @cancel="showDesigner=false"
          @confirm="handleConfirm"
        ></formula-designer>
      </template>
    </pso-drawer>
  </div>
</template>
<script>
import formulaDesigner from "../form-designer/formula-designer";
import { formOp } from "../form-designer/mixin.js";
import { genComponentData } from "../form-designer/helper";
export default {
  mixins: [formOp],
  components: { formulaDesigner },
  props: ["data", "node", "field"],
  data() {
    return {
      initializing: true,
      templetes: [],
      forms: [],
      workflows: [],
      tags: [],
      text: [],
      formCfg: {},
      loadingFields: true,
      loadingTp: true,
      fields: [],
      showDesigner: false,
      curSet: null,
      cpnts: [],
    };
  },
  async created() {
    //加载流程列表
    this.initializing = true;
    this.templetes = await this.API.getTempleteTree();
    this.forms = await this.API.getFormTree();
    //加载表单列表
    this.workflows = await this.API.getWfTree();
    const tagRet = await this.API.getTreeDimen();
    this.tags = tagRet.data;
    this.getTpDetail(this.node[this.field], this.data);

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
    async getTpDetail(code, originData) {
      this.loadingTp = true;
      if (code) {
        const ret = await this.API.getTreeNode({ code });
        if (ret.success) {
          const cfg = ret.data.data;
          const setting = JSON.parse(cfg.route_setting);

          if (originData) {
            const data = [];
            setting.forEach((item) => {
              const exist = _.find(originData, { field: item.field }) || {};
              data.push({ ...item, ...exist });
            });
            this.data = data;
          } else {
            this.data = setting;
          }

          if (cfg.tp_content) {
            this.fields = JSON.parse(cfg.tp_content);
            this.makeCpnts(this.fields);
          }

          //加载文本组
          if (cfg.tp_text) {
            this.text = JSON.parse(cfg.tp_text);
          }
        } else {
          this.data = [];
        }
      } else {
        this.data = [];
      }
      this.$emit("change", this.data);
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
      const wfRet = await this.API.workflowcfg({ data: { node_id: val } });
      const data_code = wfRet.data.map_data_code;
      if (!this.formCfg[data_code]) {
        await this.getFormCfg(data_code, val);
      }
    },
    async getFormCfg(value, field) {
      this.loadingFields = true;
      const formStore = await this.makeFormStore(value);
      const ret = await this.API.getFormDict({ data_code: value });
      if (ret.data) {
        ret.data.forEach((item) => {
          const field = formStore.search({ options: { fid: item.field_name }, onlyData: true });
          item.field_display = (field ? field._fieldName : "系统字段") + `(${item.field_name})`;
        });
        const column = formStore.display_columns ? JSON.parse(formStore.display_columns).column : [];
        this.formCfg[field || value] = { fields: ret.data, column };
      }

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
  },
};
</script>