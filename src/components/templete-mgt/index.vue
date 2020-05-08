<template>
  <div class="pso-lay-btt">
    <div class="pso-lay-btt__header">
      <pso-typebar skey="getTpUnitBar" v-model="typeVal"></pso-typebar>
    </div>
    <div class="pso-lay-btt__body" v-if="treeOptions.tp_type!==''">
      <div class="pso-lay-tt__bl" v-bar>
        <div>
          <pso-tree-common
            ref="tree"
            :request-options="treeOptions"
            :default-node-data="defalutNodeData"
            :check-after-load="false"
            @after-node-new="nodeNewdHandler"
            @before-edit-submit="nodeBeforeEditHandler"
            @node-click="nodeClickHandler"
            @before-node-edit="nodeEditHandler"
          ></pso-tree-common>
        </div>
      </div>
      <div class="pso-lay-tt__br" v-bar>
        <div class="pso-lay-tt__br-content" v-if="loadingCenter">
          <pso-skeleton :lines="10"></pso-skeleton>
        </div>
        <div v-else class="pso-lay-tt__br-content">
          <script-designer v-if="isScriptType()&&centerData.jsCode" :code="centerData"></script-designer>
          <pso-form-table v-if="isFormType()&&centerData.formId" :cfgId="centerData.formId[0]"></pso-form-table>
          <form-interpreter
            v-if="isTempleteType()&&centerData.data_config"
            :form-entity="centerData"
            :editable="false"
          ></form-interpreter>
        </div>
      </div>
    </div>
    <pso-Formtable-setting
      :appid="params.appid"
      :data="formTableCfgData"
      :show="showFormPage"
      :params="tableSettingOptions"
      @close="showFormPage=false"
    ></pso-Formtable-setting>
  </div>
</template>
<script>
import PsoTypebar from "../type-bar";
import PsoFormtableSetting from "../form-table/setting";
import PsoFormTable from "../form-table";
import FormInterpreter from "../form-interpreter";
import ScriptOutput from "../script-designer/output";
import shortid from "shortid";

export default {
  components: { PsoTypebar, PsoFormtableSetting, PsoFormTable, FormInterpreter, ScriptOutput },
  props: ["params"],
  data() {
    return {
      typeVal: {
        feildvalue: ""
      },
      selectedNode: {},
      centerData: {},
      formTableCfgData: {},
      showFormPage: false,
      loadingCenter: false
    };
  },
  computed: {
    treeOptions() {
      return {
        data_type: "unit",
        tp_type: this.typeVal.feildvalue,
        node_id: this.typeVal.node_id,
        searchtype: "Tp",
        node_dimen: "NODEDIMEN04"
      };
    },
    defalutNodeData() {
      return {
        data_type: "unit",
        tp_type: this.typeVal.feildvalue,
        searchtype: "Tp",
        node_dimen: "NODEDIMEN04"
      };
    },
    tableSettingOptions() {
      return {
        tpCode: this.selectedNode.tp_code || "",
        tpType: this.typeVal.feildvalue
      };
    }
  },
  methods: {
    isTempleteType() {
      return this.typeVal.feildvalue === 102;
    },
    isScriptType() {
      return this.typeVal.feildvalue === 101;
    },
    isFormType() {
      return this.typeVal.feildvalue === 103;
    },
    nodeBeforeEditHandler(data) {
      if (data.is_leaf !== 0) {
        data.tp_name = data.node_name;
        data.tp_code = shortid.generate();
        data.tp_status = "0";
        data.tp_type = this.typeVal.feildvalue;
      }
    },
    nodeClickHandler(node) {
      this.selectedNode = node;
      if (this.isScriptType() || this.isTempleteType() || this.isFormType()) {
        this.getViewData();
      }
    },
    nodeEditHandler(payload) {
      payload.node.data.is_leaf && this.handleCenterEdit(payload.node.data.tp_code);
    },
    nodeNewdHandler(data) {
      this.handleCenterEdit(data.tp_code, false);
    },
    async getViewData() {
      const data = this.selectedNode;
      this.loadingCenter = true;
      let ret = await this.API.templates({ data: { tp_type: this.typeVal.feildvalue, tp_code: data.tp_code } });
      this.loadingCenter = false;
      try {
        if (this.isTempleteType()) {
          this.centerData = { data_code: shortid.generate(), data_config: JSON.parse(ret.data.tp_set) };
        } else {
          this.centerData = JSON.parse(ret.data.tp_set);
        }
      } catch (error) {}
    },
    handleCenterEdit(tpCode, edit = true) {
      if (this.isFormType()) {
        if (edit) {
          this.formTableCfgData = this.centerData;
        } else {
          this.formTableCfgData = {};
        }
        this.showFormPage = true;
      } else if (this.isScriptType() || this.isTempleteType()) {
        this.$emit("designer", { tpCode: tpCode, tpType: this.typeVal.feildvalue });
      }
    }
  }
};
</script>
<style lang="less" scoped>
</style>